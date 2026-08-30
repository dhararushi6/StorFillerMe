import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import type { OrderProduct } from '@/features/orders/orders.types';

import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING } from '@/theme';

interface OrderProductItemProps {
  product: OrderProduct;
}

export function OrderProductItem({ product }: OrderProductItemProps) {
  const totalPrice = product.unitPrice * product.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.details}>
        <AppText variant="bodyMedium" color="primary" numberOfLines={2} style={styles.name}>
          {product.name}
        </AppText>

        <View style={styles.metaRow}>
          <AppText variant="caption" color="primary" style={styles.metaText}>
            {product.quantity} x {product.packSize}
          </AppText>

          <AppText variant="caption" color="primary" style={styles.metaText}>
            One Pack = ₹{product.unitPrice}
          </AppText>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <AppText variant="caption" color="secondary" style={styles.originalPrice}>
          ₹{product.originalPrice}
        </AppText>

        <AppText variant="bodyMedium" color="primary" style={styles.price}>
          ₹{totalPrice}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: SIZES.orderProductRowHeight,
  },

  imageContainer: {
    width: SIZES.orderProductAsset,
    height: SIZES.orderProductImage,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.order.productBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },

  image: {
    width: SIZES.orderProductAsset,
    height: SIZES.orderProductAsset,
  },

  details: {
    flex: 1,
    marginLeft: SPACING.sm,
    marginRight: SPACING.sm,
  },

  name: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: SPACING.md,
    marginTop: SPACING.xs,
  },

  metaText: {
    fontSize: FONT_SIZE.sm,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    minWidth: SIZES.orderPriceWidth,
  },
  originalPrice: {
    fontSize: FONT_SIZE.xs,
    textDecorationLine: 'line-through',
  },

  price: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
  },
});
