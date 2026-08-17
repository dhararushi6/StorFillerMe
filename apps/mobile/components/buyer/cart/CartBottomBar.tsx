import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, RADIUS, SPACING, useResponsive } from '@/theme';

interface CartBottomBarProps {
  walletLabel: string;
  walletBalance: number;
  addBalanceLabel: string;
  totalAmount: number;
  viewBillDetailsLabel: string;
  continueLabel: string;
  onAddBalancePress?: () => void;
  onViewBillDetailsPress?: () => void;
  onContinuePress?: () => void;
}

export function CartBottomBar({
  walletLabel,
  walletBalance,
  addBalanceLabel,
  totalAmount,
  viewBillDetailsLabel,
  continueLabel,
  onAddBalancePress,
  onViewBillDetailsPress,
  onContinuePress,
}: CartBottomBarProps) {
  const insets = useSafeAreaInsets();
  const { horizontalPadding } = useResponsive();

  return (
    <View style={styles.container}>
      {/* Wallet Bar */}
      <View style={[styles.walletBar, { paddingHorizontal: horizontalPadding }]}>
        <AppText variant="bodyMedium" color="primary" style={styles.walletText}>
          {walletLabel}{' '}
          <AppText variant="bodyMedium" style={styles.walletBalanceText}>
            ₹ {walletBalance}
          </AppText>
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={addBalanceLabel}
          hitSlop={8}
          onPress={onAddBalancePress}
        >
          <AppText variant="bodyMedium" style={styles.addBalanceText}>
            {addBalanceLabel}
          </AppText>
        </Pressable>
      </View>

      {/* Main Checkout Bar */}
      <View
        style={[
          styles.mainBar,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: Math.max(insets.bottom, SPACING.md),
          },
        ]}
      >
        <View style={styles.priceContainer}>
          <AppText variant="heading" color="primary" style={styles.totalPrice}>
            ₹ {totalAmount}
          </AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={viewBillDetailsLabel}
            hitSlop={6}
            onPress={onViewBillDetailsPress}
          >
            <AppText variant="caption" style={styles.viewBillText}>
              {viewBillDetailsLabel}
            </AppText>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={continueLabel}
          onPress={onContinuePress}
          style={({ pressed }) => [styles.continueButton, pressed && styles.buttonPressed]}
        >
          <AppText variant="button" color="inverse" style={styles.continueText}>
            {continueLabel}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  walletBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.orange.light,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  walletText: {
    fontFamily: FONT_FAMILY.bold,
  },

  walletBalanceText: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.success,
  },

  addBalanceText: {
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.success,
    textDecorationLine: 'underline',
  },

  mainBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    backgroundColor: COLORS.surface,
  },

  priceContainer: {
    justifyContent: 'center',
  },

  totalPrice: {
    fontFamily: FONT_FAMILY.bold,
  },

  viewBillText: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.orange.normal,
    marginTop: SPACING.xs / 2,
  },

  continueButton: {
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },

  buttonPressed: {
    opacity: 0.88,
  },

  continueText: {
    fontFamily: FONT_FAMILY.bold,
  },
});
