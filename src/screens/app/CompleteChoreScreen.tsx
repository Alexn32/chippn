import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { completeChore, uploadChorePhoto } from '../../lib/queries';
import { verifyPhotoWithClaude } from '../../lib/claude';
import { useHousehold } from '../../context/HouseholdContext';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme/tokens';

export default function CompleteChoreScreen({ route, navigation }: any) {
  const { assignmentId } = route.params;
  const { household } = useHousehold();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState<any>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll access required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setVerification(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setVerification(null);
    }
  };

  const verifyPhoto = async () => {
    if (!photoUri) {
      Alert.alert('Error', 'No photo selected');
      return;
    }

    setVerifying(true);
    try {
      const result = await verifyPhotoWithClaude(photoUri);
      setVerification(result);
    } catch (error) {
      Alert.alert('Verification Error', error instanceof Error ? error.message : 'Failed to verify photo');
    } finally {
      setVerifying(false);
    }
  };

  const handleCompleteWithPhoto = async () => {
    if (!photoUri) {
      Alert.alert('Error', 'No photo selected');
      return;
    }

    if (!household?.id) {
      Alert.alert('Error', 'No household found');
      return;
    }

    setLoading(true);
    try {
      const photoUrl = await uploadChorePhoto(household.id, assignmentId, photoUri);
      await completeChore(
        assignmentId,
        photoUrl,
        verification?.verified
      );

      Alert.alert('Success', '✅ Chore completed!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to complete chore');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWithoutPhoto = async () => {
    setLoading(true);
    try {
      await completeChore(assignmentId);
      Alert.alert('Success', '✅ Chore completed!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to complete chore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Complete Chore</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {!photoUri ? (
            <>
              <Card variant="elevated" padding="xl" style={styles.placeholder}>
                <View style={styles.placeholderContent}>
                  <Text style={styles.placeholderEmoji}>📸</Text>
                  <Text style={styles.placeholderText}>Add a photo for verification</Text>
                  <Text style={styles.placeholderSubtext}>Optional, but helps your roommates</Text>
                </View>
              </Card>

              <View style={styles.buttonGroup}>
                <Button
                  onPress={takePhoto}
                  variant="primary"
                  fullWidth
                >
                  📷 Take Photo
                </Button>

                <Button
                  onPress={pickImage}
                  variant="secondary"
                  fullWidth
                >
                  🖼️ Choose from Gallery
                </Button>
              </View>
            </>
          ) : (
            <>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />

              <Button
                onPress={() => setPhotoUri(null)}
                variant="secondary"
                fullWidth
                style={{ marginBottom: spacing.lg }}
              >
                Change Photo
              </Button>

              {!verification && (
                <Button
                  onPress={verifyPhoto}
                  variant="primary"
                  fullWidth
                  loading={verifying}
                  disabled={verifying}
                  style={{ marginBottom: spacing.lg }}
                >
                  🤖 Verify with AI
                </Button>
              )}

              {verification && (
                <Card
                  variant={verification.verified ? 'default' : 'outlined'}
                  padding="lg"
                  style={[
                    styles.verificationResult,
                    verification.verified && styles.verificationSuccess,
                  ]}
                >
                  <Text
                    style={[
                      styles.verificationTitle,
                      {
                        color: verification.verified
                          ? colors.success
                          : colors.error,
                      },
                    ]}
                  >
                    {verification.verified ? '✅ Looks good!' : '❌ Couldn\'t verify'}
                  </Text>
                  <Text style={styles.verificationMessage}>
                    {verification.reasoning}
                  </Text>

                  {!verification.verified && (
                    <Button
                      onPress={handleCompleteWithoutPhoto}
                      variant="ghost"
                      fullWidth
                      style={{ marginTop: spacing.md }}
                    >
                      Skip verification anyway
                    </Button>
                  )}
                </Card>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button
          onPress={photoUri ? handleCompleteWithPhoto : handleCompleteWithoutPhoto}
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {photoUri ? 'Complete Chore' : 'Complete Without Photo'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    ...typography.body,
    color: colors.primary[500],
    marginRight: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },

  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxxl,
  },

  placeholder: {
    marginBottom: spacing.xl,
  },
  placeholderContent: {
    alignItems: 'center',
    paddingVertical: spacing.xxxxl,
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  placeholderText: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  placeholderSubtext: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },

  buttonGroup: {
    gap: spacing.md,
  },

  photoPreview: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },

  verificationResult: {
    marginVertical: spacing.lg,
  },
  verificationSuccess: {
    backgroundColor: colors.primary[50],
  },
  verificationTitle: {
    ...typography.bodyMedium,
    marginBottom: spacing.sm,
  },
  verificationMessage: {
    ...typography.body,
    color: colors.text.secondary,
  },

  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.background,
    ...shadows.lg,
  },
});
