import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import ashirvaadAttaImg from '@/assets/images/home/ashirvaad-mp-atta.png';
import fortuneOilImg from '@/assets/images/home/fortune-sunlite-oil.png';
import toorDalImg from '@/assets/images/home/tata-sampann-toor-dal.png';
import truckFillIcon from '@/assets/icons/truck-fill.png';
import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { DEFAULT_TIMELINE_STEPS, TRACK_ORDER_SCREEN } from '@/constants/order';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING, useResponsive } from '@/theme';

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
  const totalAmount = params.amount ? parseFloat(params.amount) : TRACK_ORDER_SCREEN.defaultTotalAmount;
  const itemsCount = params.itemsCount || TRACK_ORDER_SCREEN.defaultItemsCount;

  const handleNeedHelp = useCallback(() => {
    router.push('/(buyer)/support');
  }, []);

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
            <AppText style={styles.needHelpText}>
              {TRACK_ORDER_SCREEN.needHelpLabel}
            </AppText>
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
        {/* Order ID & Confirmed Status Header */}
        <View style={styles.orderIdHeaderRow}>
          <View style={styles.orderIdCol}>
            <AppText style={styles.orderIdLabel}>
              {TRACK_ORDER_SCREEN.orderIdLabel}
            </AppText>

            <AppText style={styles.orderIdValue}>
              {orderId}
            </AppText>

            <AppText style={styles.placedDateText}>
              {TRACK_ORDER_SCREEN.placedOnPrefix} {TRACK_ORDER_SCREEN.defaultPlacedDate}
            </AppText>
          </View>

          {/* Confirmed Badge */}
          <View style={styles.confirmedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#009411" />
            <AppText style={styles.confirmedText}>
              {TRACK_ORDER_SCREEN.confirmedBadge}
            </AppText>
          </View>
        </View>

        {/* Delivery At Banner (Rectangle 366) */}
        <View style={styles.deliveryBanner}>
          <Image source={truckFillIcon} style={styles.truckIcon} resizeMode="contain" />

          <View style={styles.deliveryBannerTextCol}>
            <AppText style={styles.deliveryAtLabel}>
              {TRACK_ORDER_SCREEN.deliveryAtLabel}
            </AppText>
            <AppText style={styles.deliveryWindowText}>
              {TRACK_ORDER_SCREEN.defaultDeliveryWindow}
            </AppText>
          </View>
        </View>

        {/* Subtitle Notification */}
        <AppText style={styles.deliveryNotice}>
          {TRACK_ORDER_SCREEN.outForDeliveryNotice}
        </AppText>

        {/* Delivery Address Card (Rectangle 66) */}
        <View style={styles.addressCard}>
          <AppText style={styles.addressTitle}>
            {TRACK_ORDER_SCREEN.deliveryAddressTitle}
          </AppText>

          <AppText style={styles.storeName}>
            {TRACK_ORDER_SCREEN.storeName}
          </AppText>

          <AppText style={styles.addressLine}>
            {TRACK_ORDER_SCREEN.addressLine}
          </AppText>

          <AppText style={styles.phoneText}>
            {TRACK_ORDER_SCREEN.phonePrefix}{' '}
            <AppText style={styles.phoneNumber}>
              {TRACK_ORDER_SCREEN.phoneNumber}
            </AppText>
          </AppText>
        </View>

        {/* Order Status Section */}
        <View style={styles.statusSection}>
          <AppText style={styles.statusSectionTitle}>
            {TRACK_ORDER_SCREEN.orderStatusTitle}
          </AppText>

          <View style={styles.timelineContainer}>
            {DEFAULT_TIMELINE_STEPS.map((step, index) => {
              const isLast = index === DEFAULT_TIMELINE_STEPS.length - 1;
              const isStepActive = step.isCompleted;
              const nextStep = DEFAULT_TIMELINE_STEPS[index + 1];
              const isLineCompleted = isStepActive && nextStep?.isCompleted;

              return (
                <View key={step.id} style={styles.timelineStepRow}>
                  {/* Left Column: Dot & Line */}
                  <View style={styles.timelineTrackCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        isStepActive ? styles.timelineDotActive : styles.timelineDotInactive,
                      ]}
                    />

                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          isLineCompleted
                            ? styles.timelineLineActive
                            : styles.timelineLineInactive,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Column: Title & Date */}
                  <View style={[styles.timelineContentCol, !isLast && styles.timelineContentSpacing]}>
                    <AppText
                      style={[
                        styles.stepTitle,
                        isStepActive ? styles.stepTitleActive : styles.stepTitleInactive,
                      ]}
                    >
                      {step.title}
                    </AppText>

                    <AppText style={styles.stepTimestamp}>
                      {step.timestamp}
                    </AppText>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Alert Card (Rectangle 367) */}
        <View style={styles.alertCard}>
          <Ionicons name="alert-circle" size={18} color="#C87C01" />
          <AppText style={styles.alertText}>
            {TRACK_ORDER_SCREEN.alertNotice}
          </AppText>
        </View>

        {/* Order Summary Card */}
        <View style={styles.orderSummaryCard}>
          <View style={styles.summaryTopRow}>
            <AppText style={styles.summaryTitle}>
              {TRACK_ORDER_SCREEN.orderSummaryTitle}
            </AppText>

            <AppText style={styles.summaryCount}>
              {itemsCount}
            </AppText>
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

              <AppText style={styles.moreItemsText}>
                {TRACK_ORDER_SCREEN.moreItemsLabel}
              </AppText>
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
            <Ionicons name="download-outline" size={18} color={COLORS.orange.normal} />
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
            <Ionicons name="share-social-outline" size={18} color={COLORS.orange.normal} />
            <AppText style={styles.outlineButtonText}>
              {TRACK_ORDER_SCREEN.shareOrderLabel}
            </AppText>
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

  orderIdHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  orderIdCol: {
    gap: 2,
  },

  orderIdLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: '#444444',
  },

  orderIdValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
    marginTop: 2,
  },

  placedDateText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: '#666666',
    marginTop: 2,
  },

  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },

  confirmedText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: '#009411',
  },

  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(204, 93, 40, 0.20)',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    gap: SPACING.md,
    minHeight: 64,
  },

  truckIcon: {
    width: 32,
    height: 32,
  },

  deliveryBannerTextCol: {
    gap: 2,
  },

  deliveryAtLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: '#111111',
  },

  deliveryWindowText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 14,
    color: COLORS.orange.normal,
  },

  deliveryNotice: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: '#555555',
    marginTop: -4,
  },

  addressCard: {
    backgroundColor: '#FAE2BB',
    borderRadius: 12,
    padding: SPACING.md,
    gap: 3,
  },

  addressTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 13,
    color: '#000000',
  },

  storeName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 13,
    color: '#000000',
    marginTop: 2,
  },

  addressLine: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    lineHeight: 16,
    color: '#535353',
  },

  phoneText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: '#535353',
    marginTop: 2,
  },

  phoneNumber: {
    fontFamily: FONT_FAMILY.medium,
    color: '#000000',
  },

  statusSection: {
    marginTop: SPACING.xs,
    gap: SPACING.md,
  },

  statusSectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: '#000000',
  },

  timelineContainer: {
    paddingLeft: SPACING.xs,
  },

  timelineStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  timelineTrackCol: {
    alignItems: 'center',
    width: 20,
  },

  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  timelineDotActive: {
    backgroundColor: '#009411',
  },

  timelineDotInactive: {
    backgroundColor: '#8E98A8',
  },

  timelineLine: {
    width: 6,
    height: 44,
  },

  timelineLineActive: {
    backgroundColor: '#009411',
  },

  timelineLineInactive: {
    backgroundColor: '#8E98A8',
  },

  timelineContentCol: {
    flex: 1,
    paddingLeft: SPACING.md,
    gap: 2,
  },

  timelineContentSpacing: {
    paddingBottom: 16,
  },

  stepTitle: {
    fontSize: 14,
    lineHeight: 18,
  },

  stepTitleActive: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.orange.normal,
  },

  stepTitleInactive: {
    fontFamily: FONT_FAMILY.medium,
    color: '#777777',
  },

  stepTimestamp: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    color: '#535353',
  },

  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAE2BB',
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: '#C87C01',
    paddingHorizontal: SPACING.md,
    minHeight: 40,
    gap: SPACING.sm,
  },

  alertText: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#C87C01',
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
    color: '#000000',
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
    color: '#000000',
  },

  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },

  outlineButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.orange.normal,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },

  outlineButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 13,
    color: COLORS.orange.normal,
  },

  pressed: {
    opacity: 0.75,
  },
});
