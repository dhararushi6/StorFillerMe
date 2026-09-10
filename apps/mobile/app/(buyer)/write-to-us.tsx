import React, { useState } from 'react';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import successImage from '@/assets/images/mask-group.png';

import { COLORS, FONT_SIZE, RADIUS, SIZES, SPACING, useResponsive } from '@/theme';

const FEEDBACK_OPTIONS = [
  { id: 1, emoji: '😣' },
  { id: 2, emoji: '😟' },
  { id: 3, emoji: '😐' },
  { id: 4, emoji: '🙂' },
  { id: 5, emoji: '😊' },
] as const;

const MAX_MESSAGE_LENGTH = 1000;

export default function WriteToUsScreen() {
  const { horizontalPadding } = useResponsive();

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendMessage = () => {
    /*
      TODO:
      Replace this with the actual feedback API call.
    */
    console.log({
      rating: selectedRating,
      message,
    });

    setSubmitted(true);
  };

  const handleReturnHome = () => {
    router.replace('/(buyer)/home');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title="Write to us" variant="orange" fallbackRoute="/(buyer)/profile" />

        {submitted ? (
          //SUCCESS SCREEN
          <View
            style={[
              styles.successContent,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <View style={styles.successMain}>
              <Image
                source={successImage}
                style={styles.successImage}
                resizeMode="contain"
                accessibilityLabel="Message sent successfully"
              />

              <AppText variant="heading" style={styles.thankYouText}>
                Thank you!
              </AppText>

              <AppText variant="body" color="primary" style={styles.successDescription}>
                Your message has been sent successfully.
              </AppText>
            </View>

            <View style={styles.returnButtonContainer}>
              <Pressable
                onPress={handleReturnHome}
                accessibilityRole="button"
                style={styles.returnButton}
              >
                <AppText variant="button" style={styles.returnButtonText}>
                  Rent to home
                </AppText>
              </Pressable>
            </View>
          </View>
        ) : (
          // WRITE TO US FORM
          <View
            style={[
              styles.formContent,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            {/* Heading */}
            <View style={styles.headingSection}>
              <AppText variant="heading" style={styles.heading}>
                Share your feedback and
                {'\n'}
                suggestions
              </AppText>

              <AppText variant="body" color="secondary" style={styles.description}>
                Share your feedback, suggestions, or report an issue.
                {'\n'}
                We're always looking for ways to improve your
                {'\n'}
                experience.
              </AppText>
            </View>

            {/* Rating */}
            <View style={styles.ratingSection}>
              {FEEDBACK_OPTIONS.map((option) => {
                const isSelected = selectedRating === option.id;

                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Rating ${option.id} out of 5`}
                    onPress={() => setSelectedRating(option.id)}
                    style={[styles.ratingButton, isSelected && styles.ratingButtonSelected]}
                  >
                    <AppText style={styles.emoji}>{option.emoji}</AppText>
                  </Pressable>
                );
              })}
            </View>

            {/* Message */}
            <View style={styles.messageSection}>
              <AppInput
                label="Message"
                required
                multiline
                value={message}
                onChangeText={setMessage}
                maxLength={MAX_MESSAGE_LENGTH}
                placeholder="Describe your experience or issue in detail so we can assist you better"
                containerStyle={styles.messageInput}
                style={styles.textInput}
              />

              <AppText variant="caption" color="secondary" style={styles.counter}>
                {message.length}/{MAX_MESSAGE_LENGTH}
              </AppText>

              <AppText variant="caption" color="primary" style={styles.reviewText}>
                your message will be reviewed by our support team.
              </AppText>
            </View>

            {/* Send */}
            <View style={styles.buttonSection}>
              <AppButton title="Send Message" onPress={handleSendMessage} fullWidth />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  scrollContent: {
    flexGrow: 1,
  },

  // FORM

  formContent: {
    flex: 1,
    paddingBottom: SPACING.xxxl,
  },

  headingSection: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
  },

  heading: {
    textAlign: 'center',
    fontSize: FONT_SIZE.xl,
    lineHeight: 24,
  },

  description: {
    marginTop: SPACING.sm,
    textAlign: 'center',
  },

  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xxl,
  },

  ratingButton: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.orange.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingButtonSelected: {
    borderWidth: 2,
    borderColor: COLORS.orange.normal,
  },

  emoji: {
    fontSize: 25,
    lineHeight: 30,
  },

  messageSection: {
    marginTop: SPACING.xxxl,
  },

  messageInput: {
    position: 'relative',
  },

  textInput: {
    minHeight: SIZES.reviewInputHeight,
    height: SIZES.reviewInputHeight,
    textAlignVertical: 'top',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
  },

  counter: {
    position: 'absolute',
    right: SPACING.md,
    top: 100,
  },

  reviewText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.xs,
  },

  buttonSection: {
    height: SIZES.buttonHeight,
    width: '100%',
    marginTop: 'auto',
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },

  //  SUCCESS SCREEN

  successContent: {
    flex: 1,
    minHeight: 580,
    paddingBottom: SPACING.xxxl,
  },

  successMain: {
    alignItems: 'center',
  },

  successImage: {
    width: '100%',
    height: 300,
    marginTop: SPACING.xxl,
  },

  thankYouText: {
    color: COLORS.orange.normal,
    fontSize: FONT_SIZE.xxl,
    lineHeight: 32,
    marginTop: SPACING.xl,
  },

  successDescription: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontSize: FONT_SIZE.sm,
  },

  returnButtonContainer: {
    marginTop: 'auto',
  },

  returnButton: {
    height: SIZES.buttonHeight,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange.lightActive,
    borderWidth: 1,
    borderColor: COLORS.orange.normal,
    borderRadius: RADIUS.md,
  },

  returnButtonText: {
    color: COLORS.orange.normal,
  },
});
