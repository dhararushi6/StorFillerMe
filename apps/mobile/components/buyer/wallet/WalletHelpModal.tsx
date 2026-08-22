import React from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import chatIcon from '@/assets/icons/chat-support.png';
import phoneIcon from '@/assets/icons/phone-support.png';
import { AppText } from '@/components/common/AppText';
import { WALLET_SUPPORT_MODAL } from '@/constants/wallet';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

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
              paddingBottom: Math.max(insets.bottom, SPACING.lg) + SPACING.md,
            },
          ]}
        >
          {/* Top Handle Indicator */}
          <View style={styles.handle} />

          {/* Heading & Subheading */}
          <AppText variant="subheading" color="primary" style={styles.title}>
            {WALLET_SUPPORT_MODAL.title}
          </AppText>
          <AppText variant="caption" color="secondary" style={styles.subtitle}>
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
                <Image source={chatIcon} style={styles.actionIcon} resizeMode="contain" />
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
                <Image source={phoneIcon} style={styles.actionIcon} resizeMode="contain" />
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },

  handle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333333',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.xl,
  },

  actionsList: {
    gap: SPACING.md,
  },

  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2EC',
    borderWidth: 1,
    borderColor: '#F5C2AF',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md - 2,
    gap: SPACING.md,
  },

  callCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDFAEE',
    borderWidth: 1,
    borderColor: '#A3E5AE',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md - 2,
    gap: SPACING.md,
  },

  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionIcon: {
    width: 24,
    height: 24,
  },

  textContainer: {
    flex: 1,
    gap: 2,
  },

  actionTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.sm + 1,
  },

  chatDescription: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.orange.normal,
  },

  callDescription: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.success,
  },

  pressed: {
    opacity: 0.8,
  },
});
