import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/ui/AppButton';
import { ORDER_DELIVERED_SCREEN } from '@/constants/order';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
  useResponsive,
} from '@/theme';

export default function BuyerDeliverySuccessScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    amount?: string;
    orderId?: string;
    itemsCount?: string;
    deliveredDate?: string;
  }>();
  const { horizontalPadding } = useResponsive();

  const [copied, setCopied] = useState(false);

  const amount = params.amount ? parseFloat(params.amount) : ORDER_DELIVERED_SCREEN.defaultAmount;
  const orderId = params.orderId || ORDER_DELIVERED_SCREEN.defaultOrderId;
  const itemsCount = params.itemsCount || ORDER_DELIVERED_SCREEN.defaultItemsCount;
  const deliveredDate = params.deliveredDate || ORDER_DELIVERED_SCREEN.deliveredDate;

  const handleCopyOrderId = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleBackToHome = useCallback(() => {
    router.replace('/(buyer)/home');
  }, []);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={ORDER_DELIVERED_SCREEN.headerTitle} fallbackRoute="/(buyer)/home" />

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
            {ORDER_DELIVERED_SCREEN.title}
          </AppText>

          <AppText variant="body" color="secondary" style={styles.subtitle}>
            {ORDER_DELIVERED_SCREEN.subtitle}
          </AppText>

          <AppText style={styles.deliveredDateText}>{deliveredDate}</AppText>
        </View>

        {/* Orange Receipt / Order Ticket Card */}
        <View style={styles.receiptCard}>
          {/* Order ID Section */}
          <View style={styles.orderIdSection}>
            <AppText variant="caption" color="inverse" style={styles.orderIdLabel}>
              {ORDER_DELIVERED_SCREEN.orderIdLabel}
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
                  {copied ? 'Copied!' : ORDER_DELIVERED_SCREEN.copyLabel}
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
                {ORDER_DELIVERED_SCREEN.amountPaidLabel}
              </AppText>
              <AppText variant="bodyMedium" color="inverse" style={styles.amountValue}>
                ₹ {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </AppText>
            </View>

            {/* Items Ordered */}
            <View style={styles.detailRow}>
              <AppText variant="caption" color="inverse" style={styles.detailLabel}>
                {ORDER_DELIVERED_SCREEN.itemsOrderedLabel}
              </AppText>
              <AppText variant="bodyMedium" color="inverse" style={styles.detailValue}>
                {itemsCount}
              </AppText>
            </View>

            {/* Payment & Time */}
            <View style={styles.detailRow}>
              <AppText variant="caption" color="inverse" style={styles.detailLabel}>
                {ORDER_DELIVERED_SCREEN.paymentTimeLabel}
              </AppText>
              <AppText variant="bodyMedium" color="inverse" style={styles.detailValue}>
                {ORDER_DELIVERED_SCREEN.defaultPaymentTime}
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
                {ORDER_DELIVERED_SCREEN.deliveryAtLabel}
              </AppText>
              <AppText variant="bodyMedium" color="inverse" style={styles.deliveryWindow}>
                {ORDER_DELIVERED_SCREEN.defaultDeliveryWindow}
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action (Back to Home) */}
      <View
        style={[
          styles.footer,
          sidePadding,
          {
            paddingBottom: insets.bottom + SPACING.lg,
          },
        ]}
      >
        <AppButton title={ORDER_DELIVERED_SCREEN.backToHomeLabel} onPress={handleBackToHome} />
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
    fontFamily: FONT_FAMILY.medium,
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },

  deliveredDateText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.orange.normal,
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
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.medium,
    color: '#FFFFFF',
  },

  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  orderIdText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.amount,
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
    lineHeight: 14,
    fontFamily: FONT_FAMILY.medium,
    color: '#FFFFFF',
  },

  detailValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.amount,
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
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.medium,
    color: '#FFFFFF',
  },

  deliveryWindow: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 13,
  },

  footer: {
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
  },
});
