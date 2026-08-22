import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from '@/theme';
import homeIcon from '@/assets/icons/home.png';
import categoriesIcon from '@/assets/icons/categories.png';
import profileIcon from '@/assets/icons/profile.png';

interface BuyerBottomBarProps {
  activeTab: 'home' | 'categories' | 'profile';
  onHomePress?: () => void;
  onCategoriesPress?: () => void;
  onProfilePress?: () => void;
}

interface TabItemProps {
  label: string;
  icon: ImageSourcePropType;
  active: boolean;
  onPress?: () => void;
}

function TabItem({ label, icon, active, onPress }: TabItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Image source={icon} style={styles.icon} resizeMode="contain" />

      <AppText
        variant="caption"
        color="primary"
        style={[styles.label, active && styles.activeLabel]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export function BuyerBottomBar({
  activeTab,
  onHomePress,
  onCategoriesPress,
  onProfilePress,
}: BuyerBottomBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TabItem label="Home" icon={homeIcon} active={activeTab === 'home'} onPress={onHomePress} />

        <TabItem
          label="Categories"
          icon={categoriesIcon}
          active={activeTab === 'categories'}
          onPress={onCategoriesPress}
        />

        <TabItem
          label="Profile"
          icon={profileIcon}
          active={activeTab === 'profile'}
          onPress={onProfilePress}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: 'transparent',
  },

  container: {
    minHeight: SPACING.huge + SPACING.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.orange.bottomBar,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
  },

  tab: {
    flex: 1,
    minHeight: SPACING.huge + SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    borderRadius: RADIUS.pill,
  },

  icon: {
    width: SPACING.xl,
    height: SPACING.xl,
  },

  label: {
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    fontWeight: '500',
    color: COLORS.text.primary,
  },

  activeLabel: {
    color: COLORS.orange.normal,
  },

  pressed: {
    opacity: 0.75,
  },
});
