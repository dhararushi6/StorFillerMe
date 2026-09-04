import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/common/AppText';
import { EXIT_PAYMENT_MODAL } from '@/constants/payment';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
  useResponsive,
} from '@/theme';

interface ExitPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  title?: string;
  description?: string;
  exitLabel?: string;
  continueLabel?: string;
}

export function ExitPaymentModal({
  visible,
  onClose,
  onConfirmExit,
  title = EXIT_PAYMENT_MODAL.title,
  description = EXIT_PAYMENT_MODAL.description,
  exitLabel = EXIT_PAYMENT_MODAL.exitAnywayLabel,
  continueLabel = EXIT_PAYMENT_MODAL.continuePaymentLabel,
}: ExitPaymentModalProps) {
  const insets = useSafeAreaInsets();
  const { horizontalPadding } = useResponsive();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss exit dialog"
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
          {/* Title Row */}
          <View style={styles.headerRow}>
            <Ionicons name="alert-circle" size={26} color="#E53935" />
            <AppText variant="subheading" color="primary" style={styles.title}>
              {title}
            </AppText>
          </View>

          {/* Description */}
          <AppText variant="caption" style={styles.description}>
            {description}
          </AppText>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [styles.exitButton, pressed && styles.pressed]}
              onPress={onConfirmExit}
              accessibilityRole="button"
              accessibilityLabel={exitLabel}
            >
              <AppText variant="bodyMedium" color="primary" style={styles.exitButtonText}>
                {exitLabel}
              </AppText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
              onPress={onClose}
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
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md + 1,
  },

  description: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.category,
    color: COLORS.black,
    marginVertical: SPACING.xs,
  },

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: SPACING.xs,
  },

  exitButton: {
    flex: 1,
    height: 42,
    borderRadius: RADIUS.pill,
    borderWidth: 0.8,
    borderColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  exitButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
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
  },
});
