import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING, useResponsive } from '@/theme';

interface CategoryCardProps {
  title: string;
  image: number;
  onPress?: () => void;
}

export function CategoryCard({ title, image, onPress }: CategoryCardProps) {
  const { home } = useResponsive();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          width: home.categoryCardWidth,
          height: home.categoryCardHeight,
        },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title.replace('\n', ' ')}
    >
      <AppText variant="category" color="primary" numberOfLines={2} style={styles.title}>
        {title}
      </AppText>

      <Image
        source={image}
        style={{
          width: home.categoryImageSize,
          height: home.categoryImageSize,
        }}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.orange.light,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },

  title: {
    alignSelf: 'stretch',
    textAlign: 'left',
  },

  pressed: {
    opacity: 0.85,
  },
});
