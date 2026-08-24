import React from 'react';
import successImage from '../../assets/auth/success.png';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

const COLORS = {
  background: '#F7F3E8',
  primary: '#D15C29',
  text: '#111111',
  secondaryText: '#5D5D5D',
  white: '#FFFFFF',
};

export default function SuccessScreen() {
  const handleGetStarted = () => {
    // Later this can navigate to the actual buyer/shop dashboard.
    router.replace('/(buyer)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <View style={styles.activeProgress} />
          <View style={styles.activeProgress} />
          <View style={styles.activeProgress} />
          <View style={styles.activeProgress} />
        </View>

        <View style={styles.content}>
          <Image source={successImage} style={styles.successImage} resizeMode="contain" />

          <View style={styles.textContainer}>
            <Text style={styles.title}>All Set!</Text>

            <Text style={styles.description}>
              Your shop account is ready. Start{'\n'}
              ordering and grow your business{'\n'}
              with us.
            </Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
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
    paddingBottom: 20,
  },

  progressContainer: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  activeProgress: {
    width: 19,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },

  content: {
    flex: 1,
  },

  successImage: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },

  textContainer: {
    marginTop: 18,
  },

  title: {
    color: COLORS.text,
    fontSize: 35,
    lineHeight: 42,
    fontWeight: '500',
  },

  description: {
    marginTop: 12,
    color: COLORS.secondaryText,
    fontSize: 15,
    lineHeight: 21,
  },

  button: {
    height: 48,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
