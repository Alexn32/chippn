import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useHousehold } from '../../context/HouseholdContext';

export default function SetupChoiceScreen({ navigation }: any) {
  const { createHousehold, joinHousehold, loading } = useHousehold();
  const [choice, setChoice] = useState<'create' | 'join' | 'explore' | null>(null);
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleCreate = async () => {
    if (!householdName) {
      Alert.alert('Error', 'Please enter household name');
      return;
    }
    try {
      await createHousehold(householdName);
      // Navigation will happen automatically via context
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create household');
    }
  };

  const handleJoin = async () => {
    if (!inviteCode) {
      Alert.alert('Error', 'Please enter invite code');
      return;
    }
    try {
      await joinHousehold(inviteCode);
      // Navigation will happen automatically via context
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid invite code');
    }
  };

  const handleExplore = () => {
    // For now, just create a demo household
    handleCreate();
  };

  if (!choice) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Ready to set up?</Text>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setChoice('create')}
          >
            <Text style={styles.optionEmoji}>➕</Text>
            <Text style={styles.optionTitle}>Create Household</Text>
            <Text style={styles.optionSubtitle}>I'll invite my roommates</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setChoice('join')}
          >
            <Text style={styles.optionEmoji}>🔗</Text>
            <Text style={styles.optionTitle}>Join Household</Text>
            <Text style={styles.optionSubtitle}>I have an invite code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setChoice('explore')}
          >
            <Text style={styles.optionEmoji}>👀</Text>
            <Text style={styles.optionTitle}>Explore First</Text>
            <Text style={styles.optionSubtitle}>Show me around (demo)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (choice === 'create') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setChoice(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create Household</Text>

          <TextInput
            style={styles.input}
            placeholder="Household name (e.g., 'The Apartment')"
            value={householdName}
            onChangeText={setHouseholdName}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (choice === 'join') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setChoice(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Join Household</Text>

          <TextInput
            style={styles.input}
            placeholder="Invite code (e.g., ABC123)"
            value={inviteCode}
            onChangeText={setInviteCode}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleJoin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Join</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 20 },
  backButton: { fontSize: 16, color: '#10B981', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 32 },
  optionCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 24, marginBottom: 16, alignItems: 'center' },
  optionEmoji: { fontSize: 48, marginBottom: 12 },
  optionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  optionSubtitle: { fontSize: 14, color: '#6B7280' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 24 },
  button: { backgroundColor: '#10B981', borderRadius: 8, padding: 16, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
