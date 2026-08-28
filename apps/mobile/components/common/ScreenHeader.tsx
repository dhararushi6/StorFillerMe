import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';

import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING, useResponsive } from '@/theme';

interface ScreenHeaderProps {
  title: string;
  fallbackRoute?: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;

  variant?: 'default' | 'orange';

  bottomContent?: React.ReactNode;

  compact?: boolean;
}

export function ScreenHeader({
  title,
  fallbackRoute,
  onBackPress,
  rightElement,
  variant = 'default',
  bottomContent,
  compact = false,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { horizontalPadding } = useResponsive();

  const isOrange = variant === 'orange';

  const handleBack = useCallback(() => {
    if (onBackPress !== undefined) {
      onBackPress();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    if (fallbackRoute !== undefined) {
      router.replace(fallbackRoute as Parameters<typeof router.replace>[0]);
      return;
    }

    router.replace('/(buyer)/home');
  }, [fallbackRoute, navigation, onBackPress]);

  return (
    <View
      style={[
        styles.header,
        isOrange && styles.orangeHeader,
        compact && styles.compactHeader,
        {
          paddingHorizontal: horizontalPadding,
          paddingTop: Math.max(insets.top, SPACING.md) + SPACING.sm,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            style={styles.backButton}
          >
            <AppIcon name="back" size="lg" color={isOrange ? COLORS.white : COLORS.text.primary} />
          </Pressable>

          <AppText
            variant="bodyMedium"
            color={isOrange ? 'inverse' : 'primary'}
            style={[styles.title, isOrange && styles.orangeTitle]}
          >
            {title}
          </AppText>
        </View>

        {rightElement !== undefined && <View style={styles.rightGroup}>{rightElement}</View>}
      </View>

      {bottomContent !== undefined && <View style={styles.bottomContent}>{bottomContent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: SIZES.headerLargeHeight,
    backgroundColor: COLORS.header,
    borderBottomLeftRadius: RADIUS.header,
    borderBottomRightRadius: RADIUS.header,
    paddingBottom: SPACING.lg,
  },

  orangeHeader: {
    backgroundColor: COLORS.orange.normal,
  },

  compactHeader: {
    minHeight: SIZES.headerHeight + SPACING.md,
    paddingBottom: SPACING.sm,
  },

  topRow: {
    minHeight: SIZES.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  backButton: {
    width: SIZES.iconLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md,
  },

  orangeTitle: {
    fontFamily: FONT_FAMILY.medium,
  },

  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomContent: {
    marginTop: SPACING.sm,
  },
});
