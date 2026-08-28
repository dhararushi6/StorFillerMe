import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/ui/AppButton';
import { ORDER_SUCCESS_SCREEN } from '@/constants/payment';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING, useResponsive } from '@/theme';

export default function BuyerPaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    amount?: string;
    orderId?: string;
    itemsCount?: string;
  }>();
  const { horizontalPadding } = useResponsive();

  const [copied, setCopied] = useState(false);

  const amount = params.amount ? parseFloat(params.amount) : 9200;
  const orderId = params.orderId || ORDER_SUCCESS_SCREEN.defaultOrderId;
  const itemsCount = params.itemsCount || '26 Items';

  const handleCopyOrderId = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleTrackOrder = useCallback(() => {
    router.push({
      pathname: '/(buyer)/track-order',
      params: {
        orderId,
        amount: amount.toString(),
        itemsCount,
      },
    });
  }, [amount, itemsCount, orderId]);

  const handleContinueShopping = useCallback(() => {
    router.replace('/(buyer)/home');
  }, []);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={ORDER_SUCCESS_SCREEN.headerTitle}
        fallbackRoute="/(buyer)/home"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, sidePadding]}
      >
        {/* Success Icon & Headings */}
        <View style={styles.topSection}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={48} color={COLORS.white} />
          </View>

          <AppText variant="heading" color="primary" style={styles.title}>
            {ORDER_SUCCESS_SCREEN.title}
          </AppText>

          <AppText variant="body" color="secondary" style={styles.subtitle}>
            {ORDER_SUCCESS_SCREEN.subtitle}
          </AppText>
        </View>

        {/* Orange Receipt / Order Ticket Card */}
        <View style={styles.receiptCard}>
          {/* Order ID Section */}
          <View style={styles.orderIdSection}>
            <AppText variant="caption" color="inverse" style={styles.orderIdLabel}>
              {ORDER_SUCCESS_SCREEN.orderIdLabel}
            </AppText>

            <View style={styles.orderIdRow}>
              <AppText variant="bodyMedium" color="inverse" style={styles.orderIdText}>
                {orderId}
              </AppText>

              <Pressable
                onPress={handleCopyOrderId}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Copy Order ID"
              >
                <AppText variant="caption" color="inverse" style={styles.copyButtonText}>
                  {copied ? 'Copied!' : ORDER_SUCCESS_SCREEN.copyLabel}
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* Dashed Line */}
          <View style={styles.dashedDivider} />

          {/* Key-Value Details */}
          <View style={styles.detailsList}>
            {/* Amount Paid */}
            <View style={styles.detailRow}>
              <AppText variant="caption" color="inverse" style={styles.detailLabel}>
                {ORDER_SUCCESS_SCREEN.amountPaidLabel}
              </AppText>
              <AppText variant="bodyMedium" color="inverse" style={styles.amountValue}>
                ₹ {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </AppText>
            </View>

            {/* Items Ordered */}
            <View style={styles.detailRow}>
              <AppText variant="caption" color="inverse" style={styles.detailLabel}>
                {ORDER_SUCCESS_SCREEN.itemsOrderedLabel}
              </AppText>
              <AppText variant="bodyMedium" color="inverse" style={styles.detailValue}>
                {itemsCount}
              </AppText>
            </View>

            {/* Payment & Time */}
            <View style={styles.detailRow}>
              <AppText variant="caption" color="inverse" style={styles.detailLabel}>
                {ORDER_SUCCESS_SCREEN.paymentTimeLabel}
              </AppText>
              <AppText variant="bodyMedium" color="inverse" style={styles.detailValue}>
                {ORDER_SUCCESS_SCREEN.defaultPaymentTime}
              </AppText>
            </View>
          </View>

          {/* Notched Ticket Divider */}
          <View style={styles.ticketNotchContainer}>
            <View style={[styles.notch, styles.notchLeft]} />
            <View style={styles.notchDashedLine} />
            <View style={[styles.notch, styles.notchRight]} />
          </View>

          {/* Delivery Window Section */}
          <View style={styles.deliverySection}>
            <View style={styles.truckIconBox}>
              <Ionicons name="bus-outline" size={24} color={COLORS.white} />
            </View>

            <View style={styles.deliveryTextColumn}>
              <AppText variant="caption" color="inverse" style={styles.deliveryLabel}>
                {ORDER_SUCCESS_SCREEN.deliveryAtLabel}
              </AppText>
              <AppText variant="bodyMedium" color="inverse" style={styles.deliveryWindow}>
                {ORDER_SUCCESS_SCREEN.defaultDeliveryWindow}
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={[
          styles.footer,
          sidePadding,
          {
            paddingBottom: insets.bottom + SPACING.lg,
          },
        ]}
      >
        <AppButton
          title={ORDER_SUCCESS_SCREEN.trackOrderLabel}
          onPress={handleTrackOrder}
        />

        <Pressable
          style={({ pressed }) => [
            styles.continueShoppingButton,
            pressed && styles.continueButtonPressed,
          ]}
          onPress={handleContinueShopping}
          accessibilityRole="button"
          accessibilityLabel={ORDER_SUCCESS_SCREEN.continueShoppingLabel}
        >
          <AppText variant="bodyMedium" style={styles.continueShoppingText}>
            {ORDER_SUCCESS_SCREEN.continueShoppingLabel}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  topSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#0BA02C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md + 2,
    shadowColor: '#0BA02C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 22,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },

  receiptCard: {
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    position: 'relative',
    overflow: 'hidden',
  },

  orderIdSection: {
    paddingHorizontal: SPACING.lg,
    gap: 2,
  },

  orderIdLabel: {
    fontSize: 11,
    opacity: 0.85,
    fontFamily: FONT_FAMILY.regular,
  },

  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  orderIdText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16,
  },

  copyButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 12,
    textDecorationLine: 'underline',
  },

  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    marginVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
  },

  detailsList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm + 2,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailLabel: {
    fontSize: 12,
    opacity: 0.85,
    fontFamily: FONT_FAMILY.regular,
  },

  detailValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 13,
  },

  amountValue: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 15,
  },

  ticketNotchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
    position: 'relative',
  },

  notch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    position: 'absolute',
    zIndex: 2,
  },

  notchLeft: {
    left: -10,
  },

  notchRight: {
    right: -10,
  },

  notchDashedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 16,
  },

  deliverySection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },

  truckIconBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deliveryTextColumn: {
    gap: 2,
  },

  deliveryLabel: {
    fontSize: 11,
    opacity: 0.85,
    fontFamily: FONT_FAMILY.regular,
  },

  deliveryWindow: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 13,
  },

  footer: {
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    gap: SPACING.md,
  },

  continueShoppingButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBD8',
    borderWidth: 1,
    borderColor: '#E8A783',
    borderRadius: RADIUS.lg,
  },

  continueButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  continueShoppingText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md,
    color: '#CC5D28',
  },
});
