import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, SPACING, useResponsive } from '@/theme';

interface WalletNoteProps {
  title: string;
  points: readonly string[];
  termsLabel: string;
  onTermsPress?: () => void;
}

export function WalletNote({ title, points, termsLabel, onTermsPress }: WalletNoteProps) {
  const { horizontalPadding } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: -horizontalPadding,
          paddingHorizontal: horizontalPadding,
        },
      ]}
    >
      <AppText variant="bodyMedium" color="primary" style={styles.title}>
        {title}
      </AppText>

      <View style={styles.divider} />

      <View style={styles.points}>
        {points.map((point) => (
          <View key={point} style={styles.pointRow}>
            <AppText variant="caption" color="primary" style={styles.bullet}>
              •
            </AppText>

            <AppText variant="caption" color="primary" style={styles.pointText}>
              {point}
            </AppText>
          </View>
        ))}
      </View>

      <Pressable
        onPress={onTermsPress}
        accessibilityRole="link"
        accessibilityLabel={termsLabel}
        hitSlop={8}
        style={styles.terms}
      >
        <AppText variant="caption" color="primary" style={styles.termsLabel}>
          {termsLabel}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
  },

  title: {
    fontFamily: FONT_FAMILY.semiBold,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  points: {
    gap: SPACING.xs,
  },

  pointRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingLeft: SPACING.xs,
  },

  bullet: {
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.md,
  },

  pointText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.md,
  },

  terms: {
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
  },

  termsLabel: {
    fontSize: FONT_SIZE.sm,
    textDecorationLine: 'underline',
  },
});
