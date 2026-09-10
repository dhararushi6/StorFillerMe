import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { OtpInput } from '@/components/buyer/payment';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { BANK_VERIFICATION_SCREEN } from '@/constants/payment';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
  useResponsive,
} from '@/theme';

export default function BuyerBankVerificationScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone?: string; amount?: string; from?: string }>();
  const { horizontalPadding } = useResponsive();

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(BANK_VERIFICATION_SCREEN.resendDurationSeconds);

  const phone = params.phone || BANK_VERIFICATION_SCREEN.defaultPhone;

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = useCallback(() => {
    if (timeLeft > 0) return;
    setTimeLeft(BANK_VERIFICATION_SCREEN.resendDurationSeconds);
  }, [timeLeft]);

  const handleVerify = useCallback(() => {
    if (params.from === 'wallet') {
      router.replace({
        pathname: '/(buyer)/processing-payment',
        params: { amount: params.amount || '105' },
      });
    } else {
      router.replace({
        pathname: '/(buyer)/payment-success',
        params: { amount: params.amount || '105' },
      });
    }
  }, [params.amount, params.from]);

  const formatTimer = (seconds: number) => {
    const s = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `00:${s}`;
  };

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={BANK_VERIFICATION_SCREEN.title} fallbackRoute="/(buyer)/add-card" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, sidePadding]}
      >
        <View style={styles.content}>
          {/* Mobile Description */}
          <AppText variant="body" color="primary" style={styles.description}>
            {BANK_VERIFICATION_SCREEN.descriptionPrefix}
            <AppText style={styles.phoneText}>{phone}</AppText>
          </AppText>

          {/* 5-digit OTP Input */}
          <View style={styles.otpWrapper}>
            <OtpInput length={BANK_VERIFICATION_SCREEN.otpLength} value={otp} onChange={setOtp} />
          </View>

          {/* Resend Code Section */}
          <View style={styles.resendContainer}>
            {timeLeft > 0 ? (
              <AppText variant="body" color="primary" style={styles.resendText}>
                {BANK_VERIFICATION_SCREEN.resendPrefix}
                <AppText style={styles.timerText}>{formatTimer(timeLeft)}</AppText>
              </AppText>
            ) : (
              <Pressable
                onPress={handleResend}
                accessibilityRole="button"
                accessibilityLabel={BANK_VERIFICATION_SCREEN.resendAction}
                hitSlop={8}
              >
                <AppText style={styles.resendActionText}>
                  {BANK_VERIFICATION_SCREEN.resendAction}
                </AppText>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          sidePadding,
          {
            paddingBottom: insets.bottom + SPACING.lg,
          },
        ]}
      >
        <AppButton
          title={BANK_VERIFICATION_SCREEN.verifyButtonLabel}
          onPress={handleVerify}
          disabled={otp.length < BANK_VERIFICATION_SCREEN.otpLength}
          style={styles.verifyButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },

  content: {
    gap: SPACING.xl,
  },

  description: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.paragraph,
    color: COLORS.black,
  },

  phoneText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.paragraph,
    color: COLORS.orange.normal,
  },

  otpWrapper: {
    marginTop: SPACING.sm,
  },

  resendContainer: {
    marginTop: SPACING.xs,
  },

  resendText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.helper,
  },

  timerText: {
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.orange.normal,
  },

  resendActionText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.helper,
    color: COLORS.orange.normal,
  },

  footer: {
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
  },

  verifyButton: {
    height: 43,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.orange.normal,
  },
});
