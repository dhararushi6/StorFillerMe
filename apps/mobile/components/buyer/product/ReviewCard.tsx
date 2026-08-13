import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING, useResponsive } from '@/theme';
import { ICONS } from '@/constants/icons';

import { RatingStars } from './RatingStars';

interface ReviewCardProps {
  author: string;
  rating: number;
  comment: string;
  photo?: number;
  date: string;
  onMorePress?: () => void;
  onHelpfulPress?: () => void;
  onNotHelpfulPress?: () => void;
}

export function ReviewCard({
  author,
  rating,
  comment,
  photo,
  date,
  onMorePress,
  onHelpfulPress,
  onNotHelpfulPress,
}: ReviewCardProps) {
  const { product } = useResponsive();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText variant="bodyMedium" color="primary">
          {author}
        </AppText>

        <Pressable
          onPress={onMorePress}
          accessibilityRole="button"
          accessibilityLabel={`More options for ${author}'s review`}
          hitSlop={8}
        >
          <AppIcon name="more" size="md" color={COLORS.text.secondary} />
        </Pressable>
      </View>

      <View style={styles.stars}>
        <RatingStars rating={rating} size={product.starSize} />
      </View>

      <AppText variant="body" color="primary" style={styles.comment}>
        {comment}
      </AppText>

      {photo !== undefined && (
        <Image
          source={photo}
          style={[
            styles.photo,
            {
              width: product.reviewPhotoSize,
              height: product.reviewPhotoSize,
            },
          ]}
          resizeMode="cover"
        />
      )}

      <View style={styles.footerRow}>
        <AppText variant="caption" color="muted">
          {date}
        </AppText>

        <View style={styles.feedbackActions}>
          <Pressable
            onPress={onHelpfulPress}
            accessibilityRole="button"
            accessibilityLabel="Mark review as helpful"
            hitSlop={8}
          >
            <Ionicons
              name={ICONS.thumbsUp as React.ComponentProps<typeof Ionicons>['name']}
              size={product.reviewActionSize}
              color={COLORS.orange.normal}
            />
          </Pressable>

          <Pressable
            onPress={onNotHelpfulPress}
            accessibilityRole="button"
            accessibilityLabel="Mark review as not helpful"
            hitSlop={8}
          >
            <Ionicons
              name={ICONS.thumbsDown as React.ComponentProps<typeof Ionicons>['name']}
              size={product.reviewActionSize}
              color={COLORS.orange.normal}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },

  stars: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },

  comment: {
    marginTop: SPACING.sm,
  },

  photo: {
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orange.light,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },

  feedbackActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
});
