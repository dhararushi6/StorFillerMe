import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, RADIUS, SPACING, useResponsive } from '@/theme';

interface CartItemCardProps {
  name: string;
  unit: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  image: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onPress?: () => void;
}

export function CartItemCard({
  name,
  unit,
  price,
  oldPrice,
  quantity,
  image,
  onIncrement,
  onDecrement,
  onPress,
}: CartItemCardProps) {
  const { cart } = useResponsive();

  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.contentRow, pressed && styles.contentPressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${unit}`}
      >
        <View
          style={[
            styles.imageContainer,
            {
              width: cart.itemImageSize,
              height: cart.itemImageSize,
            },
          ]}
        >
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.detailsContainer}>
          <AppText variant="bodyMedium" color="primary" numberOfLines={2} style={styles.name}>
            {name}
          </AppText>

          <AppText variant="caption" color="muted" style={styles.unit}>
            {unit}
          </AppText>

          <View style={styles.priceRow}>
            <AppText variant="subheading" color="primary" style={styles.price}>
              ₹ {price}
            </AppText>

            {oldPrice !== undefined && (
              <AppText variant="caption" color="muted" style={styles.oldPrice}>
                ₹{oldPrice}
              </AppText>
            )}
          </View>
        </View>
      </Pressable>

      <View style={styles.actionContainer}>
        <View
          style={[
            styles.qtyPill,
            {
              width: cart.qtyButtonWidth,
              height: cart.qtyButtonHeight,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Decrease quantity"
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
            accessibilityLabel="Increase quantity"
            hitSlop={6}
            onPress={onIncrement}
            style={styles.qtyButton}
          >
            <AppIcon name="add" size="xs" color={COLORS.text.inverse} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },

  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  contentPressed: {
    opacity: 0.85,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange.light,
    borderRadius: RADIUS.lg,
    padding: SPACING.xs,
  },

  image: {
    width: '85%',
    height: '85%',
  },

  detailsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },

  name: {
    fontFamily: FONT_FAMILY.bold,
  },

  unit: {
    marginTop: SPACING.xs / 2,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },

  price: {
    fontFamily: FONT_FAMILY.bold,
  },

  oldPrice: {
    fontFamily: FONT_FAMILY.regular,
    textDecorationLine: 'line-through',
  },

  actionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.xs,
  },

  qtyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
  },

  qtyText: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.text.inverse,
  },
});
