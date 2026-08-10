import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import cartIcon from '@/assets/icons/cart.png';
import walletIcon from '@/assets/icons/wallet.png';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SIZES, SPACING } from '@/theme';

interface HomeHeaderProps {
  location?: string;
  walletBalance?: number;
  onLocationPress?: () => void;
  onWalletPress?: () => void;
  onCartPress?: () => void;
}

export function HomeHeader({
  location = 'Kolar, Karnataka',
  walletBalance = 500,
  onLocationPress,
  onWalletPress,
  onCartPress,
}: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.locationButton}
          onPress={onLocationPress}
          accessibilityRole="button"
          accessibilityLabel={`Delivery location: ${location}`}
          hitSlop={8}
        >
          <AppText variant="caption" color="inverse">
            {location}
          </AppText>

          <AppIcon name="chevronDown" size="sm" color={COLORS.text.inverse} />
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            style={styles.walletButton}
            onPress={onWalletPress}
            accessibilityRole="button"
            accessibilityLabel="Wallet"
            hitSlop={8}
          >
            <Image source={walletIcon} style={styles.walletIcon} resizeMode="contain" />

            <AppText variant="caption" color="inverse">
              ₹{walletBalance}
            </AppText>
          </Pressable>

          <Pressable
            onPress={onCartPress}
            accessibilityRole="button"
            accessibilityLabel="Cart"
            hitSlop={8}
          >
            <Image source={cartIcon} style={styles.cartIcon} resizeMode="contain" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.orange.normal,
  },

  topRow: {
    minHeight: SIZES.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  walletButton: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.text.inverse,
    borderRadius: RADIUS.sm,
  },

  walletIcon: {
    width: 16,
    height: 16,
  },

  cartIcon: {
    width: 24,
    height: 24,
  },
});
