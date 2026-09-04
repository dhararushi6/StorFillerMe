import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
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
          <AppText variant="bodyMedium" numberOfLines={2} style={styles.name}>
            {name}
          </AppText>

          <AppText variant="caption" style={styles.unit}>
            {unit}
          </AppText>

          <View style={styles.priceRow}>
            <AppText variant="subheading" style={styles.price}>
              ₹ {price}
            </AppText>

            {oldPrice !== undefined && (
              <AppText variant="caption" style={styles.oldPrice}>
                ₹ {oldPrice}
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
    backgroundColor: 'transparent',
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.sm,
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
    backgroundColor: COLORS.orange.bottomBar,
    borderRadius: RADIUS.lg,
    padding: SPACING.xs,
  },

  image: {
    width: '88%',
    height: '88%',
  },

  detailsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    gap: 2,
  },

  name: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.black,
  },

  unit: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.text.muted,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs + 2,
    marginTop: SPACING.xs / 2,
  },

  price: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.title,
    lineHeight: LINE_HEIGHT.title,
    color: COLORS.black,
  },

  oldPrice: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.text.muted,
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
    paddingHorizontal: SPACING.xs + 2,
  },

  qtyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
  },

  qtyText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.category,
    color: COLORS.white,
  },
});
