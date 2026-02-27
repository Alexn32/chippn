import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Card from '../../components/UI/Card';
import { colors, spacing, typography } from '../../theme/tokens';

export default function HouseholdDashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card variant="elevated">
          <Text style={styles.title}>Household Dashboard</Text>
          <Text style={styles.subtitle}>Coming soon — real-time insights about your household</Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});
