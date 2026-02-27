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
import { getHouseholdMembers } from '../../lib/queries';

export default function HouseholdScreen() {
  const { user } = useAuth();
  const { household } = useHousehold();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [household?.id]);

  const loadMembers = async () => {
    if (!household?.id) return;
    try {
      const data = await getHouseholdMembers(household.id);
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = async () => {
    if (!household?.invite_code) return;
    try {
      // React Native doesn't have native clipboard, use expo
      Alert.alert('Invite Code', `${household.invite_code}\n\nCopied! Share with roommates.`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy invite code');
    }
  };

  if (!household) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>No household selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Household Header */}
        <View style={styles.header}>
          <Text style={styles.householdName}>{household.name}</Text>
          <Text style={styles.subtitle}>Your roommate household</Text>
        </View>

        {/* Invite Code Card */}
        <View style={styles.inviteCard}>
          <Text style={styles.inviteLabel}>Invite Code</Text>
          <Text style={styles.inviteCode}>{household.invite_code}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyInviteCode}>
            <Text style={styles.copyButtonText}>
              {copied ? '✓ Copied!' : '📋 Copy Invite Code'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.inviteHint}>Share this with your roommates to let them join</Text>
        </View>

        {/* Members Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Household Members ({members.length})</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#10B981" />
          ) : (
            <View style={styles.membersList}>
              {members.map(member => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.avatarText}>
                      {member.users?.display_name?.[0]?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.users?.display_name || 'Unknown'}
                      {member.user_id === user?.id && ' (You)'}
                    </Text>
                    <Text style={styles.memberEmail}>{member.users?.email || 'No email'}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Invite More Section */}
        <TouchableOpacity style={styles.inviteMoreButton}>
          <Text style={styles.inviteMoreText}>+ Invite Another Roommate</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 32,
  },
  householdName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  inviteCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: colors.primary[500],
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  inviteLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inviteCode: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: 16,
    letterSpacing: 2,
  },
  copyButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  inviteHint: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  membersList: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  memberEmail: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  inviteMoreButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  inviteMoreText: {
    color: colors.primary[500],
    fontSize: 16,
    fontWeight: '600',
  },
});
