import React from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import welcomeImage from '@/assets/auth/welcome.png';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AUTH_CONTENT } from '@/constants/auth';
import { COLORS, FONT_FAMILY, RADIUS, SPACING } from '@/theme';

export default function WelcomeScreen() {
  const navigateToMobile = () => {
    router.push('/(auth)/mobile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={welcomeImage} style={styles.image} resizeMode="contain" />

          <View style={styles.textContainer}>
            <AppText style={styles.title}>{AUTH_CONTENT.welcome.title}</AppText>
            <AppText style={styles.description}>{AUTH_CONTENT.welcome.description}</AppText>
          </View>
        </View>

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
    paddingHorizontal: 22,
    paddingBottom: SPACING.lg,
    justifyContent: 'space-between',
  },

  content: {
    flex: 1,
  },

  image: {
    width: '100%',
    height: 300,
    marginTop: 35,
  },

  textContainer: {
    marginTop: SPACING.lg,
  },

  title: {
    color: COLORS.text.primary,
    fontFamily: FONT_FAMILY.medium,
    fontSize: 35,
    lineHeight: 43,
    letterSpacing: -0.7,
  },

  description: {
    marginTop: SPACING.sm,
    color: COLORS.text.secondary,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 16,
    lineHeight: 22,
  },

  button: {
    height: 48,
    borderRadius: RADIUS.xs + 2,
    backgroundColor: COLORS.orange.normal,
  },
});
