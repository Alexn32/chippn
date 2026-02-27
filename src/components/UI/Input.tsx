import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function Input({
  label,
  error,
  containerStyle,
  ...props
}: InputProps) {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.text.tertiary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text.primary,
    ...shadows.sm,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    ...typography.labelSmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
