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
        <AppText variant="heading" color="primary" style={styles.title}>
          {title}
        </AppText>

        {description && (
          <AppText variant="caption" color="secondary" style={styles.description}>
            {description}
          </AppText>
        )}

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={buttonTitle}
        >
          <AppText variant="button" color="inverse">
            {buttonTitle}
          </AppText>
        </Pressable>
      </View>

      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 190,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: COLORS.orange.light,
    borderRadius: RADIUS.xl,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingRight: SPACING.sm,
  },

  title: {
    fontSize: 20,
    lineHeight: 25,
  },

  description: {
    marginTop: SPACING.sm,
  },

  button: {
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.md,
  },

  image: {
    width: '45%',
    height: '100%',
  },

  pressed: {
    opacity: 0.85,
  },
});
