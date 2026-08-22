import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { type WalletTransaction } from '@/constants/wallet';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';
import { WalletTransactionItem } from './WalletTransactionItem';

interface WalletRecentTransactionsProps {
  title: string;
  viewAllLabel: string;
  transactions: readonly WalletTransaction[];
  onViewAllPress?: () => void;
}

export function WalletRecentTransactions({
  title,
  viewAllLabel,
  transactions,
  onViewAllPress,
}: WalletRecentTransactionsProps) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <AppText variant="subheading" color="primary" style={styles.title}>
          {title}
        </AppText>

        <Pressable
          onPress={onViewAllPress}
          accessibilityRole="button"
          accessibilityLabel={viewAllLabel}
          hitSlop={8}
          style={({ pressed }) => [styles.viewAllButton, pressed && styles.pressed]}
        >
          <AppText variant="caption" color="primary" style={styles.viewAllText}>
            {viewAllLabel}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.card}>
        {transactions.map((transaction) => (
          <WalletTransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: SPACING.md,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
  },

  viewAllButton: {
    backgroundColor: COLORS.orange.card,
    borderWidth: 1,
    borderColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs / 2,
  },

  viewAllText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },

  card: {
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  pressed: {
    opacity: 0.75,
  },
});
