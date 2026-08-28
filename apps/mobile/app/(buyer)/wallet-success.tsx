import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/ui/AppButton';
import { PAYMENT_SUCCESS_SCREEN, PAYMENTS_SCREEN } from '@/constants/payment';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, useResponsive } from '@/theme';

export default function BuyerWalletSuccessScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ amount?: string }>();
  const { horizontalPadding } = useResponsive();

  const [copied, setCopied] = useState(false);

  const amount = params.amount ? parseFloat(params.amount) : PAYMENTS_SCREEN.defaultAmount;
  const formattedAmount = amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleCopyTransactionId = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleViewWallet = useCallback(() => {
    router.replace('/(buyer)/wallet');
  }, []);

  const handleGoHome = useCallback(() => {
    router.replace('/(buyer)/home');
  }, []);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={PAYMENT_SUCCESS_SCREEN.headerTitle}
        fallbackRoute="/(buyer)/wallet"
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

          <AppText style={styles.title}>
            {PAYMENT_SUCCESS_SCREEN.title}
          </AppText>

          <AppText style={styles.subtitle}>
            {formattedAmount} {PAYMENT_SUCCESS_SCREEN.subtitleSuffix}
          </AppText>
        </View>

        {/* Orange Receipt / Ticket Card */}
        <View style={styles.receiptCard}>
          {/* Top Section: Wallet Balance */}
          <View style={styles.balanceSection}>
            <AppText style={styles.cardLabel}>
              {PAYMENT_SUCCESS_SCREEN.walletBalanceLabel}
            </AppText>
            <AppText style={styles.cardBalance}>
              ₹ {formattedAmount}
            </AppText>
          </View>

          {/* Solid White Divider */}
          <View style={styles.solidDivider} />

          {/* Middle Section: Payment Method & Brand */}
          <View style={styles.cardRow}>
            <View style={styles.cardInfoCol}>
              <AppText style={styles.cardLabel}>
                {PAYMENT_SUCCESS_SCREEN.paymentMethodLabel}
              </AppText>
              <AppText style={styles.cardSubText}>
                Card number: hergunigk6789
              </AppText>
            </View>

            <AppText style={styles.cardBrand}>
              VISA
            </AppText>
          </View>

          {/* Solid White Divider */}
          <View style={styles.solidDivider} />

          {/* Bottom Section: Transaction ID & Copy */}
          <View style={styles.cardRow}>
            <View style={styles.cardInfoCol}>
              <AppText style={styles.cardLabel}>
                {PAYMENT_SUCCESS_SCREEN.transactionIdLabel}
              </AppText>
              <AppText style={styles.cardSubText}>
                {PAYMENT_SUCCESS_SCREEN.defaultTransactionId}
              </AppText>
            </View>

            <Pressable
              onPress={handleCopyTransactionId}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Copy Transaction ID"
              style={({ pressed }) => [styles.copyButton, pressed && styles.pressed]}
            >
              <Ionicons
                name={copied ? 'checkmark-circle-outline' : 'copy-outline'}
                size={20}
                color={COLORS.white}
              />
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
          onPress={handleViewWallet}
        />

        <Pressable
          style={({ pressed }) => [
            styles.goHomeButton,
            pressed && styles.goHomeButtonPressed,
          ]}
          onPress={handleGoHome}
          accessibilityRole="button"
          accessibilityLabel={PAYMENT_SUCCESS_SCREEN.goHomeLabel}
        >
          <AppText variant="bodyMedium" style={styles.goHomeText}>
            {PAYMENT_SUCCESS_SCREEN.goHomeLabel}
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
    backgroundColor: '#009411',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md + 2,
    shadowColor: '#009411',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 20,
    lineHeight: 24,
    color: '#009411',
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    lineHeight: 18,
    color: '#444444',
    textAlign: 'center',
    marginTop: 4,
  },

  receiptCard: {
    backgroundColor: COLORS.orange.normal,
    borderRadius: 20,
    padding: 20,
  },

  balanceSection: {
    gap: 4,
  },

  cardLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.white,
  },

  cardBalance: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 24,
    lineHeight: 29,
    color: COLORS.white,
    marginTop: 2,
  },

  solidDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginVertical: 14,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardInfoCol: {
    gap: 3,
  },

  cardSubText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.white,
    opacity: 0.9,
  },

  cardBrand: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 24,
    lineHeight: 29,
    color: COLORS.white,
    letterSpacing: 0,
  },

  copyButton: {
    padding: 6,
  },

  footer: {
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    gap: SPACING.md,
  },

  goHomeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },

  goHomeButtonPressed: {
    opacity: 0.7,
  },

  goHomeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.orange.normal,
  },

  pressed: {
    opacity: 0.75,
  },
});
