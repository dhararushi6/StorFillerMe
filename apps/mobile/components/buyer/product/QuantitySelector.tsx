import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING, useResponsive } from '@/theme';

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
        <AppText variant="bodyMedium" color="primary">
          {title}
        </AppText>

        <AppText variant="body" color="muted">
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
              <AppText variant="bodyMedium" color={isSelected ? 'inverse' : 'secondary'}>
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
    gap: SPACING.sm,
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
  },

  chipUnselected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },

  pressed: {
    opacity: 0.85,
  },
});
