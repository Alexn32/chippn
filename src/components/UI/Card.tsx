import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof spacing;
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'lg',
  style,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        { padding: spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  default: {
    backgroundColor: colors.surface,
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    ...shadows.md,
  },
  outlined: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
});
