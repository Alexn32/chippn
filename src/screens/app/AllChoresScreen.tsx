import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useHousehold } from '../../context/HouseholdContext';
import { getHouseholdChores } from '../../lib/queries';

interface Chore {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  assignment_type: string;
  assigned_to?: string;
  users?: {
    display_name: string;
  };
}

export default function AllChoresScreen({ navigation }: any) {
  const { household } = useHousehold();
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChores();
  }, [household?.id]);

  const loadChores = async () => {
    if (!household?.id) return;
    try {
      const data = await getHouseholdChores(household.id);
      setChores(data);
    } catch (error) {
      console.error('Failed to load chores:', error);
      Alert.alert('Error', 'Failed to load chores');
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentDisplay = (chore: Chore) => {
    if (chore.assignment_type === 'rotating') {
      return '🔄 Rotating';
    }
    return `👤 ${chore.users?.display_name || 'Unassigned'}`;
  };

  const handleCreateChore = () => {
    Alert.alert('Coming Soon', 'Create chore feature coming in next update');
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : chores.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>No chores yet</Text>
          <Text style={styles.emptySubtitle}>Create one to get started!</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateChore}>
            <Text style={styles.createButtonText}>+ Create Chore</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 100 }}>
            {chores.map(chore => (
              <View key={chore.id} style={styles.choreCard}>
                <View style={styles.choreHeader}>
                  <View style={styles.choreTitle}>
                    <Text style={styles.choreName}>{chore.name}</Text>
                    {chore.description && (
                      <Text style={styles.choreDescription}>{chore.description}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.choreMetaContainer}>
                  <View style={styles.choreMeta}>
                    <Text style={styles.metaLabel}>
                      {getAssignmentDisplay(chore)}
                    </Text>
                  </View>
                  <View style={styles.choreMeta}>
                    <Text style={styles.metaLabel}>📅 {chore.frequency}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.fab} onPress={handleCreateChore}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  choreCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  choreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  choreTitle: {
    flex: 1,
  },
  choreName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  choreDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  choreMetaContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  choreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});
