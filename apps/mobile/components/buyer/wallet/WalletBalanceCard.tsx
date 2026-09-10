import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, SPACING } from '@/theme';

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
  return (
    <View style={styles.card}>
      {/* Top Row: Store Filler Wallet & Low Balance */}
      <View style={styles.topRow}>
        <AppText variant="bodyMedium" color="inverse" style={styles.title}>
          {title}
        </AppText>

        <AppText variant="caption" color="inverse" style={styles.statusLabel}>
          {statusLabel}
        </AppText>
      </View>

      {/* Bottom Section: Current Balance & Big Amount */}
      <View style={styles.balanceSection}>
        <AppText variant="caption" color="inverse" style={styles.currentBalanceLabel}>
          {currentBalanceLabel}
        </AppText>

        <AppText variant="display" color="inverse" style={styles.balance}>
          ₹ {balance.toFixed(2)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 176,
    borderRadius: 12,
    padding: SPACING.lg,
    justifyContent: 'space-between',
    backgroundColor: COLORS.orange.normal,
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(135deg, #CC5D28 0%, #6B2605 100%)',
      } as Record<string, unknown>,
    }),
    overflow: 'hidden',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },

  statusLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
    opacity: 0.95,
  },

  balanceSection: {
    gap: 4,
  },

  currentBalanceLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
    opacity: 0.85,
  },

  balance: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.hero,
    lineHeight: LINE_HEIGHT.hero,
  },
});
