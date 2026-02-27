import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useHousehold } from '../../context/HouseholdContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';

const setupOptions = [
  {
    id: 'create',
    emoji: '➕',
    title: 'Create Household',
    subtitle: 'Invite your roommates',
  },
  {
    id: 'join',
    emoji: '🔗',
    title: 'Join Household',
    subtitle: 'Use an invite code',
  },
  {
    id: 'explore',
    emoji: '👀',
    title: 'Explore First',
    subtitle: 'Try the demo',
  },
];

export default function SetupChoiceScreen({ navigation }: any) {
  const { createHousehold, joinHousehold, loading } = useHousehold();
  const [choice, setChoice] = useState<'create' | 'join' | 'explore' | null>(null);
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [errors, setErrors] = useState<{ name?: string; code?: string }>({});

  const handleCreate = async () => {
    if (!householdName.trim()) {
      setErrors({ name: 'Household name required' });
      return;
    }
    try {
      await createHousehold(householdName);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create household');
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setErrors({ code: 'Invite code required' });
      return;
    }
    try {
      await joinHousehold(inviteCode);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid invite code');
    }
  };

  const handleExplore = () => {
    handleCreate();
  };

  // Choice Selection View
  if (!choice) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress */}
          <View style={styles.progress}>
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
            <View style={[styles.progressBar, styles.progressActive]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Ready to get started?</Text>
            <Text style={styles.subtitle}>
              Create a new household or join your roommates
            </Text>
          </View>

          {/* Options */}
          {setupOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() => setChoice(option.id as any)}
              activeOpacity={0.7}
            >
              <Card variant="elevated" padding="xl">
                <View style={styles.optionContent}>
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                  <Text style={styles.optionArrow}>→</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Create Household View
  if (choice === 'create') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => {
              setChoice(null);
              setHouseholdName('');
              setErrors({});
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.formHeader}>
            <Text style={styles.title}>Create a Household</Text>
            <Text style={styles.subtitle}>Give it a fun name</Text>
          </View>

          <Input
            label="Household Name"
            placeholder="e.g., 'The Apartment' or 'Grad House'"
            value={householdName}
            onChangeText={(text) => {
              setHouseholdName(text);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            editable={!loading}
            error={errors.name}
          />

          <Button
            onPress={handleCreate}
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
            style={{ marginTop: spacing.xl }}
          >
            Create Household
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Join Household View
  if (choice === 'join') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => {
              setChoice(null);
              setInviteCode('');
              setErrors({});
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.formHeader}>
            <Text style={styles.title}>Join a Household</Text>
            <Text style={styles.subtitle}>Ask a roommate for the code</Text>
          </View>

          <Input
            label="Invite Code"
            placeholder="e.g., ABC123XYZ"
            value={inviteCode}
            onChangeText={(text) => {
              setInviteCode(text.toUpperCase());
              if (errors.code) setErrors({ ...errors, code: undefined });
            }}
            editable={!loading}
            error={errors.code}
            autoCapitalize="characters"
          />

          <Button
            onPress={handleJoin}
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
            style={{ marginTop: spacing.xl }}
          >
            Join Household
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  formContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  progress: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xxxl,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.full,
  },
  progressActive: {
    backgroundColor: colors.primary[500],
  },

  header: {
    marginBottom: spacing.xxxl,
  },
  formHeader: {
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },

  backButton: {
    ...typography.body,
    color: colors.primary[500],
    marginBottom: spacing.xxl,
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  optionEmoji: {
    fontSize: 40,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  optionSubtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  optionArrow: {
    ...typography.body,
    color: colors.primary[500],
    fontSize: 24,
  },
});
