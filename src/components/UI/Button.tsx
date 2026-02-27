import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme/tokens';

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'large' | 'medium' | 'small';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.text.inverse : colors.primary[500]} />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Variants
  primaryButton: {
    backgroundColor: colors.primary[500],
    ...shadows.sm,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },

  // Sizes
  largeButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minHeight: 56,
  },
  mediumButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  smallButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 40,
  },

  // Text variants
  text: {
    textAlign: 'center',
  },
  primaryText: {
    ...typography.button,
    color: colors.text.inverse,
  },
  secondaryText: {
    ...typography.button,
    color: colors.text.primary,
  },
  ghostText: {
    ...typography.button,
    color: colors.primary[500],
  },

  // Text sizes
  largeText: {
    fontSize: 16,
  },
  mediumText: {
    fontSize: 15,
  },
  smallText: {
    fontSize: 14,
  },

  // States
  disabled: {
    opacity: 0.4,
  },
  fullWidth: {
    width: '100%',
  },
});
