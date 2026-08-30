import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { OrderHeaderSection } from '@/components/buyer/order';
import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { TRACK_ORDER_SCREEN } from '@/constants/order';
import { COLORS, FONT_FAMILY, SPACING, useResponsive } from '@/theme';

interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
}

const QUICK_HELP_OPTIONS = [
  'Where is my order?',
  'Delivery is delayed',
  'Change delivery address',
  'Other Queries',
];

export default function BuyerChatScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    orderId?: string;
    returnTo?: string;
  }>();
  const { horizontalPadding } = useResponsive();

  const orderId = params.orderId || params.id || TRACK_ORDER_SCREEN.defaultOrderId;
  const fallbackRoute = params.returnTo || '/(buyer)/support';

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showQuickHelp, setShowQuickHelp] = useState(true);

  const handleSendMessage = useCallback(
    (textToSend?: string) => {
      const text = (textToSend || messageText).trim();
      if (!text) return;

      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, newMsg]);
      if (!textToSend) setMessageText('');

      // Simulate instant support acknowledgment
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'support',
          text: `Thank you for reaching out regarding order ${orderId}. Our support team will assist you shortly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 800);
    },
    [messageText, orderId],
  );

  const handleQuickOptionPress = useCallback(
    (option: string) => {
      handleSendMessage(option);
    },
    [handleSendMessage],
  );

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Chat with us" fallbackRoute={fallbackRoute} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            sidePadding,
            {
              paddingBottom: insets.bottom + 90,
            },
          ]}
        >
          {/* Exact Upper Order Info Header */}
          <OrderHeaderSection orderId={orderId} />

          {/* Centered Date Badge ("Today") */}
          <View style={styles.dateBadgeContainer}>
            <View style={styles.dateBadge}>
              <AppText style={styles.dateBadgeText}>Today</AppText>
            </View>
          </View>

          {/* Chat Messages */}
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.supportBubble,
              ]}
            >
              <AppText
                style={[
                  styles.messageText,
                  msg.sender === 'user' ? styles.userMessageText : styles.supportMessageText,
                ]}
              >
                {msg.text}
              </AppText>
              <AppText
                style={[
                  styles.messageTime,
                  msg.sender === 'user' ? styles.userMessageTime : styles.supportMessageTime,
                ]}
              >
                {msg.timestamp}
              </AppText>
            </View>
          ))}

          {/* Quick Help Card (Positioned above input) */}
          {showQuickHelp && (
            <View style={styles.quickHelpWrapper}>
              <View style={styles.quickHelpCard}>
                {/* Orange Card Header */}
                <View style={styles.quickHelpHeader}>
                  <AppText style={styles.quickHelpHeaderTitle}>How can we help you today</AppText>

                  <Pressable
                    onPress={() => setShowQuickHelp(false)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Close suggestions"
                  >
                    <Ionicons name="close" size={18} color="#FFFFFF" />
                  </Pressable>
                </View>

                {/* Options List */}
                <View style={styles.quickHelpOptionsList}>
                  {QUICK_HELP_OPTIONS.map((option, index) => (
                    <Pressable
                      key={option}
                      onPress={() => handleQuickOptionPress(option)}
                      style={({ pressed }) => [
                        styles.quickHelpOptionRow,
                        index < QUICK_HELP_OPTIONS.length - 1 && styles.quickHelpOptionBorder,
                        pressed && styles.pressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={option}
                    >
                      <AppText style={styles.quickHelpOptionText}>{option}</AppText>

                      <Ionicons name="chevron-forward" size={16} color="#000000" />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Chat Input Bar */}
        <View
          style={[
            styles.bottomInputBar,
            sidePadding,
            { paddingBottom: Math.max(insets.bottom, SPACING.md) },
          ]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="#777777"
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={() => handleSendMessage()}
              returnKeyType="send"
            />

            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Attach file"
              style={styles.attachButton}
            >
              <Ionicons name="attach-outline" size={22} color="#CC5D28" />
            </Pressable>
          </View>

          {/* Circular Send Button */}
          <Pressable
            onPress={() => handleSendMessage()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={({ pressed }) => [styles.sendButton, pressed && styles.pressed]}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" style={styles.sendIcon} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardAvoid: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },

  dateBadgeContainer: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },

  dateBadge: {
    backgroundColor: '#CC5D28',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },

  dateBadgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    color: '#FFFFFF',
  },

  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: 4,
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.orange.normal,
  },

  supportBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  messageText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    lineHeight: 18,
  },

  userMessageText: {
    color: '#FFFFFF',
  },

  supportMessageText: {
    color: '#000000',
  },

  messageTime: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 10,
    alignSelf: 'flex-end',
  },

  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },

  supportMessageTime: {
    color: '#888888',
  },

  quickHelpWrapper: {
    alignItems: 'flex-end',
    marginTop: 'auto',
    marginBottom: SPACING.sm,
  },

  quickHelpCard: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(204, 93, 40, 0.20)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }),
  },

  quickHelpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#CC5D28',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  quickHelpHeaderTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 13,
    color: '#FFFFFF',
    flex: 1,
  },

  quickHelpOptionsList: {
    paddingVertical: 4,
  },

  quickHelpOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  quickHelpOptionBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
  },

  quickHelpOptionText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: '#111111',
  },

  bottomInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    paddingTop: SPACING.sm,
  },

  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(204, 93, 40, 0.08)',
    borderRadius: 12,
    borderWidth: 0.8,
    borderColor: '#CC5D28',
    height: 48,
    paddingHorizontal: 12,
  },

  textInput: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    color: '#000000',
    height: '100%',
    paddingVertical: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
      } as Record<string, unknown>,
    }),
  },

  attachButton: {
    padding: 4,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CC5D28',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendIcon: {
    marginLeft: 2,
  },

  pressed: {
    opacity: 0.75,
  },
});
