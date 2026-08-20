import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import cartIcon from '@/assets/icons/cart.png';
import { HomeSearchBar } from '@/components/buyer/home';
import { COLORS, RADIUS, SPACING, useResponsive } from '@/theme';

interface ProductTopBarProps {
  searchQuery: string;
  onSearchQueryChange: (text: string) => void;
  onSearchSubmit?: () => void;
  onMicPress?: () => void;
  onCartPress?: () => void;
}

export function ProductTopBar({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  onMicPress,
  onCartPress,
}: ProductTopBarProps) {
  const insets = useSafeAreaInsets();
  const { horizontalPadding, isTablet, product } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: horizontalPadding,
          paddingTop: insets.top + SPACING.sm,
        },
      ]}
    >
      <View style={[styles.searchSlot, { borderRadius: isTablet ? RADIUS.lg : RADIUS.md }]}>
        <HomeSearchBar
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          onPress={onSearchSubmit}
          onMicPress={onMicPress}
        />
      </View>

      <Pressable
        style={styles.cartButton}
        onPress={onCartPress}
        accessibilityRole="button"
        accessibilityLabel="Cart"
        hitSlop={8}
      >
        <Image
          source={cartIcon}
          style={{
            width: product.cartIconSize,
            height: product.cartIconSize,
            tintColor: COLORS.text.primary,
          }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: 'transparent',
  },

  searchSlot: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cartButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
