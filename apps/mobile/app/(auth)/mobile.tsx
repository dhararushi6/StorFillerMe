import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

const COLORS = {
  background: '#F7F3E8',
  primary: '#D15C29',
  text: '#111111',
  secondaryText: '#666666',
  border: '#E7D8CB',
  white: '#FFFFFF',
};

export default function MobileScreen() {
  const [mobileNumber, setMobileNumber] = useState('');

  const handleContinue = () => {
    if (mobileNumber.length !== 10) {
      return;
    }

    router.push('/(auth)/verify');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>

            <View style={styles.progressContainer}>
              <View style={styles.activeProgress} />
              <View style={styles.inactiveProgress} />
              <View style={styles.inactiveProgress} />
              <View style={styles.inactiveProgress} />
            </View>

            <Pressable onPress={() => router.replace('/(auth)')} style={styles.headerButton}>
              <Text style={styles.closeIcon}>×</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Enter your{'\n'}mobile number</Text>

            <Text style={styles.subtitle}>We will you a verification code to get started</Text>

            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>

              <TextInput
                value={mobileNumber}
                onChangeText={(value) => setMobileNumber(value.replace(/\D/g, '').slice(0, 10))}
                placeholder=""
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.phoneInput}
              />
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.button, mobileNumber.length !== 10 && styles.buttonDisabled]}
          disabled={mobileNumber.length !== 10}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
  },

  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerButton: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 34,
    fontWeight: '300',
    color: COLORS.text,
    marginTop: -5,
  },

  closeIcon: {
    fontSize: 29,
    fontWeight: '300',
    color: COLORS.text,
  },

  progressContainer: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
  },

  activeProgress: {
    width: 19,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },

  inactiveProgress: {
    width: 19,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EDE8DD',
  },

  content: {
    paddingTop: 25,
  },

  title: {
    color: COLORS.text,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '500',
  },

  subtitle: {
    marginTop: 7,
    color: COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 18,
  },

  phoneRow: {
    flexDirection: 'row',
    marginTop: 27,
    gap: 7,
  },

  countryCode: {
    width: 50,
    height: 43,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countryCodeText: {
    fontSize: 14,
    color: COLORS.text,
  },

  phoneInput: {
    flex: 1,
    height: 43,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    color: COLORS.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  button: {
    height: 48,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
