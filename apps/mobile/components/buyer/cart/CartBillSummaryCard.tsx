import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from '@/theme';

interface CartBillSummaryCardProps {
  title: string;
  itemsTotalLabel: string;
  itemsTotal: number;
  deliveryFeeLabel: string;
  deliveryFee: number;
  handlingFeeLabel: string;
  handlingFee: number;
  totalAmountLabel: string;
  totalAmount: number;
  savingsText: string;
  cancellationTitle: string;
  cancellationDescription: string;
}

export function CartBillSummaryCard({
  title,
  itemsTotalLabel,
  itemsTotal,
  deliveryFeeLabel,
  deliveryFee,
  handlingFeeLabel,
  handlingFee,
  totalAmountLabel,
  totalAmount,
  savingsText,
  cancellationTitle,
  cancellationDescription,
}: CartBillSummaryCardProps) {
  return (
    <View style={styles.wrapper}>
      {/* Bill Details Box */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <AppText variant="bodyMedium" color="primary" style={styles.cardHeaderTitle}>
            {title}
          </AppText>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.row}>
            <AppText variant="body" color="primary" style={styles.rowLabel}>
              {itemsTotalLabel}
            </AppText>
            <AppText variant="bodyMedium" color="primary" style={styles.rowValue}>
              ₹ {itemsTotal}
            </AppText>
          </View>

          <View style={styles.row}>
            <View style={styles.dottedLabelContainer}>
              <AppText variant="body" color="primary" style={styles.rowLabel}>
                {deliveryFeeLabel}
              </AppText>
            </View>
            <AppText variant="bodyMedium" color="primary" style={styles.rowValue}>
              ₹ {deliveryFee}
            </AppText>
          </View>

          <View style={styles.row}>
            <View style={styles.dottedLabelContainer}>
              <AppText variant="body" color="primary" style={styles.rowLabel}>
                {handlingFeeLabel}
              </AppText>
            </View>
            <AppText variant="bodyMedium" color="primary" style={styles.rowValue}>
              ₹ {handlingFee}
            </AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <AppText variant="bodyMedium" color="primary" style={styles.totalLabel}>
              {totalAmountLabel}
            </AppText>
            <AppText variant="subheading" color="primary" style={styles.totalValue}>
              ₹ {totalAmount}
            </AppText>
          </View>
        </View>
      </View>

      {/* Savings callout banner */}
      <View style={styles.savingsBanner}>
        <AppText variant="caption" style={styles.savingsText}>
          {savingsText}
        </AppText>
      </View>

      {/* Cancellation policy card */}
      <View style={styles.cancellationCard}>
        <AppText variant="bodyMedium" color="primary" style={styles.cancellationTitle}>
          {cancellationTitle}
        </AppText>
        <AppText variant="caption" color="primary" style={styles.cancellationDescription}>
          {cancellationDescription}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: SPACING.sm,
    gap: SPACING.md,
  },

  cardContainer: {
    borderWidth: 1,
    borderColor: COLORS.orange.normal,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },

  cardHeader: {
    backgroundColor: COLORS.cart.billHeader,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.orange.normal,
  },

  cardHeaderTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.black,
  },

  cardBody: {
    backgroundColor: COLORS.cart.billCalculation,
    padding: SPACING.lg,
    gap: SPACING.md,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLabel: {
    textTransform: 'capitalize',
  },

  dottedLabelContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.text.secondary,
    borderStyle: 'dashed',
  },

  rowValue: {
    fontFamily: FONT_FAMILY.medium,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.text.muted,
    marginVertical: SPACING.xs / 2,
  },

  totalLabel: {
    fontFamily: FONT_FAMILY.bold,
  },

  totalValue: {
    fontFamily: FONT_FAMILY.bold,
  },

  savingsBanner: {
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  savingsText: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.success,
  },

  cancellationCard: {
    backgroundColor: COLORS.cart.cancellation,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.xs,
  },

  cancellationTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.category,
    color: COLORS.black,
  },

  cancellationDescription: {
    lineHeight: 16,
  },
});
