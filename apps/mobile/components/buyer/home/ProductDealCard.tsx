import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING } from '@/theme';

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
          <AppText variant="bodyMedium" color="primary">
            ₹{price}
          </AppText>

          {oldPrice !== undefined && (
            <AppText variant="caption" color="muted" style={styles.oldPrice}>
              ₹{oldPrice}
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
          <AppIcon name="add" size="sm" color={COLORS.text.inverse} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 168,
    minHeight: 250,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
  },

  productContent: {
    flex: 1,
  },

  imageContainer: {
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.yellow.lightActive,
    borderRadius: RADIUS.lg,
  },

  image: {
    width: '85%',
    height: '85%',
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
    marginTop: SPACING.md,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },

  oldPrice: {
    textDecorationLine: 'line-through',
  },

  addButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.sm,
  },

  pressed: {
    opacity: 0.85,
  },
});
