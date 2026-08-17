import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, RADIUS, SPACING, useResponsive } from '@/theme';

interface SimilarProductCardProps {
  name: string;
  unit: string;
  price: number;
  oldPrice?: number;
  image: number;
  onPress?: () => void;
  onAddPress?: () => void;
}

export function SimilarProductCard({
  name,
  unit,
  price,
  oldPrice,
  image,
  onPress,
  onAddPress,
}: SimilarProductCardProps) {
  const { product } = useResponsive();

  return (
    <View
      style={[
        styles.card,
        {
          width: product.similarCardWidth,
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={name}
      >
        <View
          style={[
            styles.imageContainer,
            {
              height: product.similarImageHeight,
            },
          ]}
        >
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>

        <AppText variant="caption" color="primary" numberOfLines={2} style={styles.name}>
          {name}
        </AppText>

        <AppText variant="caption" color="muted" style={styles.unit}>
          {unit}
        </AppText>
      </Pressable>

      <View style={styles.bottomRow}>
        <View style={styles.priceGroup}>
          <AppText variant="bodyMedium" color="primary">
            ₹ {price}
          </AppText>

          {oldPrice !== undefined && (
            <AppText variant="caption" color="muted" style={styles.oldPrice}>
              ₹{oldPrice}
            </AppText>
          )}
        </View>

        <Pressable
          style={[
            styles.addButton,
            {
              width: product.similarAddButtonSize,
              height: product.similarAddButtonSize,
            },
          ]}
          onPress={onAddPress}
          accessibilityRole="button"
          accessibilityLabel={`Add ${name} to cart`}
          hitSlop={6}
        >
          <AppIcon name="add" size="sm" color={COLORS.text.inverse} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.orange.light,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
  },

  content: {
    flex: 1,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange.lightHover,
    borderRadius: RADIUS.md,
  },

  image: {
    width: '80%',
    height: '80%',
  },

  name: {
    marginTop: SPACING.sm,
  },

  unit: {
    marginTop: SPACING.xs / 2,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },

  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },

  oldPrice: {
    fontFamily: FONT_FAMILY.regular,
    textDecorationLine: 'line-through',
  },

  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
  },

  pressed: {
    opacity: 0.85,
  },
});
