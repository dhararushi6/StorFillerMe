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
}

export function ScreenHeader({ title, fallbackRoute, onBackPress }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { horizontalPadding } = useResponsive();

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
    } else {
      router.replace('/(buyer)/home');
    }
  }, [fallbackRoute, navigation, onBackPress]);

  return (
    <View
      style={[
        styles.header,
        {
          paddingHorizontal: horizontalPadding,
          paddingTop: Math.max(insets.top, SPACING.md) + SPACING.sm,
        },
      ]}
    >
      <Pressable
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
      >
        <AppIcon name="back" size="lg" color={COLORS.text.primary} />
      </Pressable>

      <AppText variant="bodyMedium" color="primary" style={styles.title}>
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: SIZES.headerLargeHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.header,
    borderBottomLeftRadius: RADIUS.header,
    borderBottomRightRadius: RADIUS.header,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.lg,
  },
});
