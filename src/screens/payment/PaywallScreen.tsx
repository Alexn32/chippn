import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Purchases from 'react-native-purchases';

export default function PaywallScreen() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current?.availablePackages[0]) {
        const { customerInfo } = await Purchases.purchasePackage(offerings.current.availablePackages[0]);
        if (customerInfo.entitlements.active['Chippn2 Pro']) {
          Alert.alert('Success', '🎉 Welcome to Chippn Pro!');
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>🧹 Chippn Pro</Text>
        <Text style={styles.subtitle}>$4.99/month • Keep your household running smooth</Text>

        <View style={styles.features}>
          <Feature icon="✅" text="Unlimited chores" />
          <Feature icon="✅" text="AI photo verification" />
          <Feature icon="✅" text="Anonymous chat" />
          <Feature icon="✅" text="Smart rotation algorithm" />
          <Feature icon="✅" text="Push notifications" />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Subscribe Now</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.terms}>Subscription auto-renews. Cancel anytime.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 20 },
  title: { fontSize: 32, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
  features: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 20, marginBottom: 32 },
  feature: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  featureIcon: { fontSize: 20, marginRight: 12 },
  featureText: { fontSize: 16, color: '#111827' },
  button: { backgroundColor: '#10B981', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 12 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  terms: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
});
