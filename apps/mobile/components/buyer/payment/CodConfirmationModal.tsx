import React from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import moneyWavyIcon from '@/assets/icons/money-wavy.png';
import { AppText } from '@/components/common/AppText';
import { COD_CONFIRMATION_MODAL } from '@/constants/payment';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING, useResponsive } from '@/theme';

interface CodConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  noLabel?: string;
  continueLabel?: string;
}

export function CodConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title = COD_CONFIRMATION_MODAL.title,
  description = COD_CONFIRMATION_MODAL.description,
  noLabel = COD_CONFIRMATION_MODAL.noLabel,
  continueLabel = COD_CONFIRMATION_MODAL.continueLabel,
}: CodConfirmationModalProps) {
  const insets = useSafeAreaInsets();
  const { horizontalPadding } = useResponsive();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss confirmation dialog"
        />

        <View
          style={[
            styles.card,
            {
              marginHorizontal: horizontalPadding,
              marginBottom: insets.bottom + SPACING.lg,
            },
          ]}
        >
          {/* Header with Cash Icon */}
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <Image
                source={moneyWavyIcon}
                style={{ width: 22, height: 22 }}
                resizeMode="contain"
              />
            </View>
            <AppText variant="subheading" color="primary" style={styles.title}>
              {title}
            </AppText>
          </View>

          {/* Description */}
          <AppText variant="caption" style={styles.description}>
            {description}
          </AppText>

          {/* Action Buttons: No & Continue */}
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [styles.noButton, pressed && styles.pressed]}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={noLabel}
            >
              <AppText variant="bodyMedium" color="primary" style={styles.noButtonText}>
                {noLabel}
              </AppText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={continueLabel}
            >
              <AppText variant="bodyMedium" color="inverse" style={styles.continueButtonText}>
                {continueLabel}
              </AppText>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  card: {
    backgroundColor: COLORS.payment.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.sm,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE2CC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.lg,
  },

  description: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: 20,
    color: COLORS.text.strong,
    marginVertical: SPACING.xs,
  },

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: SPACING.xs,
  },

  noButton: {
    flex: 1,
    height: 42,
    borderRadius: RADIUS.pill,
    borderWidth: 0.8,
    borderColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  noButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },

  continueButton: {
    flex: 1,
    height: 42,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
