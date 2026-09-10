import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';

import { ORDER_STATUS_CONFIG } from '@/features/orders/orders.constants';
import type { Order } from '@/features/orders/orders.types';

import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const status = ORDER_STATUS_CONFIG[order.status];

  const visibleProducts = order.products.slice(0, 3);

  const remainingProducts = Math.max(order.itemCount - visibleProducts.length, 0);

  const isDelivered = order.status === 'delivered';

  return (
    <Pressable
      onPress={onPress}
      disabled={onPress === undefined}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Order Header */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              isDelivered ? styles.deliveredIndicator : styles.dotIndicator,
            ]}
          >
            {isDelivered && <AppIcon name="check" size="sm" color={COLORS.white} />}
          </View>

          <AppText
            variant="bodyMedium"
            style={[
              styles.statusText,
              {
                color: isDelivered ? COLORS.order.delivered : status.color,
              },
            ]}
          >
            {status.label}
          </AppText>
        </View>

        <AppText variant="caption" color="primary" style={styles.date}>
          {order.deliveredAt ? `Delivered on ${order.deliveredAt}` : 'Order placed'}
        </AppText>
      </View>

      {/* Product Thumbnails */}
      <View style={styles.productsRow}>
        {visibleProducts.map((product) => (
          <View key={product.id} style={styles.productImageContainer}>
            <Image source={product.image} style={styles.productImage} resizeMode="contain" />
          </View>
        ))}

        {remainingProducts > 0 && (
          <AppText variant="caption" style={styles.moreText}>
            +{remainingProducts} more
          </AppText>
        )}
      </View>

      {/* Order Footer */}
      <View style={styles.footer}>
        <AppText variant="caption" color="secondary" style={styles.itemCount}>
          {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
        </AppText>

        <View style={styles.billContainer}>
          <AppText variant="caption" color="primary">
            Bill:
          </AppText>

          <AppText variant="bodyMedium" color="primary" style={styles.amount}>
            ₹{order.totalAmount}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.order.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.orange.light,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },

  deliveredIndicator: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: COLORS.order.delivered,
  },

  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.warning,
    marginLeft: SPACING.xs,
    marginRight: SPACING.sm,
  },

  statusText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },

  date: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.black,
  },

  productsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    minHeight: 48,
  },

  productImageContainer: {
    width: 70,
    height: 60,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.order.productBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },

  productImage: {
    width: 90,
    height: 60,
  },

  moreText: {
    color: COLORS.orange.normal,
    fontFamily: FONT_FAMILY.medium,
    marginLeft: SPACING.xs,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },

  itemCount: {
    fontSize: FONT_SIZE.xs,
  },

  billContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  amount: {
    fontFamily: FONT_FAMILY.semiBold,
  },

  pressed: {
    opacity: 0.85,
  },
});
