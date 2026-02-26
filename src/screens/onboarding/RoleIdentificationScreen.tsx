import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const roles = [
  { emoji: '😤', title: 'House Mom/Dad', subtitle: 'Tired of doing everything' },
  { emoji: '😬', title: 'The Avoider', subtitle: 'Avoid bringing up cleaning issues' },
  { emoji: '🤷', title: 'Middle Person', subtitle: "Don't mind asking, but it doesn't help" },
  { emoji: '✅', title: 'Fair System Seeker', subtitle: 'Want a fair system for everyone' },
];

export default function RoleIdentificationScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Which describes you?</Text>

        {roles.map(role => (
          <TouchableOpacity
            key={role.title}
            style={[styles.roleCard, selected === role.title && styles.roleCardSelected]}
            onPress={() => setSelected(role.title)}
          >
            <Text style={styles.roleEmoji}>{role.emoji}</Text>
            <View style={styles.roleText}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, !selected && styles.buttonDisabled]}
          onPress={() => navigation.navigate('SetupChoice')}
          disabled={!selected}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 32 },
  roleCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, marginBottom: 12 },
  roleCardSelected: { backgroundColor: '#F0FDF4', borderColor: '#10B981' },
  roleEmoji: { fontSize: 32, marginRight: 16 },
  roleText: { flex: 1 },
  roleTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  roleSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  button: { backgroundColor: '#10B981', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
