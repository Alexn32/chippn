import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator } from 'react-native';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { HouseholdProvider } from './src/context/HouseholdContext';
import RootNavigator from './src/navigation/RootNavigator';

// Initialize RevenueCat
const initializeRevenueCat = async () => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
    
    if (!apiKey) {
      console.error('RevenueCat API key not configured');
      return;
    }

    // Enable debug logs in development
    if (__DEV__) {
      await Purchases.setDebugLogsEnabled(true);
    }

    // Initialize RevenueCat
    await Purchases.configure({
      apiKey,
      appUserID: undefined, // Let RevenueCat auto-generate
    });

    console.log('✅ RevenueCat initialized');
  } catch (error) {
    console.error('❌ RevenueCat init failed:', error);
  }
};

function AppContent() {
  const { user, loading } = useAuth();

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ fontSize: 48, marginBottom: 20 }}>🧹</Text>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 20, color: '#6B7280' }}>Loading Chippn...</Text>
      </View>
    );
  }

  return (
    <HouseholdProvider>
      <RootNavigator />
    </HouseholdProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
