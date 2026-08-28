import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import creditCardIcon from '@/assets/icons/credit-card.png';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

interface PaymentCardsSectionProps {
  title: string;
  addCardLabel: string;
  onAddCardPress?: () => void;
}

export function PaymentCardsSection({
  title,
  addCardLabel,
  onAddCardPress,
}: PaymentCardsSectionProps) {
  return (
    <View style={styles.card}>
      <AppText variant="bodyMedium" color="primary" style={styles.title}>
        {title}
      </AppText>

      {/* Dashed line */}
      <View style={styles.dashedDivider} />

      {/* Add Card Row */}
      <Pressable
        style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}
        onPress={onAddCardPress}
        accessibilityRole="button"
        accessibilityLabel={addCardLabel}
      >
        <View style={styles.leftGroup}>
          <Image source={creditCardIcon} style={styles.cardIcon} resizeMode="contain" />
          <AppText variant="bodyMedium" color="primary" style={styles.optionLabel}>
            {addCardLabel}
          </AppText>
        </View>

        <Ionicons name="chevron-forward" size={20} color={COLORS.text.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.payment.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md + 2,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.sm + 1,
  },

  dashedDivider: {
    height: 1,
    borderWidth: 0.5,
    borderColor: COLORS.payment.dashedBorder,
    borderStyle: 'dashed',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },

  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  cardIcon: {
    width: 28,
    height: 28,
  },

  optionLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },

  pressed: {
    opacity: 0.75,
  },
});
