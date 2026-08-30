import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import moneyWavyIcon from '@/assets/icons/money-wavy.png';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

interface PaymentCodSectionProps {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function PaymentCodSection({ label, selected = false, onSelect }: PaymentCodSectionProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <View style={styles.leftGroup}>
        <Image source={moneyWavyIcon} style={styles.codIcon} resizeMode="contain" />
        <AppText variant="bodyMedium" color="primary" style={styles.label}>
          {label}
        </AppText>
      </View>

      {/* Radio Circle */}
      <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.payment.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.md + 2,
  },

  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  codIcon: {
    width: 26,
    height: 26,
  },

  label: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C4B498',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioCircleSelected: {
    borderColor: COLORS.orange.normal,
    backgroundColor: COLORS.white,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.orange.normal,
  },

  pressed: {
    opacity: 0.8,
  },
});
