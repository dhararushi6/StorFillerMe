import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';

import { COLORS, FONT_FAMILY, FONT_SIZE, SIZES, SPACING } from '@/theme';

interface OrderBillProps {
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  totalAmount: number;
}

export function OrderBill({ itemTotal, deliveryFee, handlingFee, totalAmount }: OrderBillProps) {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <View style={styles.row}>
        <AppText variant="bodyMedium" color="primary" style={styles.label}>
          Items total
        </AppText>

        <AppText variant="bodyMedium" color="primary" style={styles.value}>
          ₹ {itemTotal}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText variant="bodyMedium" color="primary" style={styles.label}>
          Delivery Fee
        </AppText>

        <AppText variant="bodyMedium" color="primary" style={styles.value}>
          {deliveryFee === 0 ? 'FREE' : `₹ ${deliveryFee}`}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText variant="bodyMedium" color="primary" style={styles.label}>
          Handling Fee
        </AppText>

        <AppText variant="bodyMedium" color="primary" style={styles.value}>
          ₹ {handlingFee}
        </AppText>
      </View>

      {/* Divider before total */}
      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <AppText variant="bodyMedium" color="primary" style={styles.totalLabel}>
          Total Amount
        </AppText>

        <AppText variant="bodyMedium" color="primary" style={styles.totalAmount}>
          ₹ {totalAmount}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },

  label: {
    fontSize: FONT_SIZE.sm,
  },

  value: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
  },

  divider: {
    height: SIZES.borderThin,
    backgroundColor: COLORS.orange.card,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },

  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
  },

  totalAmount: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
  },
});
