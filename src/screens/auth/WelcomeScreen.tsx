import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';

type Props = NativeStackScreenProps<any, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.logo}>🧹</Text>
          <Text style={styles.appName}>Chippn</Text>
          <Text style={styles.tagline}>
            Skip the awkward roommate conversations.{'\n'}
            Fair chores, zero drama.
          </Text>
        </View>

        {/* Features */}
        <Card variant="elevated" padding="xl" style={styles.featuresCard}>
          <Feature
            icon="✨"
            title="Fair distribution"
            description="Everyone chips in equally"
          />
          <Feature
            icon="📸"
            title="Photo proof"
            description="AI verifies completed chores"
          />
          <Feature
            icon="💬"
            title="Anonymous chat"
            description="Say what needs to be said"
          />
          <Feature
            icon="📊"
            title="Real accountability"
            description="Everyone sees who's keeping up"
          />
        </Card>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.navigate('SignUp')}
            variant="primary"
            fullWidth
          >
            Get Started Free
          </Button>

          <Button
            onPress={() => navigation.navigate('SignIn')}
            variant="secondary"
            fullWidth
          >
            Sign In
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIconContainer}>
        <Text style={styles.featureIcon}>{icon}</Text>
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
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
    paddingVertical: spacing.xxxxl,
    paddingBottom: spacing.xxxl,
  },

  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxxxl,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  appName: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
  },

  // Features
  featuresCard: {
    marginBottom: spacing.xxxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureContent: {
    flex: 1,
    paddingTop: 2,
  },
  featureTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: 2,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },

  // Buttons
  buttonContainer: {
    gap: spacing.md,
  },
});
