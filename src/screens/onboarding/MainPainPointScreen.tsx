import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const painPoints = [
  'Chores don\'t get done on time',
  'It\'s always the same person doing everything',
  'Nobody knows whose turn it is',
  'Awkward to ask people to clean up',
  'Arguments about who does more work',
  'Can\'t prove if something was actually done',
];

export default function MainPainPointScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>What's your biggest challenge?</Text>
        <Text style={styles.subtitle}>Select up to 3</Text>

        {painPoints.map(point => (
          <TouchableOpacity
            key={point}
            style={[styles.option, selected.includes(point) && styles.optionSelected]}
            onPress={() => {
              if (selected.includes(point)) {
                setSelected(selected.filter(p => p !== point));
              } else if (selected.length < 3) {
                setSelected([...selected, point]);
              }
            }}
          >
            <Text style={selected.includes(point) ? styles.optionTextSelected : styles.optionText}>
              {selected.includes(point) ? '✓ ' : '○ '}{point}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
        onPress={() => navigation.navigate('RoleIdentification')}
        disabled={selected.length === 0}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24 },
  option: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 16, marginBottom: 12 },
  optionSelected: { backgroundColor: '#F0FDF4', borderColor: '#10B981' },
  optionText: { fontSize: 16, color: '#6B7280' },
  optionTextSelected: { fontSize: 16, color: '#10B981', fontWeight: '600' },
  button: { backgroundColor: '#10B981', borderRadius: 8, padding: 16, alignItems: 'center', margin: 20 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
