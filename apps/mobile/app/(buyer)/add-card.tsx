import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { PaymentAmountBanner, UnderlineInput } from '@/components/buyer/payment';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/ui/AppButton';
import { ADD_CARD_SCREEN, PAYMENTS_SCREEN } from '@/constants/payment';
import { COLORS, RADIUS, SPACING, useResponsive } from '@/theme';

export default function BuyerAddCardScreen() {
  const params = useLocalSearchParams<{ amount?: string; from?: string }>();
  const { horizontalPadding } = useResponsive();

  const totalAmount = params.amount ? parseFloat(params.amount) : PAYMENTS_SCREEN.defaultAmount;

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const handleCardNumberChange = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  }, []);

  const handleExpiryChange = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setExpiryDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setExpiryDate(cleaned);
    }
  }, []);

  const isCardNumberValid = cardNumber.replace(/\D/g, '').length === 16;
  const isExpiryValid = expiryDate.replace(/\D/g, '').length === 4;
  const isCvvValid = cvv.length >= 3 && cvv.length <= 4;
  const isNameValid = cardHolderName.trim().length >= 2;

  const isFormValid = isCardNumberValid && isExpiryValid && isCvvValid && isNameValid;

  const handlePay = useCallback(() => {
    if (!isFormValid) return;

    router.push({
      pathname: '/(buyer)/bank-verification',
      params: {
        amount: totalAmount.toString(),
        from: params.from || 'cart',
      },
    });
  }, [isFormValid, params.from, totalAmount]);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={ADD_CARD_SCREEN.title} fallbackRoute="/(buyer)/payment" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, sidePadding]}
      >
        <PaymentAmountBanner label={PAYMENTS_SCREEN.totalAmountLabel} amount={totalAmount} />

        <View style={styles.form}>
          <UnderlineInput
            label={ADD_CARD_SCREEN.cardNumberLabel}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
          />

          <View style={styles.row}>
            <UnderlineInput
              label={ADD_CARD_SCREEN.expiryDateLabel}
              value={expiryDate}
              onChangeText={handleExpiryChange}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
              containerStyle={styles.halfInput}
            />

            <UnderlineInput
              label={ADD_CARD_SCREEN.cvvLabel}
              value={cvv}
              onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              containerStyle={styles.halfInput}
            />
          </View>

          <UnderlineInput
            label={ADD_CARD_SCREEN.cardHolderNameLabel}
            value={cardHolderName}
            onChangeText={setCardHolderName}
            placeholder="Card Holder Name"
            autoCapitalize="words"
          />

          <View style={styles.buttonWrapper}>
            <AppButton
              title={`${ADD_CARD_SCREEN.payButtonLabel}  ₹ ${totalAmount}`}
              onPress={handlePay}
              disabled={!isFormValid}
              style={styles.payButton}
            />
          </View>
        </View>
      </ScrollView>
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
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.xl,
  },

  form: {
    gap: SPACING.xl,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },

  halfInput: {
    flex: 1,
  },

  buttonWrapper: {
    marginTop: SPACING.lg,
  },

  payButton: {
    height: 39,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.orange.normal,
  },
});
