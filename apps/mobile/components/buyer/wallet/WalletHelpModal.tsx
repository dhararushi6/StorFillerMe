import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/common/AppText';
import { WALLET_SUPPORT_MODAL } from '@/constants/wallet';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from '@/theme';

interface WalletHelpModalProps {
  visible: boolean;
  onClose: () => void;
  onChatPress?: () => void;
  onCallPress?: () => void;
}

export function WalletHelpModal({
  visible,
  onClose,
  onChatPress,
  onCallPress,
}: WalletHelpModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close help modal"
        />

        <View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 14) + 12,
            },
          ]}
        >
          {/* Top Handle Bar */}
          <View style={styles.handle} />

          {/* Heading & Availability */}
          <AppText variant="subheading" color="primary" style={styles.title}>
            {WALLET_SUPPORT_MODAL.title}
          </AppText>
          <AppText variant="caption" style={styles.subtitle}>
            {WALLET_SUPPORT_MODAL.availability}
          </AppText>

          {/* Action Cards */}
          <View style={styles.actionsList}>
            {/* Chat With Us */}
            <Pressable
              style={({ pressed }) => [styles.chatCard, pressed && styles.pressed]}
              onPress={onChatPress ?? onClose}
              accessibilityRole="button"
              accessibilityLabel={WALLET_SUPPORT_MODAL.chat.title}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="chatbubble-outline" size={22} color="#CC5D28" />
              </View>

              <View style={styles.textContainer}>
                <AppText variant="bodyMedium" color="primary" style={styles.actionTitle}>
                  {WALLET_SUPPORT_MODAL.chat.title}
                </AppText>
                <AppText variant="caption" style={styles.chatDescription}>
                  {WALLET_SUPPORT_MODAL.chat.description}
                </AppText>
              </View>

              <Ionicons name="chevron-forward" size={18} color={COLORS.text.primary} />
            </Pressable>

            {/* Call Us */}
            <Pressable
              style={({ pressed }) => [styles.callCard, pressed && styles.pressed]}
              onPress={onCallPress ?? onClose}
              accessibilityRole="button"
              accessibilityLabel={WALLET_SUPPORT_MODAL.call.title}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="call-outline" size={22} color="#1EA836" />
              </View>

              <View style={styles.textContainer}>
                <AppText variant="bodyMedium" color="primary" style={styles.actionTitle}>
                  {WALLET_SUPPORT_MODAL.call.title}
                </AppText>
                <AppText variant="caption" style={styles.callDescription}>
                  {WALLET_SUPPORT_MODAL.call.description}
                </AppText>
              </View>

              <Ionicons name="chevron-forward" size={18} color={COLORS.text.primary} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    maxWidth: 374,
    width: '100%',
    minHeight: 281,
    alignSelf: 'center',
  },

  handle: {
    width: 48,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#1E1E1E',
    alignSelf: 'center',
    marginBottom: SPACING.sm + 2,
  },

  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.black,
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xxs,
    lineHeight: LINE_HEIGHT.xxs,
    color: COLORS.black,
    marginTop: 3,
    marginBottom: SPACING.md,
  },

  actionsList: {
    gap: 10,
  },

  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4EE',
    borderWidth: 1,
    borderColor: '#F5C2A5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },

  callCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDFAEE',
    borderWidth: 1,
    borderColor: '#BFE7B4',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },

  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    flex: 1,
    gap: 2,
  },

  actionTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xxs,
    lineHeight: LINE_HEIGHT.xxs,
    color: COLORS.black,
  },

  chatDescription: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xxs,
    lineHeight: LINE_HEIGHT.xxs,
    color: COLORS.orange.normal,
  },

  callDescription: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xxs,
    lineHeight: LINE_HEIGHT.xxs,
    color: COLORS.green.normal,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
});
