import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface PopularProductCardProps {
  name: string;
  image: number;
  onPress?: () => void;
}

export function PopularProductCard({ name, image, onPress }: PopularProductCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <Image source={image} style={styles.image} resizeMode="contain" />

      <AppText variant="caption" color="primary" numberOfLines={2} style={styles.name}>
        {name}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 108,
    minHeight: 126,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
  },

  image: {
    width: 72,
    height: 72,
  },

  name: {
    marginTop: SPACING.sm,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.85,
  },
});
