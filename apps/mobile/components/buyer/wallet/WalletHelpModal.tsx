import React from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import messageSquareIcon from '@/assets/icons/message-square.png';
import { AppText } from '@/components/common/AppText';
import { WALLET_SUPPORT_MODAL } from '@/constants/wallet';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, SPACING } from '@/theme';

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
              marginBottom: Math.max(insets.bottom, 16) + 4,
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
                <Image
                  source={messageSquareIcon}
                  style={{ width: 22, height: 22 }}
                  resizeMode="contain"
                />
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
                <Ionicons name="call-outline" size={22} color={COLORS.green.dark} />
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
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    width: '92%',
    maxWidth: 374,
    alignSelf: 'center',
  },

  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E1E1E',
    alignSelf: 'center',
    marginBottom: 12,
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
    backgroundColor: 'rgba(204, 93, 40, 0.10)',
    borderWidth: 0.4,
    borderColor: COLORS.orange.normal,
    borderRadius: 12,
    height: 64,
    paddingHorizontal: 14,
    gap: 12,
  },

  callCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 148, 17, 0.10)',
    borderWidth: 0.4,
    borderColor: COLORS.green.dark,
    borderRadius: 12,
    height: 64,
    paddingHorizontal: 14,
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
