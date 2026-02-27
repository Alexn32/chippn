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

export default function SignUpScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSignUp = async () => {
    const newErrors: typeof errors = {};

    if (!name) newErrors.name = 'Name required';
    if (!email) newErrors.email = 'Email required';
    if (!password) newErrors.password = 'Password required';
    if (password && password.length < 6) newErrors.password = 'At least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      Alert.alert('Account Created!', 'Check your email to confirm your account.', [
        { text: 'Got it', onPress: () => navigation.navigate('SignIn') },
      ]);
    } catch (error) {
      Alert.alert('Sign Up Failed', error instanceof Error ? error.message : 'Please try again');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Chippn and fix roommate chaos</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Your name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            editable={!loading}
            error={errors.name}
          />

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
            containerStyle={{ marginTop: spacing.lg }}
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

          {/* Sign Up Button */}
          <Button
            onPress={handleSignUp}
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
            style={{ marginTop: spacing.xl }}
          >
            Create Account
          </Button>
        </View>

        {/* Sign In Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.footerLink}>Sign In</Text>
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
