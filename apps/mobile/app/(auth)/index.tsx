import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import welcomeImage from '@/assets/auth/welcome.png';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AUTH_CONTENT } from '@/constants/auth';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LETTER_SPACING,
  LINE_HEIGHT,
  RADIUS,
  SIZES,
  SPACING,
} from '@/theme';

export default function WelcomeScreen() {
  const navigateToMobile = () => {
    router.push('/(auth)/mobile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Image source={welcomeImage} style={styles.image} resizeMode="contain" />

          <View style={styles.textContainer}>
            <AppText variant="display" style={styles.title}>
              {AUTH_CONTENT.welcome.title}
            </AppText>

            <AppText variant="body" color="secondary" style={styles.description}>
              {AUTH_CONTENT.welcome.description}
            </AppText>
          </View>
        </ScrollView>

        <AppButton
          title={AUTH_CONTENT.welcome.button}
          onPress={navigateToMobile}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    justifyContent: 'space-between',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingBottom: SPACING.xl,
  },

  image: {
    width: '100%',
    height: SIZES.authWelcomeImageHeight,
    marginTop: SIZES.authWelcomeImageTop,
  },

  textContainer: {
    marginTop: SIZES.authWelcomeTextGap,
  },

  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.authTitle,
    lineHeight: LINE_HEIGHT.authTitle,
    letterSpacing: LETTER_SPACING.authTitle,
  },

  description: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.authDescription,
  },

  button: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.sm,
  },
});
