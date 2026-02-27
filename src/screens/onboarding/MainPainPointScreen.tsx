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

const painPoints = [
  { id: 1, text: 'Chores don\'t get done on time', icon: '⏰' },
  { id: 2, text: 'It\'s always the same person doing everything', icon: '😤' },
  { id: 3, text: 'Nobody knows whose turn it is', icon: '🤷' },
  { id: 4, text: 'Awkward to ask people to clean up', icon: '😬' },
  { id: 5, text: 'Arguments about who does more work', icon: '💢' },
  { id: 6, text: 'Can\'t prove if something was actually done', icon: '🔍' },
];

export default function MainPainPointScreen({ navigation }: any) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(p => p !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress indicator */}
        <View style={styles.progress}>
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What's your biggest challenge?</Text>
          <Text style={styles.subtitle}>
            Pick up to 3 — helps us personalize your experience
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {painPoints.map(point => {
            const isSelected = selected.includes(point.id);
            return (
              <TouchableOpacity
                key={point.id}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
                onPress={() => toggleSelection(point.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionIcon}>{point.icon}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {point.text}
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed bottom button */}
      <View style={styles.footer}>
        <Button
          onPress={() => navigation.navigate('RoleIdentification')}
          variant="primary"
          fullWidth
          disabled={selected.length === 0}
        >
          {selected.length === 0
            ? 'Select at least 1'
            : `Continue (${selected.length}/3)`}
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
    paddingBottom: 100, // Space for fixed button
  },

  // Progress
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

  // Header
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
    lineHeight: 22,
  },

  // Options
  optionsContainer: {
    gap: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  optionSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  optionTextSelected: {
    ...typography.bodyMedium,
    color: colors.primary[700],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '700',
  },

  // Footer
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
