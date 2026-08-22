import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import successIcon from '@/assets/icons/check-circle-success.png';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { PAYMENT_SUCCESS_SCREEN, PAYMENTS_SCREEN } from '@/constants/payment';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING, useResponsive } from '@/theme';

export default function BuyerPaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ amount?: string; transactionId?: string }>();
  const { horizontalPadding } = useResponsive();

  const totalAmount = params.amount ? parseFloat(params.amount) : PAYMENTS_SCREEN.defaultAmount;

  const transactionId = params.transactionId || PAYMENT_SUCCESS_SCREEN.defaultTransactionId;

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      {/* Top Header Background */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
          },
        ]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, sidePadding]}
      >
        {/* Success Icon & Headings */}
        <View style={styles.topSection}>
          <Image source={successIcon} style={styles.successIcon} resizeMode="contain" />

          <AppText variant="subheading" style={styles.title}>
            {PAYMENT_SUCCESS_SCREEN.title}
          </AppText>

          <AppText variant="body" color="secondary" style={styles.subtitle}>
            {`${totalAmount.toFixed(2)} ${PAYMENT_SUCCESS_SCREEN.subtitleSuffix}`}
          </AppText>
        </View>

        {/* Receipt Card */}
        <View style={styles.card}>
          {/* Wallet Balance */}
          <View style={styles.cardSection}>
            <AppText variant="caption" color="inverseSecondary">
              {PAYMENT_SUCCESS_SCREEN.walletBalanceLabel}
            </AppText>
            <AppText variant="heading" color="inverse" style={styles.balanceText}>
              ₹ {totalAmount.toFixed(2)}
            </AppText>
          </View>

          <View style={styles.divider} />

          {/* Payment Method */}
          <View style={styles.cardRow}>
            <View style={styles.cardRowLeft}>
              <AppText variant="caption" color="inverseSecondary">
                {PAYMENT_SUCCESS_SCREEN.paymentMethodLabel}
              </AppText>
              <AppText variant="caption" color="inverseSecondary" style={styles.subDetail}>
                {PAYMENT_SUCCESS_SCREEN.cardNumberMasked}
              </AppText>
            </View>

            <AppText variant="subheading" color="inverse" style={styles.brandText}>
              {PAYMENT_SUCCESS_SCREEN.cardBrand}
            </AppText>
          </View>

          <View style={styles.divider} />

          {/* Transaction ID */}
          <View style={styles.cardRow}>
            <View style={styles.cardRowLeft}>
              <AppText variant="caption" color="inverseSecondary">
                {PAYMENT_SUCCESS_SCREEN.transactionIdLabel}
              </AppText>
              <AppText variant="caption" color="inverseSecondary" style={styles.subDetail}>
                {transactionId}
              </AppText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Copy transaction ID"
              hitSlop={8}
            >
              <Ionicons name="copy-outline" size={20} color={COLORS.surface} />
            </Pressable>
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
          title={PAYMENT_SUCCESS_SCREEN.viewWalletLabel}
          onPress={() => router.replace('/(buyer)/wallet')}
        />

        <Pressable
          style={styles.homeLink}
          onPress={() => router.replace('/(buyer)/home')}
          accessibilityRole="button"
          accessibilityLabel={PAYMENT_SUCCESS_SCREEN.goHomeLabel}
        >
          <AppText style={styles.homeLinkText}>{PAYMENT_SUCCESS_SCREEN.goHomeLabel}</AppText>
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

  header: {
    minHeight: SIZES.headerLargeHeight,
    backgroundColor: COLORS.header,
    borderBottomLeftRadius: RADIUS.header,
    borderBottomRightRadius: RADIUS.header,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  topSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  successIcon: {
    width: 96,
    height: 96,
    marginBottom: SPACING.lg,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.lg + 1,
    color: COLORS.success,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm + 1,
    textAlign: 'center',
    marginTop: SPACING.xs,
    lineHeight: 20,
  },

  card: {
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg + 2,
  },

  cardSection: {
    gap: 2,
  },

  balanceText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginVertical: SPACING.md,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardRowLeft: {
    gap: 2,
  },

  subDetail: {
    marginTop: 2,
    opacity: 0.9,
  },

  brandText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.lg,
    letterSpacing: 1,
  },

  footer: {
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    gap: SPACING.md,
  },

  homeLink: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },

  homeLinkText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.orange.normal,
  },
});
