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
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { colors, spacing, typography } from '../../theme/tokens';

export default function SignInScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSignIn = async () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = 'Email required';
    if (!password) newErrors.password = 'Password required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Sign In Failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            secureTextEntry
            editable={!loading}
            error={errors.password}
            containerStyle={{ marginTop: spacing.lg }}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => Alert.alert('TODO', 'Password reset coming soon')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <Button
            onPress={handleSignIn}
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
            style={{ marginTop: spacing.xl }}
          >
            Sign In
          </Button>
        </View>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
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

  backButton: {
    ...typography.body,
    color: colors.primary[500],
    marginBottom: spacing.xxl,
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

  form: {
    marginBottom: spacing.xxxl,
  },

  forgotPassword: {
    ...typography.body,
    color: colors.primary[500],
    textAlign: 'right',
    marginTop: spacing.md,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  footerLink: {
    ...typography.bodyMedium,
    color: colors.primary[500],
  },
});
