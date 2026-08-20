import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, SPACING, useResponsive } from '@/theme';

interface CartDeliveryHeaderProps {
  title: string;
  highlight: string;
  address: string;
  onBackPress?: () => void;
  onSearchPress?: () => void;
}

export function CartDeliveryHeader({
  title,
  highlight,
  address,
  onBackPress,
  onSearchPress,
}: CartDeliveryHeaderProps) {
  const insets = useSafeAreaInsets();
  const { cart, horizontalPadding } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, SPACING.md) + cart.headerPaddingTop,
          paddingHorizontal: horizontalPadding,
          borderBottomLeftRadius: cart.headerBottomRadius,
          borderBottomRightRadius: cart.headerBottomRadius,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={onBackPress}
          style={styles.iconButton}
        >
          <AppIcon name="back" size="md" color={COLORS.text.primary} />
        </Pressable>

        <View style={styles.titleContainer}>
          <AppText variant="subheading" color="primary" style={styles.titleText}>
            {title}{' '}
            <AppText variant="subheading" style={styles.highlightText}>
              {highlight}
            </AppText>
          </AppText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search"
          hitSlop={8}
          onPress={onSearchPress}
          style={styles.iconButton}
        >
          <AppIcon name="search" size="md" color={COLORS.text.primary} />
        </Pressable>
      </View>

      <View style={styles.addressContainer}>
        <AppText variant="caption" color="primary" numberOfLines={2} style={styles.addressText}>
          {address}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.header,
    paddingBottom: SPACING.lg,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconButton: {
    padding: SPACING.xs,
  },

  titleContainer: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
  },

  titleText: {
    fontFamily: FONT_FAMILY.bold,
  },

  highlightText: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.orange.normal,
  },

  addressContainer: {
    marginTop: SPACING.sm,
    paddingRight: SPACING.xl,
  },

  addressText: {
    lineHeight: 16,
  },
});
