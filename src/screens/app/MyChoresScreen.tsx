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
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { getUserChores } from '../../lib/queries';

interface Chore {
  id: string;
  chore_id: string;
  assigned_to: string;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  chores: {
    name: string;
    description?: string;
    frequency: string;
    requires_photo: boolean;
  };
}

export default function MyChoresScreen({ navigation }: any) {
  const { user } = useAuth();
  const { household } = useHousehold();
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    loadChores();
  }, [household?.id, user?.id]);

  const loadChores = async () => {
    if (!household?.id || !user?.id) return;
    try {
      const data = await getUserChores(user.id, household.id);
      setChores(data);
    } catch (error) {
      console.error('Failed to load chores:', error);
      Alert.alert('Error', 'Failed to load chores');
    } finally {
      setLoading(false);
    }
  };

  const filteredChores = chores.filter(c => {
    if (filter === 'pending') return c.status === 'pending';
    if (filter === 'overdue') return c.status === 'overdue';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'overdue':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓ Done';
      case 'overdue':
        return '⚠️ Overdue';
      case 'pending':
        return '📅 Pending';
      default:
        return status;
    }
  };

  const handleCompleteChore = (choreId: string) => {
    navigation.navigate('CompleteChore', { assignmentId: choreId });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'pending', 'overdue'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[styles.filterText, filter === f && styles.filterTextActive]}
            >
              {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : 'Overdue'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chores List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : filteredChores.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySubtitle}>No {filter} chores right now</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 100 }}>
          {filteredChores.map(chore => (
            <View key={chore.id} style={styles.choreCard}>
              <View style={styles.choreHeader}>
                <View style={styles.choreTitle}>
                  <Text style={styles.choreName}>{chore.chores.name}</Text>
                  {chore.chores.description && (
                    <Text style={styles.choreDescription}>{chore.chores.description}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { borderColor: getStatusColor(chore.status) },
                  ]}
                >
                  <Text style={[styles.statusText, { color: getStatusColor(chore.status) }]}>
                    {getStatusLabel(chore.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.choreMetaContainer}>
                <View style={styles.choreMeta}>
                  <Text style={styles.metaLabel}>📅 Due:</Text>
                  <Text style={styles.metaValue}>
                    {new Date(chore.due_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.choreMeta}>
                  <Text style={styles.metaLabel}>⏱️ {chore.chores.frequency}</Text>
                </View>
                {chore.chores.requires_photo && (
                  <View style={styles.choreMeta}>
                    <Text style={styles.metaLabel}>📸 Photo required</Text>
                  </View>
                )}
              </View>

              {chore.status === 'pending' && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => handleCompleteChore(chore.id)}
                >
                  <Text style={styles.completeButtonText}>Complete Chore</Text>
                </TouchableOpacity>
              )}

              {chore.status === 'completed' && (
                <View style={styles.completedBanner}>
                  <Text style={styles.completedText}>
                    ✓ Completed {chore.completed_at ? 'recently' : ''}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  filterTabActive: {
    backgroundColor: '#10B981',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#fff',
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
  statusBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  choreMetaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  choreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completedBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  completedText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
});
