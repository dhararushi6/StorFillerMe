import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, RADIUS, SIZES, SPACING } from '@/theme';

interface QuickAddOption {
  id: string;
  amount: number;
}

interface WalletQuickAddProps {
  title: string;
  options: readonly QuickAddOption[];
  selectedId: string;
  onSelect: (optionId: string) => void;
}

export function WalletQuickAdd({ title, options, selectedId, onSelect }: WalletQuickAddProps) {
  return (
    <View>
      <AppText variant="bodyMedium" color="primary" style={styles.title}>
        {title}
      </AppText>

      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = option.id === selectedId;

          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
                pressed && styles.pressed,
              ]}
              onPress={() => onSelect(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Add ₹${option.amount}`}
            >
              <AppText
                variant="caption"
                style={[styles.chipText, isSelected ? styles.textSelected : styles.textUnselected]}
              >
                ₹ {option.amount}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_FAMILY.semiBold,
  },

  options: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm + 2,
  },

  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs / 2,
    paddingHorizontal: SPACING.md,
    minHeight: SIZES.chipHeight,
    borderWidth: SIZES.borderThin,
    borderRadius: RADIUS.md,
  },

  chipSelected: {
    backgroundColor: COLORS.orange.card,
    borderColor: COLORS.orange.normal,
  },

  chipUnselected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },

  chipText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },

  textSelected: {
    color: COLORS.orange.normal,
  },

  textUnselected: {
    color: COLORS.text.primary,
  },

  pressed: {
    opacity: 0.85,
  },
});
