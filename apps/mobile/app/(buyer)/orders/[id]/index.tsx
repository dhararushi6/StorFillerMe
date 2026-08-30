import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import downloadIcon from '@/assets/icons/download.png';

import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';

import { OrderBill } from '@/components/order/OrderBill';
import { OrderDeliveryDetails } from '@/components/order/OrderDeliveryDetails';
import { OrderProductItem } from '@/components/order/OrderProductItem';
import { OrderRating } from '@/components/order/OrderRating';

import { useOrders } from '@/hooks/useOrders';

import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING } from '@/theme';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: orders = [], isLoading, isError } = useOrders();

  const order = orders.find((item) => item.id === id);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={COLORS.orange.normal} />
      </View>
    );
  }

  if (isError || order === undefined) {
    return (
      <View style={styles.centered}>
        <AppText variant="bodyMedium" color="primary" style={styles.errorTitle}>
          Unable to load order
        </AppText>

        <Pressable onPress={() => router.back()} style={styles.backToOrdersButton}>
          <AppText variant="caption" color="inverse">
            Back to orders
          </AppText>
        </Pressable>
      </View>
    );
  }

  const itemTotal = order.products.reduce(
    (total, product) => total + product.unitPrice * product.quantity,
    0,
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Order Details"
        variant="orange"
        fallbackRoute="/(buyer)/orders"
        rightElement={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Help"
            hitSlop={8}
            style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
          >
            <AppText variant="bodyMedium" color="inverse" style={styles.helpText}>
              Help
            </AppText>
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Order information */}
        <View style={styles.orderInfo}>
          <AppText variant="bodyMedium" color="primary" style={styles.orderNumber}>
            Order #{order.id}
          </AppText>

          <AppText variant="caption" color="secondary" style={styles.orderDate}>
            {order.deliveredAt ? `Delivered on ${order.deliveredAt}` : 'Order placed'}
          </AppText>
        </View>

        {/* Products */}
        <View style={styles.productsSection}>
          {order.products.map((product) => (
            <OrderProductItem key={product.id} product={product} />
          ))}
        </View>

        {/* Bill */}
        <OrderBill
          itemTotal={itemTotal}
          deliveryFee={order.deliveryFee}
          handlingFee={order.handlingFee}
          totalAmount={order.totalAmount}
        />

        {/* Download Invoice */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Download invoice"
          style={({ pressed }) => [styles.invoiceButton, pressed && styles.pressed]}
        >
          <Image source={downloadIcon} style={styles.invoiceIcon} resizeMode="contain" />

          <AppText variant="bodyMedium" color="inverse" style={styles.invoiceText}>
            Download Invoice
          </AppText>
        </Pressable>

        {/* Delivery details */}
        <OrderDeliveryDetails details={order.deliveryDetails} />

        {/* Rating */}
        <OrderRating />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },

  errorTitle: {
    fontFamily: FONT_FAMILY.semiBold,
  },

  backToOrdersButton: {
    marginTop: SPACING.md,
    minHeight: SIZES.smallButtonHeight,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  helpButton: {
    width: SIZES.helpButtonWidth,
    height: SIZES.helpButtonHeight,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.orange.card,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  helpText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
  },

  orderInfo: {
    marginBottom: SPACING.md,
  },

  orderNumber: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
  },

  orderDate: {
    marginTop: SPACING.xs,
  },

  productsSection: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  invoiceButton: {
    width: '100%',
    height: SIZES.buttonHeight,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange.normal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },

  invoiceIcon: {
    width: SIZES.iconLarge,
    height: SIZES.iconLarge,
  },

  invoiceText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },

  pressed: {
    opacity: 0.75,
  },
});
