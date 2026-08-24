import React from 'react';

import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../constants/colors';

import { AUTH_CONTENT, SPACING } from '../../constants/auth';

import { AUTH_IMAGES } from '../../constants/image';

import PrimaryButton from '../../components/PrimaryButton';

export default function WelcomeScreen() {
  const navigateToMobile = () => {
    router.push('/(auth)/mobile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={AUTH_IMAGES.welcome} style={styles.image} resizeMode="contain" />

          <View style={styles.textContainer}>
            <Text style={styles.title}>{AUTH_CONTENT.welcome.title}</Text>

            <Text style={styles.description}>{AUTH_CONTENT.welcome.description}</Text>
          </View>
        </View>

        <PrimaryButton title={AUTH_CONTENT.welcome.button} onPress={navigateToMobile} />
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
    paddingHorizontal: SPACING.horizontal,
    paddingBottom: 20,
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
    marginTop: 20,
  },

  title: {
    color: COLORS.text,
    fontSize: 35,
    lineHeight: 43,
    fontWeight: '500',
    letterSpacing: -0.7,
  },

  description: {
    marginTop: 12,
    color: COLORS.secondaryText,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
});
