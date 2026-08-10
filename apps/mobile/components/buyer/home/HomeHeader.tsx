import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import cartIcon from '@/assets/icons/cart.png';
import walletIcon from '@/assets/icons/wallet.png';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SIZES, SPACING, useResponsive } from '@/theme';

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
  const insets = useSafeAreaInsets();
  const { horizontalPadding, home } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: horizontalPadding,
          paddingTop: insets.top + SPACING.sm,
          paddingBottom: home.headerBottomSpacing,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Pressable
          style={styles.locationButton}
          onPress={onLocationPress}
          accessibilityRole="button"
          accessibilityLabel={`Delivery location: ${location}`}
          hitSlop={8}
        >
          <AppText
            variant="body"
            color="inverseSecondary"
            numberOfLines={1}
            style={{
              fontSize: home.locationFontSize,
            }}
          >
            {location}
          </AppText>

          <AppIcon name="chevronDown" size="md" color={COLORS.text.inverse} />
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            style={[
              styles.walletButton,
              {
                minHeight: home.walletHeight,
                paddingHorizontal: home.walletHorizontalPadding,
              },
            ]}
            onPress={onWalletPress}
            accessibilityRole="button"
            accessibilityLabel={`Wallet balance ₹${walletBalance}`}
            hitSlop={8}
          >
            <Image
              source={walletIcon}
              style={[
                styles.walletIcon,
                {
                  width: home.walletIconSize,
                  height: home.walletIconSize,
                },
              ]}
              resizeMode="contain"
            />

            <AppText variant="caption" color="inverse">
              ₹{walletBalance}
            </AppText>
          </Pressable>

          <Pressable
            style={styles.cartButton}
            onPress={onCartPress}
            accessibilityRole="button"
            accessibilityLabel="Cart"
            hitSlop={8}
          >
            <Image
              source={cartIcon}
              style={[
                styles.cartIcon,
                {
                  width: home.cartIconSize,
                  height: home.cartIconSize,
                },
              ]}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.orange.normal,
  },

  topRow: {
    minHeight: SIZES.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginRight: SPACING.md,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.text.inverse,
    borderRadius: RADIUS.sm,
  },

  walletIcon: {
    resizeMode: 'contain',
  },

  cartButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartIcon: {
    resizeMode: 'contain',
  },
});
