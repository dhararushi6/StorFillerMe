import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING, useResponsive } from '@/theme';

interface RatingsSummaryProps {
  value: string;
  label: string;
  filters: readonly number[];
  selectedFilter: number;
  onFilterPress: (filter: number) => void;
}

export function RatingsSummary({
  value,
  label,
  filters,
  selectedFilter,
  onFilterPress,
}: RatingsSummaryProps) {
  const { product } = useResponsive();

  return (
    <View style={styles.container}>
      <View style={styles.scoreGroup}>
        <AppText
          variant="heading"
          color="primary"
          style={{
            fontSize: product.ratingValueFontSize,
          }}
        >
          {value}
        </AppText>

        <AppIcon name="star" size="sm" color={COLORS.rating} />

        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      </View>

      <View style={styles.filters}>
        {filters.map((filter) => {
          const isSelected = filter === selectedFilter;

          return (
            <Pressable
              key={filter}
              style={({ pressed }) => [
                styles.filter,
                {
                  width: product.ratingFilterSize,
                  height: product.ratingFilterSize,
                },
                isSelected && styles.filterSelected,
                pressed && styles.pressed,
              ]}
              onPress={() => onFilterPress(filter)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Show ${filter} star reviews`}
              hitSlop={4}
            >
              <AppText variant="caption" color={isSelected ? 'inverse' : 'secondary'}>
                {filter}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },

  scoreGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  label: {
    color: COLORS.orange.normal,
  },

  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  filter: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
  },

  filterSelected: {
    backgroundColor: COLORS.orange.normal,
  },

  pressed: {
    opacity: 0.85,
  },
});
