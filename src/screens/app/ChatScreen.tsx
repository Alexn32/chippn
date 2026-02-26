import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { getHouseholdMessages, sendMessage } from '../../lib/queries';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  is_anonymous: boolean;
  created_at: string;
  users?: {
    display_name: string;
  };
}

export default function ChatScreen() {
  const { user } = useAuth();
  const { household } = useHousehold();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
    // In a real app, set up Supabase realtime subscription here
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [household?.id]);

  const loadMessages = async () => {
    if (!household?.id) return;
    try {
      const data = await getHouseholdMessages(household.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !household?.id) return;

    setSending(true);
    try {
      await sendMessage(household.id, user.id, newMessage, isAnonymous);
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = (item: Message) => {
    const isOwn = item.sender_id === user?.id;
    const senderName = item.is_anonymous ? 'Anonymous' : (item.users?.display_name || 'Unknown');

    return (
      <View
        style={[
          styles.messageContainer,
          isOwn && styles.messageContainerOwn,
        ]}
      >
        {!isOwn && <Text style={styles.senderName}>{senderName}</Text>}
        <View
          style={[
            styles.messageBubble,
            isOwn && styles.messageBubbleOwn,
            item.is_anonymous && styles.messageBubbleAnonymous,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwn && styles.messageTextOwn,
            ]}
          >
            {item.message}
          </Text>
          {item.is_anonymous && !isOwn && (
            <Text style={styles.anonymousLabel}>🔒 Anonymous</Text>
          )}
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <>
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>
                Start the conversation with your roommates!
              </Text>
            </View>
          ) : (
            <FlatList
              data={messages}
              renderItem={({ item }) => renderMessage(item)}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messageList}
              onEndReachedThreshold={0.1}
            />
          )}

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
          >
            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                  editable={!sending}
                />
                <TouchableOpacity
                  style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                  onPress={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.sendButtonText}>Send</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.anonymousToggle}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    isAnonymous && styles.toggleButtonActive,
                  ]}
                  onPress={() => setIsAnonymous(!isAnonymous)}
                >
                  <Text style={[styles.toggleText, isAnonymous && styles.toggleTextActive]}>
                    {isAnonymous ? '🔒 Sending anonymously' : '👤 Send as yourself'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
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
  emptyContainer: {
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
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  messageContainerOwn: {
    alignItems: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 12,
  },
  messageBubble: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  messageBubbleOwn: {
    backgroundColor: '#10B981',
  },
  messageBubbleAnonymous: {
    borderWidth: 1,
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  messageText: {
    fontSize: 16,
    color: '#111827',
  },
  messageTextOwn: {
    color: '#ffffff',
  },
  anonymousLabel: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 4,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    marginHorizontal: 12,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  anonymousToggle: {
    alignItems: 'center',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
  },
  toggleButtonActive: {
    backgroundColor: '#F0FDF4',
  },
  toggleText: {
    fontSize: 12,
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
});
