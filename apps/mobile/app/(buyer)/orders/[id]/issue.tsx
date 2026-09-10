import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { OrderIssueForm } from '@/components/order/OrderIssueForm';
import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';

import { HELP_TOPICS } from '@/features/orders/orders.constants';
import { useOrders } from '@/hooks/useOrders';

import { COLORS, RADIUS, SIZES, SPACING } from '@/theme';

export default function OrderIssueDetailsScreen() {
  const { id: orderId, issueId } = useLocalSearchParams<{
    id: string;
    issueId: string;
  }>();

  const { data: orders = [], isLoading, isError } = useOrders();

  const order = orders.find(({ id }) => id === orderId);
  const issue = HELP_TOPICS.find(({ id }) => id === issueId);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={COLORS.orange.normal} />
      </View>
    );
  }

  if (isError || !order || !issue) {
    return (
      <View style={styles.centered}>
        <AppText variant="bodyMedium" color="primary" style={styles.errorTitle}>
          Unable to load order
        </AppText>

        <AppText
          variant="caption"
          color="inverse"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Go Back
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Issue Details"
        variant="orange"
        compact
        onBackPress={() => router.back()}
      />

      <OrderIssueForm
        order={order}
        issue={issue}
        onChangeIssue={() => router.back()}
        onSubmit={(details) => {
          // Backend integration will be connected here later.
          console.log(details);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },

  errorTitle: {
    marginBottom: SPACING.md,
  },

  backButton: {
    minHeight: SIZES.smallButtonHeight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange.normal,
  },
});
