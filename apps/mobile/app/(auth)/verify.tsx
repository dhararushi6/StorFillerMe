import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { AuthHeader } from '@/components/common/AuthHeader';
import { AppButton } from '@/components/ui/AppButton';
import { OtpInput } from '@/components/buyer/payment/OtpInput';

import { COLORS, FONT_SIZE, LINE_HEIGHT, RADIUS, SIZES, SPACING } from '@/theme';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyScreen() {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((current) => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (timer > 0) {
      return;
    }

    setOtp('');
    setTimer(RESEND_SECONDS);
  };

  const handleVerify = () => {
    if (otp.length !== OTP_LENGTH) {
      return;
    }

    router.push('/(auth)/shop-detail');
  };

  const formattedTimer = `00:${String(timer).padStart(2, '0')}`;
  const isValid = otp.length === OTP_LENGTH;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <AuthHeader
            currentStep={2}
            totalSteps={4}
            onBack={() => router.back()}
            onClose={() => router.replace('/(auth)')}
          />

          <View style={styles.content}>
            <AppText style={styles.title}>Verify your{'\n'}number</AppText>

            <AppText variant="body" color="primary" style={styles.subtitle}>
              We've sent a 6-digit code to{' '}
              <AppText style={styles.phoneNumber}>+91 xxxxx xxxxx</AppText>
            </AppText>

            <View style={styles.otpContainer}>
              <OtpInput length={OTP_LENGTH} value={otp} onChange={setOtp} />
            </View>

            {timer > 0 ? (
              <AppText variant="caption" color="primary" style={styles.resendText}>
                Resend code in <AppText style={styles.timer}>{formattedTimer}</AppText>
              </AppText>
            ) : (
              <AppText variant="caption" style={styles.resendButton} onPress={handleResend}>
                Resend code
              </AppText>
            )}
          </View>
        </View>

        <AppButton
          title="Verify"
          onPress={handleVerify}
          disabled={!isValid}
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

  content: {
    paddingTop: SIZES.authHeaderContentGap,
  },

  title: {
    fontSize: FONT_SIZE.authTitle,
    lineHeight: LINE_HEIGHT.authTitle,
    color: COLORS.text.primary,
  },

  subtitle: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.authDescription,
  },

  phoneNumber: {
    color: COLORS.orange.normal,
  },

  otpContainer: {
    marginTop: SPACING.xxl,
  },

  resendText: {
    marginTop: SPACING.md,
  },

  timer: {
    color: COLORS.orange.normal,
  },

  resendButton: {
    marginTop: SPACING.md,
    color: COLORS.orange.normal,
  },

  button: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.sm,
  },
});
