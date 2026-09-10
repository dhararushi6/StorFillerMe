import React, { useCallback, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';

import sealPercentIcon from '@/assets/icons/seal-percent.png';
import { CouponCard } from '@/components/buyer/coupon';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AVAILABLE_COUPONS, type Coupon, COUPON_SCREEN } from '@/constants/coupon';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
  useResponsive,
} from '@/theme';

export default function ApplyCouponScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { horizontalPadding } = useResponsive();
  const [couponCode, setCouponCode] = useState('');
  const [coupons] = useState<Coupon[]>(AVAILABLE_COUPONS);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    router.replace('/(buyer)/cart');
  }, [navigation]);

  const handleApply = useCallback(
    (codeToApply?: string) => {
      const code = (codeToApply ?? couponCode).trim();
      if (!code) return;
      // Coupon validation logic will be connected to API.
    },
    [couponCode],
  );

  const handleTermsPress = useCallback((_coupon: Coupon) => {
    router.push('/(buyer)/terms-and-conditions');
  }, []);

  const hasCoupons = coupons.length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      {/* Top Header with Curved Bottom and Coupon Input */}
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: Math.max(insets.top, SPACING.md) + SPACING.sm,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        {/* Navigation Row */}
        <View style={styles.navRow}>
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <AppIcon name="back" size="lg" color={COLORS.text.primary} />
          </Pressable>

          <AppText variant="bodyMedium" color="primary" style={styles.headerTitle}>
            {COUPON_SCREEN.title}
          </AppText>
        </View>

        {/* Coupon Code Input Card */}
        <View style={styles.inputCard}>
          <TextInput
            value={couponCode}
            onChangeText={setCouponCode}
            placeholder={COUPON_SCREEN.inputPlaceholder}
            placeholderTextColor={COLORS.text.muted}
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.textInput}
          />

          <Pressable
            onPress={() => handleApply()}
            accessibilityRole="button"
            accessibilityLabel={COUPON_SCREEN.applyButton}
            hitSlop={8}
            style={({ pressed }) => [pressed && styles.buttonPressed]}
          >
            <AppText variant="bodyMedium" color="primary" style={styles.applyText}>
              {COUPON_SCREEN.applyButton}
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* Main Content: Coupons List or Empty State */}
      {hasCoupons ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: insets.bottom + SPACING.xxl,
            },
          ]}
        >
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onApply={handleApply}
              onTermsPress={handleTermsPress}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.emptyStateContainer, { paddingHorizontal: horizontalPadding }]}>
          <Image source={sealPercentIcon} style={styles.emptyIcon} resizeMode="contain" />

          <AppText variant="subheading" color="primary" style={styles.emptyTitle}>
            {COUPON_SCREEN.emptyTitle}
          </AppText>

          <AppText variant="caption" color="secondary" style={styles.emptySubtitle}>
            {COUPON_SCREEN.emptySubtitle}
          </AppText>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headerContainer: {
    backgroundColor: COLORS.header,
    borderBottomLeftRadius: RADIUS.header,
    borderBottomRightRadius: RADIUS.header,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  headerTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.lg,
  },

  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.coupon.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },

  textInput: {
    flex: 1,
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
    paddingVertical: 0,
    marginRight: SPACING.sm,
  },

  applyText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  listContent: {
    paddingTop: SPACING.lg,
  },

  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.section,
  },

  emptyIcon: {
    width: 72,
    height: 72,
  },

  emptyTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.lg,
    marginTop: SPACING.lg,
  },

  emptySubtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
