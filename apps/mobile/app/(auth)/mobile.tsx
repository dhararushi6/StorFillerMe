import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { AuthHeader } from '@/components/common/AuthHeader';

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

export default function MobileScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleContinue = () => {
    if (mobileNumber.length !== 10) {
      return;
    }

    router.push('/(auth)/verify');
  };

  const isValid = mobileNumber.length === 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View>
          <AuthHeader
            currentStep={1}
            totalSteps={4}
            onBack={() => router.back()}
            onClose={() => router.replace('/(auth)')}
          />

          <View style={styles.content}>
            <AppText style={styles.title}>Enter your{'\n'}mobile number</AppText>

            <AppText variant="body" color="primary" style={styles.subtitle}>
              We will send you a verification code to get started
            </AppText>

            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <AppText style={styles.countryCodeText}>+91</AppText>
              </View>

              <AppInput
                value={mobileNumber}
                onChangeText={(value) => setMobileNumber(value.replace(/\D/g, '').slice(0, 10))}
                onFocusChange={setIsInputFocused}
                keyboardType="phone-pad"
                maxLength={10}
                containerStyle={styles.phoneInput}
                inputContainerStyle={[
                  styles.phoneInputContainer,
                  isInputFocused && styles.phoneInputContainerFocused,
                ]}
                style={styles.phoneNumber}
              />
            </View>
          </View>
        </View>

        <AppButton
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid}
          style={styles.button}
        />
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
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    justifyContent: 'space-between',
  },

  content: {
    paddingTop: SIZES.authHeaderContentGap,
  },

  title: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.authTitle,
    lineHeight: LINE_HEIGHT.authTitle,
    letterSpacing: LETTER_SPACING.authTitle,
    color: COLORS.text.primary,
  },

  subtitle: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.authDescription,
  },

  phoneRow: {
    flexDirection: 'row',
    marginTop: SPACING.xxl,
    gap: SIZES.authPhoneInputGap,
  },
  phoneNumber: {
    fontSize: FONT_SIZE.xl,
  },
  countryCode: {
    width: SIZES.authCountryCodeWidth,
    height: SIZES.inputHeight,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SIZES.borderStandard,
    borderColor: COLORS.orange.banner,
    borderRadius: RADIUS.xs,
  },

  countryCodeText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.text.primary,
  },

  phoneInput: {
    flex: 1,
  },

  phoneInputContainer: {
    width: '100%',
    height: SIZES.inputHeight,
    minHeight: SIZES.inputHeight,
    backgroundColor: COLORS.surface,
    borderWidth: SIZES.borderStandard,
    borderColor: COLORS.orange.banner,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.none,
  },

  phoneInputContainerFocused: {
    borderColor: COLORS.orange.normal,
  },

  button: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.sm,
  },
});
