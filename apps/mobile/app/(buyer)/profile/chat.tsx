import React, { useCallback, useState } from 'react';
import {
  Image,
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

import paperclipIcon from '@/assets/icons/paperclip.png';
import phoneIcon from '@/assets/icons/phone.png';
import ashirvaadAttaImg from '@/assets/images/home/ashirvaad-mp-atta.png';
import toorDalImg from '@/assets/images/home/tata-sampann-toor-dal.png';
import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { PROFILE_SUPPORT_CHAT } from '@/features/profile/profile.constants';
import type { ChatMessage } from '@/features/profile/profile.types';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SIZES,
  SPACING,
  useResponsive,
} from '@/theme';

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'support',
    senderName: PROFILE_SUPPORT_CHAT.supportTeamName,
    text: PROFILE_SUPPORT_CHAT.supportInitialMessage,
    timestamp: PROFILE_SUPPORT_CHAT.supportInitialTimestamp,
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: PROFILE_SUPPORT_CHAT.userInitialMessage,
    timestamp: PROFILE_SUPPORT_CHAT.userInitialTimestamp,
    images: [toorDalImg, ashirvaadAttaImg],
  },
];

export default function ProfileSupportChatScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    orderId?: string;
    ticketId?: string;
    returnTo?: string;
  }>();
  const { horizontalPadding } = useResponsive();

  const orderId = params.orderId || params.id || PROFILE_SUPPORT_CHAT.defaultOrderId;
  const ticketId = params.ticketId || PROFILE_SUPPORT_CHAT.defaultTicketId;
  const fallbackRoute = params.returnTo || '/(buyer)/profile';

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);

  const handleSendMessage = useCallback(() => {
    const text = messageText.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageText('');

    // Simulate instant support reply
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        senderName: PROFILE_SUPPORT_CHAT.supportTeamName,
        text: PROFILE_SUPPORT_CHAT.autoReplyMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1000);
  }, [messageText]);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      {/* Figma Orange Header with Online status & Action icons */}
      <ScreenHeader
        title={PROFILE_SUPPORT_CHAT.headerTitle}
        variant="orange"
        fallbackRoute={fallbackRoute}
        bottomContent={
          <View style={styles.onlineStatusRow}>
            <View style={styles.onlineDot} />
            <AppText style={styles.onlineStatusText}>{PROFILE_SUPPORT_CHAT.onlineStatus}</AppText>
          </View>
        }
        rightElement={
          <View style={styles.headerActions}>
            <Pressable
              hitSlop={SPACING.sm}
              accessibilityRole="button"
              accessibilityLabel={PROFILE_SUPPORT_CHAT.accessibility.callSupport}
              style={styles.headerActionBtn}
            >
              <Image source={phoneIcon} style={styles.phoneIcon} resizeMode="contain" />
            </Pressable>
            <Pressable
              hitSlop={SPACING.sm}
              accessibilityRole="button"
              accessibilityLabel={PROFILE_SUPPORT_CHAT.accessibility.moreOptions}
              style={styles.headerActionBtn}
            >
              <Ionicons name="ellipsis-vertical" size={SIZES.iconMedium} color={COLORS.white} />
            </Pressable>
          </View>
        }
      />

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
          {/* Ticket ID & Order ID Top Info Banner (Rectangle 350) */}
          <View style={styles.ticketBanner}>
            {/* Left: Ticket ID */}
            <View style={styles.ticketSection}>
              <View style={styles.ticketIconCircle}>
                <Ionicons
                  name="headset-outline"
                  size={SIZES.iconMedium}
                  color={COLORS.orange.normal}
                />
              </View>
              <View style={styles.ticketTextCol}>
                <AppText style={styles.ticketLabel}>{PROFILE_SUPPORT_CHAT.ticketLabel}</AppText>
                <AppText style={styles.ticketValue}>{ticketId}</AppText>
              </View>
            </View>

            {/* Right: Order ID */}
            <View style={styles.ticketSection}>
              <View style={styles.ticketIconCircle}>
                <Ionicons
                  name="cube-outline"
                  size={SIZES.iconMedium}
                  color={COLORS.orange.normal}
                />
              </View>
              <View style={styles.ticketTextCol}>
                <AppText style={styles.ticketLabel}>{PROFILE_SUPPORT_CHAT.orderLabel}</AppText>
                <AppText style={styles.ticketValue}>{orderId}</AppText>
              </View>
            </View>
          </View>

          {/* Centered Date Badge ("Today") */}
          <View style={styles.dateBadgeContainer}>
            <View style={styles.dateBadge}>
              <AppText style={styles.dateBadgeText}>{PROFILE_SUPPORT_CHAT.todayLabel}</AppText>
            </View>
          </View>

          {/* Chat Messages */}
          <View style={styles.messagesContainer}>
            {messages.map((msg) => {
              const isSupport = msg.sender === 'support';

              return (
                <View
                  key={msg.id}
                  style={[styles.messageRow, isSupport ? styles.supportRow : styles.userRow]}
                >
                  {/* Support Avatar */}
                  {isSupport && (
                    <View style={styles.supportAvatar}>
                      <Ionicons
                        name="headset-outline"
                        size={SIZES.iconSmall + 2}
                        color={COLORS.orange.normal}
                      />
                    </View>
                  )}

                  {/* Bubble Card (Rectangle 355 & Figma User Bubble) */}
                  <View
                    style={[
                      styles.bubbleCard,
                      isSupport ? styles.supportBubble : styles.userBubble,
                    ]}
                  >
                    {/* Orange Header Strip inside Bubble */}
                    <View style={styles.bubbleHeader}>
                      {isSupport ? (
                        <>
                          <AppText style={styles.bubbleHeaderTitle}>
                            {msg.senderName || PROFILE_SUPPORT_CHAT.supportTeamName}
                          </AppText>
                          <AppText style={styles.bubbleHeaderTime}>{msg.timestamp}</AppText>
                        </>
                      ) : (
                        <AppText style={[styles.bubbleHeaderTime, { marginLeft: 'auto' }]}>
                          {msg.timestamp}
                        </AppText>
                      )}
                    </View>

                    {/* Bubble Body Content */}
                    <View style={styles.bubbleBody}>
                      <AppText style={styles.bubbleText}>{msg.text}</AppText>

                      {/* Attached Product Images */}
                      {msg.images && msg.images.length > 0 && (
                        <View style={styles.imagesGrid}>
                          {msg.images.map((imgSrc, imgIndex) => (
                            <View key={imgIndex} style={styles.attachedImageBox}>
                              <Image
                                source={imgSrc}
                                style={styles.attachedImage}
                                resizeMode="contain"
                              />
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
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
              placeholder={PROFILE_SUPPORT_CHAT.inputPlaceholder}
              placeholderTextColor={COLORS.text.placeholder}
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />

            <Pressable
              hitSlop={SPACING.xs}
              accessibilityRole="button"
              accessibilityLabel={PROFILE_SUPPORT_CHAT.accessibility.attachFile}
              style={styles.attachButton}
            >
              <Image source={paperclipIcon} style={styles.paperclipIcon} resizeMode="contain" />
            </Pressable>
          </View>

          {/* Circular Send Button */}
          <Pressable
            onPress={handleSendMessage}
            accessibilityRole="button"
            accessibilityLabel={PROFILE_SUPPORT_CHAT.accessibility.sendMessage}
            style={({ pressed }) => [styles.sendButton, pressed && styles.pressed]}
          >
            <Ionicons
              name="paper-plane"
              size={SIZES.iconMedium}
              color={COLORS.white}
              style={styles.sendIcon}
            />
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

  // Online status inside header
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  onlineDot: {
    width: SIZES.onlineDotSize,
    height: SIZES.onlineDotSize,
    borderRadius: SIZES.onlineDotSize / 2,
    backgroundColor: COLORS.success,
  },
  onlineStatusText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    opacity: 0.95,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerActionBtn: {
    width: SIZES.avatarSmall,
    height: SIZES.avatarSmall,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIcon: {
    width: SIZES.iconLarge,
    height: SIZES.iconLarge,
  },

  // Ticket ID & Order ID Top Banner (Rectangle 350)
  ticketBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.orange.borderAlpha30,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minHeight: SIZES.headerHeight,
  },

  ticketSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },

  ticketIconCircle: {
    width: SIZES.ticketIconSize,
    height: SIZES.ticketIconSize,
    borderRadius: SIZES.ticketIconSize / 2,
    backgroundColor: COLORS.orange.bgAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ticketTextCol: {
    gap: 1,
  },

  ticketLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.micro,
    lineHeight: LINE_HEIGHT.micro,
    color: COLORS.black,
  },

  ticketValue: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.xs,
    color: COLORS.orange.normal,
  },

  // Date Badge ("Today")
  dateBadgeContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },

  dateBadge: {
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },

  dateBadgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xxs,
    color: COLORS.orange.normal,
  },

  // Messages
  messagesContainer: {
    gap: SPACING.lg,
    marginTop: SPACING.xs,
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },

  supportRow: {
    alignSelf: 'flex-start',
  },

  userRow: {
    alignSelf: 'flex-end',
  },

  supportAvatar: {
    width: SIZES.avatarSmall,
    height: SIZES.avatarSmall,
    borderRadius: SIZES.avatarSmall / 2,
    backgroundColor: COLORS.orange.bgAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  // Bubble Card (Rectangle 355 & Figma User Bubble)
  bubbleCard: {
    width: SIZES.chatBubbleWidth,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.orange.borderAlpha30,
  },

  supportBubble: {
    backgroundColor: COLORS.white,
  },

  userBubble: {
    backgroundColor: COLORS.orange.chatBubble,
  },

  bubbleHeader: {
    backgroundColor: COLORS.orange.normal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 5,
  },

  bubbleHeaderTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xxs,
    color: COLORS.white,
  },

  bubbleHeaderTime: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.tiny,
    color: COLORS.white,
    opacity: 0.9,
  },

  bubbleBody: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 6,
  },

  bubbleText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.tiny,
    lineHeight: LINE_HEIGHT.tiny,
    color: COLORS.black,
  },

  imagesGrid: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },

  attachedImageBox: {
    width: SIZES.chatThumbnailSize,
    height: SIZES.chatThumbnailSize,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.orange.borderAlpha25,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  attachedImage: {
    width: '100%',
    height: '100%',
  },

  // Bottom Input Bar
  bottomInputBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.background,
  },

  inputContainer: {
    flex: 1,
    height: SIZES.inputHeight,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.orange.normal,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
  },

  textInput: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
    height: '100%',
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
        boxShadow: 'none',
      } as Record<string, unknown>,
    }),
  },

  attachButton: {
    padding: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  paperclipIcon: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
  },

  sendButton: {
    width: SIZES.buttonHeight,
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonHeight / 2,
    backgroundColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendIcon: {
    marginLeft: 1,
  },

  pressed: {
    opacity: 0.8,
  },
});
