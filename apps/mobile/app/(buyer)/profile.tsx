import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ProfileMenuItem } from '@/components/profile/ProfileMenuItem';
import { ProfileQuickAction } from '@/components/profile/ProfileQuickAction';
import { ReferralBanner } from '@/components/profile/ReferralBanner';

import {
  PROFILE_ACCOUNT_ITEMS,
  PROFILE_MENU_ITEMS,
  PROFILE_QUICK_ACTIONS,
  PROFILE_REFER_ICON,
} from '@/features/profile/profile.constants';

import { useProfile } from '@/hooks/useProfile';

import { COLORS, FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING, useResponsive } from '@/theme';

export default function ProfileScreen() {
  const { horizontalPadding } = useResponsive();

  const { data: profile, isLoading, isError } = useProfile();

  const handleOrdersPress = useCallback(() => {
    router.push('/(buyer)/orders');
  }, []);

  const handleWalletPress = useCallback(() => {
    router.push('/(buyer)/wallet');
  }, []);

  const handleEditPress = useCallback(() => {
    // TODO: Navigate to profile edit screen
  }, []);

  const handleMenuPress = useCallback((item: { id: string; title: string; route?: string }) => {
    if (item.id === 'shop-photos') {
      router.push('/(buyer)/ShopPhotoScreen');
      return;
    }

    if (!item.route) {
      return;
    }
    router.push(item.route as never);
  }, []);

  // Generate promo code: first 4 letters of name + "100"
  const handleReferralPress = useCallback(() => {
    const namePrefix = profile?.name ? profile.name.slice(0, 4).toUpperCase() : 'USER';
    const promoCode = `${namePrefix}100`;

    router.push({
      pathname: '/(buyer)/ReferEarnScreen',
      params: { referralCode: promoCode },
    });
  }, [profile]);

  const handleAccountItemPress = useCallback((id: string) => {
    if (id === 'logout') {
      // TODO: Connect to auth logout flow.
      return;
    }

    if (id === 'settings') {
      router.push('/(buyer)/accountsettings');
    }
  }, []);

  /*
   * Keep loading/error states lightweight for now.
   * These can later be replaced by the project's shared
   * LoadingState / ErrorState components.
   */
  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.loadingCard} />
        <View style={styles.loadingCard} />
        <View style={styles.loadingCard} />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View style={styles.stateContainer}>
        <AppText variant="bodyMedium" color="secondary">
          Unable to load your profile.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}

        <ScreenHeader
          title="Profile"
          variant="orange"
          rightElement={
            <Pressable
              onPress={handleEditPress}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              hitSlop={8}
            >
              <AppText variant="caption" color="inverse" style={styles.editText}>
                Edit
              </AppText>
            </Pressable>
          }
          bottomContent={
            <View style={styles.userInfo}>
              <AppText variant="subheading" color="inverse" style={styles.userName}>
                {profile.name}
              </AppText>

              <AppText variant="caption" color="inverse" style={styles.phone}>
                {profile.phone}
              </AppText>
            </View>
          }
        />

        {/* Orders / Wallet */}

        <View style={[styles.quickActions, { paddingHorizontal: horizontalPadding }]}>
          <ProfileQuickAction
            icon={PROFILE_QUICK_ACTIONS.orders.icon}
            title={PROFILE_QUICK_ACTIONS.orders.title}
            onPress={handleOrdersPress}
          />

          <ProfileQuickAction
            icon={PROFILE_QUICK_ACTIONS.wallet.icon}
            title={PROFILE_QUICK_ACTIONS.wallet.title}
            value={String(profile.walletBalance)}
            onPress={handleWalletPress}
          />
        </View>

        {/* Main profile menu */}

        <View style={[styles.menuSection, { paddingHorizontal: horizontalPadding }]}>
          {PROFILE_MENU_ITEMS.map((item) => (
            <ProfileMenuItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => handleMenuPress(item)}
            />
          ))}
        </View>

        {/* Refer & Earn */}

        <View style={[styles.referralSection, { paddingHorizontal: horizontalPadding }]}>
          <ReferralBanner image={PROFILE_REFER_ICON} onPress={handleReferralPress} />
        </View>

        {/* Account */}

        <View style={[styles.accountSection, { paddingHorizontal: horizontalPadding }]}>
          {PROFILE_ACCOUNT_ITEMS.map((item) => (
            <ProfileMenuItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => handleAccountItemPress(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xxxl,
  },

  userInfo: {
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
  },

  userName: {
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },

  phone: {
    marginTop: SPACING.xs,
  },

  editText: {
    fontSize: FONT_SIZE.sm,
  },

  quickActions: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginTop: SPACING.lg,
  },

  menuSection: {
    marginTop: SPACING.md,
  },

  referralSection: {
    marginTop: SPACING.md,
  },

  accountSection: {
    marginTop: SPACING.sm,
  },

  stateContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },

  loadingCard: {
    width: '100%',
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
  },
});
