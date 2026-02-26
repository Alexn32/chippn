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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { completeChore, uploadChorePhoto } from '../../lib/queries';
import { verifyPhotoWithClaude } from '../../lib/claude';

export default function CompleteChoreScreen({ route, navigation }: any) {
  const { assignmentId } = route.params;
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

    setLoading(true);
    try {
      // Upload photo
      const photoUrl = await uploadChorePhoto('household-id', assignmentId, photoUri);
      
      // Mark as complete with verification result
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Complete Chore</Text>
      </View>

      <View style={styles.content}>
        {!photoUri ? (
          <>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderEmoji}>📸</Text>
              <Text style={styles.placeholderText}>No photo yet</Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
                <Text style={styles.buttonText}>📷 Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                <Text style={styles.secondaryButtonText}>🖼️ Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />

            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={() => setPhotoUri(null)}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>

            {!verification && (
              <TouchableOpacity
                style={[styles.verifyButton, verifying && styles.buttonDisabled]}
                onPress={verifyPhoto}
                disabled={verifying}
              >
                {verifying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.verifyButtonText}>🤖 Verify with AI</Text>
                )}
              </TouchableOpacity>
            )}

            {verification && (
              <View style={[styles.verificationResult, verification.verified && styles.verificationSuccess]}>
                <Text style={styles.verificationTitle}>
                  {verification.verified ? '✅ Verified!' : '❌ Not verified'}
                </Text>
                <Text style={styles.verificationMessage}>{verification.reason}</Text>

                {!verification.verified && (
                  <TouchableOpacity style={styles.skipButton} onPress={handleCompleteWithoutPhoto}>
                    <Text style={styles.skipButtonText}>Skip verification anyway</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.completeButton, loading && styles.buttonDisabled]}
                onPress={handleCompleteWithPhoto}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.completeButtonText}>Complete Chore</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {!photoUri && (
          <TouchableOpacity
            style={styles.skipPhotoButton}
            onPress={handleCompleteWithoutPhoto}
          >
            <Text style={styles.skipPhotoText}>Complete without photo</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  photoPreview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  changePhotoButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  changePhotoText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  verificationResult: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  verificationSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  verificationMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  skipButton: {
    marginTop: 12,
    padding: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
  },
  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipPhotoButton: {
    marginTop: 'auto',
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipPhotoText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
