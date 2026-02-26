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
  Switch,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useSubscription } from '../../hooks/useSubscription';
import { getCurrentUser } from '../../lib/queries';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { household, leaveHousehold } = useHousehold();
  const { isPremium, isTrialing, expiryDate } = useSubscription();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    try {
      if (user?.id) {
        const data = await getCurrentUser();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleLeaveHousehold = () => {
    Alert.alert(
      'Leave Household',
      'Are you sure? You can rejoin with the invite code.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Leave',
          onPress: async () => {
            try {
              await leaveHousehold();
              Alert.alert('Left', 'You have left the household');
            } catch (error) {
              Alert.alert('Error', 'Failed to leave household');
            }
          },
        },
      ]
    );
  };

  const handleSubscribe = () => {
    navigation.navigate('Paywall');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* User Info */}
        {loading ? (
          <ActivityIndicator size="large" color="#10B981" />
        ) : (
          <>
            <View style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {profile?.display_name?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{profile?.display_name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>

            {/* Subscription Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Subscription</Text>

              {isPremium ? (
                <View style={styles.premiumCard}>
                  <Text style={styles.premiumTitle}>✨ Chippn Pro</Text>
                  <Text style={styles.premiumText}>
                    {isTrialing ? 'Trial active' : 'Premium active'}
                  </Text>
                  {expiryDate && (
                    <Text style={styles.premiumExpiry}>
                      Expires {expiryDate.toLocaleDateString()}
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.freeCard}>
                  <Text style={styles.freeTitle}>Free Tier</Text>
                  <Text style={styles.freeText}>Upgrade to unlock all features</Text>
                  <TouchableOpacity style={styles.upgradeButton} onPress={handleSubscribe}>
                    <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingLabel}>
                  <Text style={styles.settingName}>🔔 Push Notifications</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor={notifications ? '#fff' : '#fff'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingLabel}>
                  <Text style={styles.settingName}>🏠 Current Household</Text>
                  <Text style={styles.settingValue}>{household?.name || 'None'}</Text>
                </View>
              </View>
            </View>

            {/* Household Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Household</Text>

              <TouchableOpacity style={styles.actionButton} onPress={handleLeaveHousehold}>
                <Text style={styles.actionButtonText}>👋 Leave Household</Text>
              </TouchableOpacity>
            </View>

            {/* Account Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>

              <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
                <Text style={styles.dangerButtonText}>🚪 Sign Out</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Chippn v1.0.0</Text>
              <Text style={styles.footerSubtext}>Made with 💚 for better roommates</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  premiumCard: {
    backgroundColor: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  premiumText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  premiumExpiry: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  freeCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  freeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  freeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  settingLabel: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingValue: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DC2626',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
});
