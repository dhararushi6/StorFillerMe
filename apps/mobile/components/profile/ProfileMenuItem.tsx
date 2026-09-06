import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, RADIUS, SIZES, SPACING } from '@/theme';

interface ProfileMenuItemProps {
  icon: number;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function ProfileMenuItem({ icon, title, subtitle, onPress }: ProfileMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <AppText variant="bodyMedium" color="primary" style={styles.title}>
          {title}
        </AppText>

        <AppText variant="caption" color="primary" style={styles.subtitle}>
          {subtitle}
        </AppText>
      </View>

      <AppIcon name="chevronRight" size="md" color={COLORS.text.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: SIZES.iconLarge,
    height: SIZES.iconLarge,
  },

  content: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
  },

  subtitle: {
    marginTop: 1,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.xs,
  },

  pressed: {
    opacity: 0.7,
  },
});
