import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
  useResponsive,
} from '@/theme';

interface QuantityOption {
  id: string;
  label: string;
}

interface QuantitySelectorProps {
  title: string;
  selectedLabel: string;
  options: readonly QuantityOption[];
  selectedId: string;
  onSelect: (optionId: string) => void;
}

export function QuantitySelector({
  title,
  selectedLabel,
  options,
  selectedId,
  onSelect,
}: QuantitySelectorProps) {
  const { product } = useResponsive();

  return (
    <View>
      <View style={styles.titleRow}>
        <AppText variant="bodyMedium" color="primary" style={styles.titleText}>
          {title}:
        </AppText>

        <AppText variant="body" style={styles.selectedLabelText}>
          {selectedLabel}
        </AppText>
      </View>

      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = option.id === selectedId;

          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.chip,
                {
                  height: product.quantityChipHeight,
                  minWidth: product.quantityChipMinWidth,
                },
                isSelected ? styles.chipSelected : styles.chipUnselected,
                pressed && styles.pressed,
              ]}
              onPress={() => onSelect(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={option.label}
            >
              <AppText
                variant="bodyMedium"
                color={isSelected ? 'inverse' : 'secondary'}
                style={isSelected ? styles.chipTextSelected : styles.chipTextUnselected}
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  titleText: {
    fontFamily: FONT_FAMILY.bold,
  },

  selectedLabelText: {
    fontFamily: FONT_FAMILY.medium,
    color: '#7A869A',
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },

  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderRadius: RADIUS.md,
  },

  chipSelected: {
    backgroundColor: COLORS.text.primary,
    borderColor: COLORS.text.primary,
    borderStyle: 'solid',
  },

  chipUnselected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },

  chipTextSelected: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.subtitle,
  },

  chipTextUnselected: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.subtitle,
    color: COLORS.inactive,
  },

  pressed: {
    opacity: 0.85,
  },
});
