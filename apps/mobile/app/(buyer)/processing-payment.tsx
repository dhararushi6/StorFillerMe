import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import processingIllustration from '@/assets/images/processing-payment.png';
import { AppText } from '@/components/common/AppText';
import { PAYMENTS_SCREEN, PROCESSING_PAYMENT_SCREEN } from '@/constants/payment';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING, useResponsive } from '@/theme';

export default function BuyerProcessingPaymentScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ amount?: string }>();
  const { horizontalPadding } = useResponsive();

  const totalAmount = params.amount ? parseFloat(params.amount) : PAYMENTS_SCREEN.defaultAmount;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({
        pathname: '/(buyer)/payment-success',
        params: { amount: totalAmount.toString() },
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [totalAmount]);

  return (
    <View style={styles.screen}>
      {/* Curved Minimal Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
          },
        ]}
      />

      {/* Main Content */}
      <View
        style={[
          styles.content,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <Image source={processingIllustration} style={styles.illustration} resizeMode="contain" />

        <AppText variant="subheading" color="primary" style={styles.title}>
          {PROCESSING_PAYMENT_SCREEN.title}
        </AppText>

        <AppText variant="heading" color="primary" style={styles.amount}>
          ₹ {totalAmount.toFixed(2)}
        </AppText>

        <AppText variant="body" color="secondary" style={styles.description}>
          {PROCESSING_PAYMENT_SCREEN.description}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    minHeight: SIZES.headerLargeHeight,
    backgroundColor: COLORS.header,
    borderBottomLeftRadius: RADIUS.header,
    borderBottomRightRadius: RADIUS.header,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.xxl * 2,
  },

  illustration: {
    width: 260,
    height: 200,
    marginBottom: SPACING.xl,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
  },

  amount: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },

  description: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
});
