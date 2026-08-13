import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, SPACING, useResponsive } from '@/theme';

import { RatingStars } from './RatingStars';

interface ProductSummaryProps {
  name: string;
  rating: number;
  reviewsLabel: string;
  price: number;
  oldPrice?: number;
  isWishlisted?: boolean;
  onWishlistPress?: () => void;
  onSharePress?: () => void;
}

export function ProductSummary({
  name,
  rating,
  reviewsLabel,
  price,
  oldPrice,
  isWishlisted = false,
  onWishlistPress,
  onSharePress,
}: ProductSummaryProps) {
  const { product } = useResponsive();

  return (
    <View>
      <AppText
        variant="heading"
        color="primary"
        style={{
          fontSize: product.titleFontSize,
        }}
      >
        {name}
      </AppText>

      <View style={styles.ratingRow}>
        <RatingStars rating={rating} size={product.starSize} />

        <AppText variant="caption" color="secondary">
          {reviewsLabel}
        </AppText>
      </View>

      <View style={styles.priceRow}>
        <View style={styles.priceGroup}>
          <AppText
            variant="heading"
            color="primary"
            style={{
              fontSize: product.priceFontSize,
            }}
          >
            ₹ {price}
          </AppText>

          {oldPrice !== undefined && (
            <AppText
              variant="caption"
              color="muted"
              style={[
                styles.oldPrice,
                {
                  fontSize: product.oldPriceFontSize,
                },
              ]}
            >
              ₹{oldPrice}
            </AppText>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onWishlistPress}
            accessibilityRole="button"
            accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            hitSlop={8}
          >
            <AppIcon
              name={isWishlisted ? 'heartFilled' : 'heart'}
              size="lg"
              color={isWishlisted ? COLORS.danger : COLORS.text.primary}
            />
          </Pressable>

          <Pressable
            onPress={onSharePress}
            accessibilityRole="button"
            accessibilityLabel={`Share ${name}`}
            hitSlop={8}
          >
            <AppIcon name="shareSocial" size="lg" color={COLORS.text.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },

  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },

  oldPrice: {
    fontFamily: FONT_FAMILY.regular,
    textDecorationLine: 'line-through',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
});
