import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { COLORS, SPACING } from '@/theme';
import { ICONS } from '@/constants/icons';

const TOTAL_STARS = 5;

interface RatingStarsProps {
  rating: number;
  size: number;
  color?: string;
}

export function RatingStars({ rating, size, color = COLORS.rating }: RatingStarsProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="image"
      accessibilityLabel={`Rated ${rating} out of ${TOTAL_STARS}`}
    >
      {Array.from({ length: TOTAL_STARS }, (_, index) => {
        const starValue = index + 1;

        const iconName =
          rating >= starValue
            ? ICONS.star
            : rating >= starValue - 0.5
              ? ICONS.starHalf
              : ICONS.starOutline;

        return (
          <Ionicons
            key={starValue}
            name={iconName as React.ComponentProps<typeof Ionicons>['name']}
            size={size}
            color={color}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
});
