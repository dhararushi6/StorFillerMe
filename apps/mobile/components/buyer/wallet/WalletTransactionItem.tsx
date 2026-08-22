import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import rectangle376 from '@/assets/icons/Rectangle-376.png';
import rectangle377 from '@/assets/icons/Rectangle-377.png';
import { AppText } from '@/components/common/AppText';
import { type WalletTransaction } from '@/constants/wallet';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, SPACING } from '@/theme';

interface WalletTransactionItemProps {
  transaction: WalletTransaction;
}

export function WalletTransactionItem({ transaction }: WalletTransactionItemProps) {
  const isCredit = transaction.type === 'credit';
  const bgImage = isCredit ? rectangle376 : rectangle377;
  const iconName = isCredit ? 'south-east' : 'north-east';
  const arrowColor = isCredit ? COLORS.success : COLORS.danger;
  const amountColor = isCredit ? COLORS.success : COLORS.danger;
  const sign = isCredit ? '+' : '-';

  return (
    <View style={styles.row}>
      <View style={styles.iconContainer}>
        <Image source={bgImage} style={styles.badgeBg} resizeMode="contain" />
        <MaterialIcons name={iconName} size={20} color={arrowColor} />
      </View>

      <View style={styles.details}>
        <AppText variant="bodyMedium" color="primary" style={styles.title}>
          {transaction.title}
        </AppText>
        <AppText variant="caption" color="muted" style={styles.date}>
          {transaction.date}
        </AppText>
      </View>

      <AppText variant="bodyMedium" style={[styles.amount, { color: amountColor }]}>
        {sign} ₹ {transaction.amount}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md - 2,
    gap: SPACING.md,
  },

  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  badgeBg: {
    width: 36,
    height: 36,
    position: 'absolute',
  },

  details: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.sm + 1,
    lineHeight: LINE_HEIGHT.sm + 2,
  },

  date: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.muted,
  },

  amount: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md,
  },
});
