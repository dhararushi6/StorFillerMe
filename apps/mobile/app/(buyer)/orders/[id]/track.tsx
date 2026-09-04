import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import downloadSimpleIcon from '@/assets/icons/download-simple.png';
import shareNetworkIcon from '@/assets/icons/share-network.png';
import ashirvaadAttaImg from '@/assets/images/home/ashirvaad-mp-atta.png';
import fortuneOilImg from '@/assets/images/home/fortune-sunlite-oil.png';
import toorDalImg from '@/assets/images/home/tata-sampann-toor-dal.png';
import { OrderHeaderSection } from '@/components/buyer/order';
import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { DEFAULT_TIMELINE_STEPS, TRACK_ORDER_SCREEN } from '@/constants/order';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  ICON_SIZES,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
  useResponsive,
} from '@/theme';

export default function BuyerTrackOrderScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    orderId?: string;
    amount?: string;
    itemsCount?: string;
  }>();
  const { horizontalPadding } = useResponsive();

  const orderId = params.orderId || params.id || TRACK_ORDER_SCREEN.defaultOrderId;
  const totalAmount = params.amount
    ? parseFloat(params.amount)
    : TRACK_ORDER_SCREEN.defaultTotalAmount;
  const itemsCount = params.itemsCount || TRACK_ORDER_SCREEN.defaultItemsCount;

  const handleNeedHelp = useCallback(() => {
    router.push({
      pathname: '/(buyer)/support',
      params: { orderId },
    });
  }, [orderId]);

  const handleDownloadInvoice = useCallback(() => {
    // Invoice download handler
  }, []);

  const handleShareOrder = useCallback(() => {
    // Share order handler
  }, []);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={TRACK_ORDER_SCREEN.headerTitle}
        fallbackRoute="/(buyer)/home"
        rightElement={
          <Pressable
            onPress={handleNeedHelp}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={TRACK_ORDER_SCREEN.needHelpLabel}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <AppText style={styles.needHelpText}>{TRACK_ORDER_SCREEN.needHelpLabel}</AppText>
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          sidePadding,
          {
            paddingBottom: insets.bottom + SPACING.xxl,
          },
        ]}
      >
        {/* Shared Order Header (Order ID + Confirmed + Delivery At Banner + Notice) */}
        <OrderHeaderSection orderId={orderId} />

        {/* Delivery Address Card (Rectangle 66) */}
        <View style={styles.addressCard}>
          <AppText style={styles.addressTitle}>{TRACK_ORDER_SCREEN.deliveryAddressTitle}</AppText>

          <AppText style={styles.storeName}>{TRACK_ORDER_SCREEN.storeName}</AppText>

          <AppText style={styles.addressLine}>{TRACK_ORDER_SCREEN.addressLine}</AppText>

          <AppText style={styles.phoneText}>
            {TRACK_ORDER_SCREEN.phonePrefix}{' '}
            <AppText style={styles.phoneNumber}>{TRACK_ORDER_SCREEN.phoneNumber}</AppText>
          </AppText>
        </View>

        {/* Order Status Section */}
        <View style={styles.statusSection}>
          <AppText style={styles.statusSectionTitle}>{TRACK_ORDER_SCREEN.orderStatusTitle}</AppText>

          <View style={styles.timelineContainer}>
            {DEFAULT_TIMELINE_STEPS.map((step, index) => {
              const isLast = index === DEFAULT_TIMELINE_STEPS.length - 1;
              const isStepActive = step.isCompleted;
              const prevStep = index > 0 ? DEFAULT_TIMELINE_STEPS[index - 1] : null;
              const isTopLineActive = prevStep ? prevStep.isCompleted && isStepActive : false;
              const nextStep = !isLast ? DEFAULT_TIMELINE_STEPS[index + 1] : null;
              const isBottomLineActive = isStepActive && nextStep?.isCompleted;

              return (
                <View key={step.id} style={styles.timelineStepRow}>
                  {/* Left Column: Top/Bottom connector & Centered Dot */}
                  <View style={styles.timelineTrackCol}>
                    {/* Top line connecting from previous step */}
                    {index > 0 && (
                      <View
                        style={[
                          styles.timelineTopLine,
                          isTopLineActive ? styles.timelineLineActive : styles.timelineLineInactive,
                        ]}
                      />
                    )}

                    {/* Bottom line connecting to next step */}
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineBottomLine,
                          isBottomLineActive
                            ? styles.timelineLineActive
                            : styles.timelineLineInactive,
                        ]}
                      />
                    )}

                    {/* Dot centered vertically with title text */}
                    <View
                      style={[
                        styles.timelineDot,
                        isStepActive ? styles.timelineDotActive : styles.timelineDotInactive,
                      ]}
                    />
                  </View>

                  {/* Right Column: Title & Date */}
                  <View
                    style={[styles.timelineContentCol, !isLast && styles.timelineContentSpacing]}
                  >
                    <View style={styles.titleRowWrapper}>
                      <AppText style={styles.stepTitle}>{step.title}</AppText>
                    </View>

                    <AppText style={styles.stepTimestamp}>{step.timestamp}</AppText>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Alert Card (Rectangle 367) */}
        <View style={styles.alertCard}>
          <Ionicons name="alert-circle" size={18} color="#CC5D28" />
          <AppText style={styles.alertText}>{TRACK_ORDER_SCREEN.alertNotice}</AppText>
        </View>

        {/* Order Summary Card */}
        <View style={styles.orderSummaryCard}>
          <View style={styles.summaryTopRow}>
            <AppText style={styles.summaryTitle}>{TRACK_ORDER_SCREEN.orderSummaryTitle}</AppText>

            <AppText style={styles.summaryCount}>{itemsCount}</AppText>
          </View>

          <View style={styles.summaryProductsRow}>
            <View style={styles.productThumbnails}>
              <View style={styles.thumbnailBox}>
                <Image source={fortuneOilImg} style={styles.productImage} resizeMode="contain" />
              </View>

              <View style={styles.thumbnailBox}>
                <Image source={ashirvaadAttaImg} style={styles.productImage} resizeMode="contain" />
              </View>

              <View style={styles.thumbnailBox}>
                <Image source={toorDalImg} style={styles.productImage} resizeMode="contain" />
              </View>

              <AppText style={styles.moreItemsText}>{TRACK_ORDER_SCREEN.moreItemsLabel}</AppText>
            </View>

            <AppText style={styles.summaryTotal}>
              ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </AppText>
          </View>
        </View>

        {/* Bottom Actions (Frame 107) */}
        <View style={styles.actionButtonsRow}>
          <Pressable
            onPress={handleDownloadInvoice}
            accessibilityRole="button"
            accessibilityLabel={TRACK_ORDER_SCREEN.downloadInvoiceLabel}
            hitSlop={8}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            <Image source={downloadSimpleIcon} style={styles.actionIcon} resizeMode="contain" />
            <AppText style={styles.outlineButtonText}>
              {TRACK_ORDER_SCREEN.downloadInvoiceLabel}
            </AppText>
          </Pressable>

          <Pressable
            onPress={handleShareOrder}
            accessibilityRole="button"
            accessibilityLabel={TRACK_ORDER_SCREEN.shareOrderLabel}
            hitSlop={8}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            <Image source={shareNetworkIcon} style={styles.actionIcon} resizeMode="contain" />
            <AppText style={styles.outlineButtonText}>{TRACK_ORDER_SCREEN.shareOrderLabel}</AppText>
          </Pressable>
        </View>
      </ScrollView>
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
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },

  needHelpText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.orange.normal,
  },

  addressCard: {
    backgroundColor: COLORS.orange.card,
    borderRadius: 12,
    padding: SPACING.md,
    gap: 3,
  },

  addressTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 13,
    color: COLORS.black,
  },

  storeName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 13,
    color: COLORS.black,
    marginTop: 2,
  },

  addressLine: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.note,
    color: COLORS.text.detail,
  },

  phoneText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.detail,
    marginTop: 2,
  },

  phoneNumber: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.black,
  },

  statusSection: {
    marginTop: SPACING.xs,
    gap: SPACING.md,
  },

  statusSectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.black,
  },

  timelineContainer: {
    paddingLeft: SPACING.xs,
  },

  timelineStepRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  timelineTrackCol: {
    alignItems: 'center',
    width: 20,
    position: 'relative',
  },

  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 1,
    zIndex: 2,
  },

  timelineDotActive: {
    backgroundColor: COLORS.green.dark,
  },

  timelineDotInactive: {
    backgroundColor: COLORS.inactive,
  },

  timelineTopLine: {
    position: 'absolute',
    top: 0,
    height: 9,
    width: 6,
    left: 7,
    zIndex: 1,
  },

  timelineBottomLine: {
    position: 'absolute',
    top: 9,
    bottom: 0,
    width: 6,
    left: 7,
    zIndex: 1,
  },

  timelineLineActive: {
    backgroundColor: COLORS.green.dark,
  },

  timelineLineInactive: {
    backgroundColor: COLORS.inactive,
  },

  timelineContentCol: {
    flex: 1,
    paddingLeft: SPACING.md,
    gap: 2,
  },

  timelineContentSpacing: {
    paddingBottom: 20,
  },

  titleRowWrapper: {
    height: 18,
    justifyContent: 'center',
  },

  stepTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.orange.normal,
  },

  stepTimestamp: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: COLORS.black,
  },

  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange.card,
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: '#CC5D28',
    paddingHorizontal: SPACING.md,
    minHeight: 40,
    gap: SPACING.sm,
  },

  alertText: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#CC5D28',
  },

  orderSummaryCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: '#C87C01',
    padding: SPACING.md,
    gap: SPACING.md,
    minHeight: 100,
  },

  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 14,
    color: COLORS.black,
  },

  summaryCount: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: '#555555',
  },

  summaryProductsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  productThumbnails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  thumbnailBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },

  productImage: {
    width: 34,
    height: 34,
  },

  moreItemsText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 11,
    color: COLORS.orange.normal,
    marginLeft: 2,
  },

  summaryTotal: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.black,
  },

  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },

  outlineButton: {
    flex: 1,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.orange.normal,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
  },

  actionIcon: {
    width: ICON_SIZES.base,
    height: ICON_SIZES.base,
  },

  outlineButtonText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.amount,
    color: COLORS.orange.normal,
  },

  pressed: {
    opacity: 0.75,
  },
});
