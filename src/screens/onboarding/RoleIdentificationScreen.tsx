import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Button from '../../components/UI/Button';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme/tokens';

const roles = [
  {
    id: 1,
    emoji: '😤',
    title: 'House Mom/Dad',
    subtitle: 'You end up doing everything',
  },
  {
    id: 2,
    emoji: '😬',
    title: 'The Avoider',
    subtitle: "Hard to bring up cleaning issues",
  },
  {
    id: 3,
    emoji: '🤷',
    title: 'Middle Person',
    subtitle: "Try asking, but it doesn't help",
  },
  {
    id: 4,
    emoji: '✅',
    title: 'Fair System Seeker',
    subtitle: 'Looking for balance for everyone',
  },
];

export default function RoleIdentificationScreen({ navigation }: any) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.progress}>
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Which role sounds like you?</Text>
          <Text style={styles.subtitle}>Helps us personalize your experience</Text>
        </View>

        {/* Roles */}
        <View style={styles.rolesContainer}>
          {roles.map(role => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                selected === role.id && styles.roleCardSelected,
              ]}
              onPress={() => setSelected(role.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.emojiContainer,
                  selected === role.id && styles.emojiContainerActive,
                ]}
              >
                <Text style={styles.emoji}>{role.emoji}</Text>
              </View>
              <View style={styles.roleContent}>
                <Text
                  style={[
                    styles.roleTitle,
                    selected === role.id && styles.roleTitleActive,
                  ]}
                >
                  {role.title}
                </Text>
                <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Button */}
      <View style={styles.footer}>
        <Button
          onPress={() => navigation.navigate('SetupChoice')}
          variant="primary"
          fullWidth
          disabled={!selected}
        >
          Continue
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
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 120,
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
    marginBottom: spacing.xxl,
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

  rolesContainer: {
    gap: spacing.md,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  roleCardSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },

  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
    marginTop: 2,
  },
  emojiContainerActive: {
    backgroundColor: colors.primary[100],
  },
  emoji: {
    fontSize: 28,
  },

  roleContent: {
    flex: 1,
  },
  roleTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  roleTitleActive: {
    color: colors.primary[700],
  },
  roleSubtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    ...shadows.lg,
  },
});
