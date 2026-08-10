import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SIZES, SPACING } from '@/theme';

interface CategoryCardProps {
  title: string;
  image: number;
  onPress?: () => void;
}

export function CategoryCard({ title, image, onPress }: CategoryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title.replace('\n', ' ')}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>

      <AppText variant="caption" color="primary" style={styles.title}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 96,
    minHeight: 118,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },

  imageContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: SIZES.avatarLarge,
    height: SIZES.avatarLarge,
  },

  title: {
    marginTop: SPACING.xs,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.85,
  },
});
