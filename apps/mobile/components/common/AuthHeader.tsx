import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import backArrow from '@/assets/icons/Arrow 7.png';
import { AppIcon } from '@/components/common/AppIcon';
import { COLORS, RADIUS, SIZES, SPACING } from '@/theme';

interface AuthHeaderProps {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  onClose: () => void;
}

export function AuthHeader({ currentStep, totalSteps = 4, onBack, onClose }: AuthHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.actionButton} hitSlop={SPACING.sm}>
          <Image source={backArrow} style={styles.backArrow} />
        </Pressable>

        <View style={styles.progressContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progress,
                index === currentStep - 1 ? styles.activeProgress : styles.inactiveProgress,
              ]}
            />
          ))}
        </View>

        <Pressable onPress={onClose} style={styles.actionButton} hitSlop={SPACING.sm}>
          <AppIcon name="close" size="lg" color={COLORS.text.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },

  header: {
    height: SIZES.headerCompactHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  actionButton: {
    width: SIZES.backButton,
    height: SIZES.backButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    width: SIZES.authBackArrowWidth,
    height: SIZES.authBackArrowHeight,
    resizeMode: 'contain',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  progress: {
    width: SIZES.authProgressWidth,
    height: SIZES.authProgressHeight,
    borderRadius: RADIUS.sm,
  },

  activeProgress: {
    backgroundColor: COLORS.orange.normal,
  },

  inactiveProgress: {
    backgroundColor: COLORS.border,
  },
});
