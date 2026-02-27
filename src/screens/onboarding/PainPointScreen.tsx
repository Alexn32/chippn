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

export default function PainPointScreen({ navigation }: any) {
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
          <View style={styles.progressBar} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Do you struggle with chores at home?</Text>
          <Text style={styles.subtitle}>
            Getting things done with your roommates
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <Button
            onPress={() => navigation.navigate('LivingSituation')}
            variant="primary"
            fullWidth
          >
            Yes, absolutely
          </Button>

          <Button
            onPress={() => navigation.navigate('LivingSituation')}
            variant="secondary"
            fullWidth
          >
            Not sure, continue anyway
          </Button>
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
    justifyContent: 'center',
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

  buttons: {
    gap: spacing.md,
  },
});
