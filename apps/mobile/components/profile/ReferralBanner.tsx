import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING } from '@/theme';

interface ReferralBannerProps {
  image: number;
  onPress?: () => void;
}

export function ReferralBanner({ image, onPress }: ReferralBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppText variant="caption" color="primary" style={styles.title}>
          Refer & Earn Rewards
        </AppText>

        <AppText variant="caption" color="primary" style={styles.description}>
          Invite your friends and earn exciting
          {'\n'}
          rewards on every successful referral.
        </AppText>

        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <AppText variant="caption" color="inverse" style={styles.buttonText}>
            Refer Now
          </AppText>

          <AppIcon name="chevronRight" size="sm" color={COLORS.white} />
        </Pressable>
      </View>

      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 90,
    borderRadius: RADIUS.xl,
    backgroundColor: '#FFF8EB',
    overflow: 'hidden',
    flexDirection: 'row',
  },

  content: {
    flex: 1,
    padding: SPACING.md,
  },

  title: {
    color: COLORS.orange.normal,
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
  },

  description: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
  },

  button: {
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
    minHeight: SIZES.compactButtonHeight,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.orange.normal,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  buttonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
  },

  image: {
    width: 160,
    height: 125,
    alignSelf: 'center',
    marginRight: SPACING.md,
  },

  pressed: {
    opacity: 0.7,
  },
});
