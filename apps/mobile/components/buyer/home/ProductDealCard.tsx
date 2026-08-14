import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '@/theme';

interface ProductDealCardProps {
  name: string;
  unit: string;
  price: number;
  oldPrice?: number;
  image: number;
  onPress?: () => void;
  onAddPress?: () => void;
}

export function ProductDealCard({
  name,
  unit,
  price,
  oldPrice,
  image,
  onPress,
  onAddPress,
}: ProductDealCardProps) {
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

        <Pressable
          style={styles.addButton}
          onPress={onAddPress}
          accessibilityRole="button"
          accessibilityLabel={`Add ${name} to cart`}
          hitSlop={6}
        >
          <AppIcon name="add" size="lg" color={COLORS.text.inverse} />
        </Pressable>
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

  pressed: {
    opacity: 0.85,
  },
});
