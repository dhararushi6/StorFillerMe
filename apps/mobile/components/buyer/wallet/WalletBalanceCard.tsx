import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, RADIUS, SPACING, useResponsive } from '@/theme';

interface WalletBalanceCardProps {
  title: string;
  statusLabel: string;
  currentBalanceLabel: string;
  balance: number;
}

export function WalletBalanceCard({
  title,
  statusLabel,
  currentBalanceLabel,
  balance,
}: WalletBalanceCardProps) {
  const { wallet } = useResponsive();

  return (
    <View
      style={[
        styles.card,
        {
          minHeight: wallet.cardMinHeight,
        },
      ]}
    >
      <View style={styles.topRow}>
        <AppText variant="bodyMedium" color="inverse" style={styles.title}>
          {title}
        </AppText>

        <AppText variant="caption" color="inverseSecondary">
          {statusLabel}
        </AppText>
      </View>

      <AppText variant="caption" color="inverseSecondary" style={styles.balanceLabel}>
        {currentBalanceLabel}
      </AppText>

      <AppText
        variant="heading"
        color="inverse"
        style={[
          styles.balance,
          {
            fontSize: wallet.balanceFontSize,
          },
        ]}
      >
        ₹ {balance.toFixed(2)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.orange.dark,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
  },

  balanceLabel: {
    marginTop: SPACING.lg,
  },

  balance: {
    fontFamily: FONT_FAMILY.bold,
    marginTop: SPACING.xs,
  },
});
