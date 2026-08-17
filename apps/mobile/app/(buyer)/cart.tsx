import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import {
  CartBillSummaryCard,
  CartBottomBar,
  CartDeliveryHeader,
  CartItemCard,
} from '@/components/buyer/cart';
import { SimilarProductCard } from '@/components/buyer/product/SimilarProductCard';
import {
  CART_ACTIONS,
  CART_BILL_DATA,
  CART_CANCELLATION_POLICY,
  CART_DELIVERY_ADDRESS,
  CART_FOOTER,
  CART_FREE_DELIVERY,
  CART_RECOMMENDATIONS,
  CART_WALLET_DATA,
  INITIAL_CART_ITEMS,
  type CartItem,
} from '@/constants/cart';
import { COLORS, FONT_FAMILY, RADIUS, SPACING, useResponsive } from '@/theme';

export default function BuyerCartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const scrollViewRef = useRef<ScrollView>(null);
  const billSectionY = useRef<number>(0);

  const { horizontalPadding } = useResponsive();

  const handleIncrement = useCallback((id: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  }, []);

  const handleDecrement = useCallback((id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const handleProductPress = useCallback((productId: string) => {
    router.push({
      pathname: '/(buyer)/product/[id]',
      params: { id: productId },
    });
  }, []);

  const handleAddRecommendation = useCallback((productId: string) => {
    const targetProduct = CART_RECOMMENDATIONS.products.find((p) => p.id === productId);
    if (!targetProduct) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          id: targetProduct.id,
          name: targetProduct.name,
          unit: targetProduct.unit,
          price: targetProduct.price,
          oldPrice: targetProduct.oldPrice,
          quantity: 1,
          image: targetProduct.image,
        },
      ];
    });
  }, []);

  const handleAddMoreItems = useCallback(() => {
    router.push('/(buyer)/category');
  }, []);

  const handleContinue = useCallback(() => {
    router.push('/(buyer)/checkout');
  }, []);

  const handleViewBillDetails = useCallback(() => {
    if (billSectionY.current > 0) {
      scrollViewRef.current?.scrollTo({ y: billSectionY.current, animated: true });
    }
  }, []);

  // Calculated totals
  const totalItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const itemsTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return itemsTotal + CART_BILL_DATA.deliveryFeeAmount + CART_BILL_DATA.handlingFeeAmount;
  }, [itemsTotal, cartItems.length]);

  return (
    <View style={styles.screen}>
      <CartDeliveryHeader
        title={CART_DELIVERY_ADDRESS.title}
        highlight={CART_DELIVERY_ADDRESS.highlight}
        address={CART_DELIVERY_ADDRESS.address}
        onBackPress={() => router.back()}
        onSearchPress={() => router.push('/(buyer)/category')}
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
      >
        {/* Free Delivery Tracker */}
        <View style={styles.freeDeliveryContainer}>
          <View style={styles.freeDeliveryHeader}>
            <AppText variant="bodyMedium" color="primary" style={styles.boldText}>
              {CART_FREE_DELIVERY.title}
            </AppText>
            <AppText variant="caption" color="primary" style={styles.boldText}>
              {CART_FREE_DELIVERY.percentageLabel}
            </AppText>
          </View>

          <View style={styles.freeDeliverySubRow}>
            <AppText variant="caption" color="secondary">
              {CART_FREE_DELIVERY.prefixText}
              <AppText variant="caption" style={styles.greenAmountText}>
                ₹ {CART_FREE_DELIVERY.thresholdAmount}{' '}
              </AppText>
            </AppText>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={CART_FREE_DELIVERY.viewMoreLabel}
              hitSlop={6}
              onPress={handleAddMoreItems}
            >
              <AppText variant="caption" color="primary" style={styles.viewMoreLink}>
                {CART_FREE_DELIVERY.viewMoreLabel}
              </AppText>
            </Pressable>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${CART_FREE_DELIVERY.progressRatio * 100}%` }]}
            />
          </View>
        </View>

        {/* Your Cart Header */}
        <View style={styles.cartSectionHeader}>
          <AppText variant="subheading" color="primary" style={styles.boldText}>
            Your Cart
          </AppText>

          <AppText variant="caption" style={styles.itemCountText}>
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
          </AppText>
        </View>

        {/* Cart Item Cards */}
        {cartItems.map((item) => (
          <CartItemCard
            key={item.id}
            name={item.name}
            unit={item.unit}
            price={item.price}
            oldPrice={item.oldPrice}
            quantity={item.quantity}
            image={item.image}
            onIncrement={() => handleIncrement(item.id)}
            onDecrement={() => handleDecrement(item.id)}
            onPress={() => handleProductPress(item.id)}
          />
        ))}

        {/* Add More Items Button */}
        <View style={styles.buttonWrapper}>
          <AppButton
            title={CART_ACTIONS.addMoreItems}
            variant="primary"
            size="medium"
            onPress={handleAddMoreItems}
          />
        </View>

        {/* Apply Coupon Card */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${CART_ACTIONS.applyCouponTitle}, ${CART_ACTIONS.applyCouponSubtitle}`}
          onPress={() => {}}
          style={({ pressed }) => [styles.couponCard, pressed && styles.pressed]}
        >
          <View style={styles.couponContent}>
            <AppText variant="bodyMedium" color="primary" style={styles.boldText}>
              {CART_ACTIONS.applyCouponTitle}
            </AppText>
            <AppText variant="caption" color="secondary" style={styles.couponSubtitle}>
              {CART_ACTIONS.applyCouponSubtitle}
            </AppText>
          </View>

          <AppIcon name="chevronRight" size="md" color={COLORS.text.primary} />
        </Pressable>

        {/* Recommendations Section */}
        <View style={styles.recommendationsCard}>
          <View style={styles.recommendationsHeader}>
            <AppText variant="subheading" color="primary" style={styles.boldText}>
              {CART_RECOMMENDATIONS.title}
            </AppText>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={CART_RECOMMENDATIONS.viewAllLabel}
              hitSlop={6}
              onPress={handleAddMoreItems}
            >
              <AppText variant="caption" color="secondary" style={styles.viewAllText}>
                {CART_RECOMMENDATIONS.viewAllLabel}
              </AppText>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsList}
          >
            {CART_RECOMMENDATIONS.products.map((item) => (
              <SimilarProductCard
                key={item.id}
                name={item.name}
                unit={item.unit}
                price={item.price}
                oldPrice={item.oldPrice}
                image={item.image}
                onPress={() => handleProductPress(item.id)}
                onAddPress={() => handleAddRecommendation(item.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Your Bill & Cancellation Policy */}
        <View
          onLayout={(event) => {
            billSectionY.current = event.nativeEvent.layout.y;
          }}
        >
          <CartBillSummaryCard
            title={CART_BILL_DATA.title}
            itemsTotalLabel={CART_BILL_DATA.itemsTotalLabel}
            itemsTotal={itemsTotal}
            deliveryFeeLabel={CART_BILL_DATA.deliveryFeeLabel}
            deliveryFee={cartItems.length > 0 ? CART_BILL_DATA.deliveryFeeAmount : 0}
            handlingFeeLabel={CART_BILL_DATA.handlingFeeLabel}
            handlingFee={cartItems.length > 0 ? CART_BILL_DATA.handlingFeeAmount : 0}
            totalAmountLabel={CART_BILL_DATA.totalAmountLabel}
            totalAmount={totalAmount}
            savingsText={CART_BILL_DATA.savingsText}
            cancellationTitle={CART_CANCELLATION_POLICY.title}
            cancellationDescription={CART_CANCELLATION_POLICY.description}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <CartBottomBar
        walletLabel={CART_WALLET_DATA.label}
        walletBalance={CART_WALLET_DATA.balance}
        addBalanceLabel={CART_WALLET_DATA.addBalanceLabel}
        totalAmount={totalAmount}
        viewBillDetailsLabel={CART_FOOTER.viewBillDetailsLabel}
        continueLabel={CART_FOOTER.continueLabel}
        onAddBalancePress={() => router.push('/(buyer)/profile')}
        onViewBillDetailsPress={handleViewBillDetails}
        onContinuePress={handleContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingBottom: SPACING.xl,
  },

  boldText: {
    fontFamily: FONT_FAMILY.bold,
  },

  freeDeliveryContainer: {
    paddingVertical: SPACING.md,
  },

  freeDeliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  freeDeliverySubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs / 2,
    marginBottom: SPACING.sm,
  },

  greenAmountText: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.success,
  },

  viewMoreLink: {
    fontFamily: FONT_FAMILY.semiBold,
    textDecorationLine: 'underline',
  },

  progressTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.pill,
  },

  cartSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },

  itemCountText: {
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.orange.normal,
  },

  buttonWrapper: {
    marginVertical: SPACING.xs,
  },

  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.orange.light,
    borderWidth: 1,
    borderColor: COLORS.orange.lightActive,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginVertical: SPACING.sm,
  },

  couponContent: {
    flex: 1,
  },

  couponSubtitle: {
    marginTop: SPACING.xs / 2,
  },

  recommendationsCard: {
    backgroundColor: COLORS.orange.lightActive,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginVertical: SPACING.md,
  },

  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },

  viewAllText: {
    fontFamily: FONT_FAMILY.medium,
  },

  recommendationsList: {
    gap: SPACING.sm,
  },

  bottomSpacer: {
    height: SPACING.xl,
  },

  pressed: {
    opacity: 0.85,
  },
});
