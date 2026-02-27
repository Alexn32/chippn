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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { getUserChores } from '../../lib/queries';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme/tokens';

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
        return colors.success;
      case 'overdue':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.text.secondary;
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
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : 'Overdue'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chores List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
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
            <TouchableOpacity
              key={chore.id}
              onPress={() => handleCompleteChore(chore.id)}
              activeOpacity={0.6}
            >
              <Card variant="elevated" padding="lg" style={styles.choreCard}>
                <View style={styles.choreHeader}>
                  <View style={styles.choreTitle}>
                    <Text style={styles.choreName}>{chore.chores.name}</Text>
                    {chore.chores.description && (
                      <Text style={styles.choreDescription}>
                        {chore.chores.description}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { borderColor: getStatusColor(chore.status) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(chore.status) },
                      ]}
                    >
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
                    <Text style={styles.metaLabel}>🔄 {chore.chores.frequency}</Text>
                  </View>
                </View>

                {chore.status === 'pending' && (
                  <Button
                    onPress={() => handleCompleteChore(chore.id)}
                    variant="primary"
                    size="small"
                    fullWidth
                    style={{ marginTop: spacing.md }}
                  >
                    Mark Complete
                  </Button>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  filterTab: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary[500],
  },
  filterText: {
    ...typography.label,
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.text.inverse,
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
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  list: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },

  choreCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  choreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  choreTitle: {
    flex: 1,
  },
  choreName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  choreDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginLeft: spacing.md,
  },
  statusText: {
    ...typography.labelSmall,
    fontWeight: '600',
  },

  choreMetaContainer: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  choreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaLabel: {
    ...typography.labelSmall,
    color: colors.text.secondary,
  },
  metaValue: {
    ...typography.labelSmall,
    color: colors.text.primary,
    fontWeight: '600',
  },
});
