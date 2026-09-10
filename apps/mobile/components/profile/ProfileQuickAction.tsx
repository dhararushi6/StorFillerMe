import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING } from '@/theme';

interface ProfileQuickActionProps {
  icon: number;
  title: string;
  value?: string;
  onPress?: () => void;
}

export function ProfileQuickAction({ icon, title, value, onPress }: ProfileQuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>

      <View style={styles.textContainer}>
        <AppText variant="bodyMedium" color="primary" style={styles.title}>
          {title}
        </AppText>

        {value !== undefined && (
          <AppText variant="caption" color="primary" style={styles.value}>
            {value}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 86,
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: SIZES.iconLarge,
    height: SIZES.iconLarge,
  },

  textContainer: {
    marginLeft: SPACING.md,
  },

  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
  },

  value: {
    color: COLORS.orange.normal,
    marginTop: 1,
  },

  pressed: {
    opacity: 0.7,
  },
});
