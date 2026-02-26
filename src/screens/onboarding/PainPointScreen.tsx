import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function PainPointScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Do you struggle with chores?</Text>
        <Text style={styles.subtitle}>getting done around your home with your roommates?</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LivingSituation')}
          >
            <Text style={styles.buttonText}>Yes, absolutely</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('LivingSituation')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Not sure, continue anyway</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40 },
  buttonContainer: { gap: 12 },
  button: { backgroundColor: '#10B981', borderRadius: 8, padding: 16, alignItems: 'center' },
  secondaryButton: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButtonText: { color: '#111827' },
});
