import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Button from '../../components/UI/Button';
import { colors, spacing, typography } from '../../theme/tokens';

const options = ['1', '2', '3+', 'I\'ll have roommates soon'];

export default function LivingSituationScreen({ navigation }: any) {
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
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How many roommates do you have?</Text>
          <Text style={styles.subtitle}>This helps us set up the right structure</Text>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {options.map(option => (
            <Button
              key={option}
              onPress={() => navigation.navigate('MainPainPoint')}
              variant="secondary"
              fullWidth
            >
              {option} {option === '1' ? 'roommate' : option === '2' ? 'roommates' : option === '3+' ? 'roommates' : 'soon'}
            </Button>
          ))}
        </View>
      </ScrollView>
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
    borderRadius: 9999,
  },
  progressActive: {
    backgroundColor: colors.primary[500],
  },

  header: {
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

  options: {
    gap: spacing.md,
  },
});
