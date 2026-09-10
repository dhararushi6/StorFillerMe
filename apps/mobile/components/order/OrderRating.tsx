import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/ui/AppInput';

import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING } from '@/theme';

const MAX_REVIEW_LENGTH = 1200;
const STAR_COUNT = 5;

interface OrderRatingProps {
  initialRating?: number;
  initialReview?: string;
  onRatingPress?: (rating: number) => void;
  onReviewChange?: (review: string) => void;
}

export function OrderRating({
  initialRating = 0,
  initialReview = '',
  onRatingPress,
  onReviewChange,
}: OrderRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);

  const handleRatingPress = (value: number) => {
    setRating(value);
    onRatingPress?.(value);
  };

  const handleReviewChange = (value: string) => {
    setReview(value);
    onReviewChange?.(value);
  };

  return (
    <View style={styles.container}>
      <AppText variant="bodyMedium" color="primary" style={styles.title}>
        Rate your experience
      </AppText>

      <View style={styles.stars}>
        {Array.from({ length: STAR_COUNT }, (_, index) => {
          const starNumber = index + 1;
          const isSelected = starNumber <= rating;

          return (
            <Pressable
              key={starNumber}
              onPress={() => handleRatingPress(starNumber)}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${starNumber} stars`}
              hitSlop={6}
              style={styles.starButton}
            >
              <AppIcon name={isSelected ? 'star' : 'starOutline'} size="lg" color={COLORS.rating} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.reviewBox}>
        <AppInput
          value={review}
          onChangeText={handleReviewChange}
          maxLength={MAX_REVIEW_LENGTH}
          multiline
          textAlignVertical="top"
          placeholder="Write a review"
          inputContainerStyle={styles.inputContainer}
          style={styles.input}
        />

        <AppText variant="caption" color="secondary" style={styles.counter}>
          {review.length}/{MAX_REVIEW_LENGTH}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.md,
  },

  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
  },

  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  starButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  /*
   * THIS is the design border.
   * AppInput itself does not create a border.
   */
  reviewBox: {
    minHeight: SIZES.reviewInputHeight,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.orange.card,
    borderRadius: RADIUS.md,
  },

  /*
   * Remove AppInput's internal spacing because
   * reviewBox already provides the Figma spacing.
   */
  inputContainer: {
    minHeight: SIZES.reviewInputHeight,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },

  /*
   * Actual TextInput remains borderless.
   */
  input: {
    flex: 1,
    minHeight: SIZES.reviewInputHeight,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
  },

  counter: {
    alignSelf: 'flex-end',
    fontSize: FONT_SIZE.xs,
  },
});
