import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface PromoBannerProps {
  title: string;
  description?: string;
  image: number;
  buttonTitle: string;
  onPress?: () => void;
}

export function PromoBanner({ title, description, image, buttonTitle, onPress }: PromoBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppText variant="subheading" style={styles.title}>
          {title}
        </AppText>

        {description && (
          <AppText variant="caption" style={styles.description}>
            {description}
          </AppText>
        )}
      </View>

      <Image source={image} resizeMode="contain" style={styles.image} />

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={buttonTitle}
      >
        <AppText variant="button" color="inverse">
          {buttonTitle}
        </AppText>

        <AppText variant="button" color="inverse" style={styles.arrow}>
          →
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 279,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.orange.banner,
    borderRadius: RADIUS.xl,
    marginTop: SPACING.lg,
  },

  content: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 2,
  },

  title: {
    maxWidth: '85%',
    color: COLORS.orange.promoText,
    fontSize: 20,
    lineHeight: 30,
  },

  description: {
    marginTop: SPACING.sm,
    maxWidth: '90%',
    color: COLORS.orange.darker,
  },

  image: {
    position: 'absolute',
    width: '100%',
    height: '65%',
    left: '0%',
    bottom: '3%',
    zIndex: 1,
  },

  button: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SPACING.sm,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,

    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.lg,

    zIndex: 3,
  },

  arrow: {
    marginLeft: SPACING.xs,
  },

  pressed: {
    opacity: 0.85,
  },
});
