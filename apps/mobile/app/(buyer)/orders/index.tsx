import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppText } from '@/components/common/AppText';
import { OrderCard } from '@/components/order/OrderCard';

import { useOrders } from '@/hooks/useOrders';

import { COLORS, FONT_FAMILY, SPACING } from '@/theme';

export default function OrdersScreen() {
  const router = useRouter();

  const { data: orders = [], isLoading, isError, refetch } = useOrders();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={COLORS.orange.normal} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <AppText variant="bodyMedium" color="primary" style={styles.errorText}>
          Unable to load your orders.
        </AppText>

        <AppText
          variant="caption"
          color="secondary"
          onPress={() => refetch()}
          style={styles.retryText}
        >
          Try again
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Order" variant="orange" />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() =>
              router.push({
                pathname: '/(buyer)/orders/[id]',
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText variant="bodyMedium" color="primary" style={styles.emptyTitle}>
              No orders yet
            </AppText>

            <AppText variant="caption" color="secondary">
              Your orders will appear here.
            </AppText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },

  errorText: {
    fontFamily: FONT_FAMILY.medium,
    textAlign: 'center',
  },

  retryText: {
    marginTop: SPACING.sm,
    textDecorationLine: 'underline',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl,
  },

  emptyTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    marginBottom: SPACING.xs,
  },
});
