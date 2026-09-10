import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

export interface ProductDealCardProps {
  name: string;
  unit: string;
  price: number;
  oldPrice?: number;
  image: number;
  quantity?: number;
  onPress?: () => void;
  onAddPress?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export function ProductDealCard({
  name,
  unit,
  price,
  oldPrice,
  image,
  quantity = 0,
  onPress,
  onAddPress,
  onIncrement,
  onDecrement,
}: ProductDealCardProps) {
  const isAdded = quantity > 0;

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.productContent, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={name}
      >
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>

        <AppText variant="bodyMedium" color="primary" numberOfLines={2} style={styles.name}>
          {name}
        </AppText>

        <AppText variant="caption" color="secondary" style={styles.unit}>
          {unit}
        </AppText>
      </Pressable>

      <View style={styles.bottomRow}>
        <View style={styles.priceContainer}>
          <AppText variant="bodyMedium" color="primary" style={styles.price}>
            ₹ {price}
          </AppText>

          {oldPrice !== undefined && (
            <AppText variant="caption" color="muted" style={styles.oldPrice}>
              ₹ {oldPrice}
            </AppText>
          )}
        </View>

        {isAdded ? (
          <View style={styles.qtyPill}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Decrease quantity of ${name}`}
              hitSlop={6}
              onPress={onDecrement}
              style={styles.qtyButton}
            >
              <AppIcon name="remove" size="xs" color={COLORS.text.inverse} />
            </Pressable>

            <AppText variant="bodyMedium" style={styles.qtyText}>
              {quantity}
            </AppText>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Increase quantity of ${name}`}
              hitSlop={6}
              onPress={onIncrement}
              style={styles.qtyButton}
            >
              <AppIcon name="add" size="xs" color={COLORS.text.inverse} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.addButton}
            onPress={onAddPress || onIncrement}
            accessibilityRole="button"
            accessibilityLabel={`Add ${name} to cart`}
            hitSlop={6}
          >
            <AppIcon name="add" size="lg" color={COLORS.text.inverse} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    minHeight: 235,
    backgroundColor: COLORS.deal.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.sm,
  },
  productContent: {
    flex: 1,
  },

  imageContainer: {
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.deal.inner,
    borderRadius: RADIUS.lg,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  name: {
    marginTop: SPACING.md,
  },

  unit: {
    marginTop: SPACING.xs,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },

  priceContainer: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '500',
  },

  oldPrice: {
    marginTop: 0,
    textDecorationLine: 'line-through',
  },

  addButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange.normal,
    borderRadius: 999,
  },

  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
    height: 36,
    minWidth: 76,
    paddingHorizontal: SPACING.xs,
  },

  qtyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs / 2,
  },

  qtyText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    paddingHorizontal: SPACING.xs / 2,
  },

  pressed: {
    opacity: 0.85,
  },
});
