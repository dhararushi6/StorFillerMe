import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';

import {
  CodConfirmationModal,
  ExitPaymentModal,
  PaymentAmountBanner,
  PaymentCardsSection,
  PaymentCodSection,
  PaymentUpiSection,
} from '@/components/buyer/payment';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { PAYMENTS_SCREEN } from '@/constants/payment';
import { COLORS, SPACING, useResponsive } from '@/theme';

export default function BuyerPaymentScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ amount?: string; from?: string }>();
  const { horizontalPadding } = useResponsive();

  const [showExitModal, setShowExitModal] = useState(false);
  const [showCodModal, setShowCodModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const isWalletTopUp = params.from === 'wallet';
  const totalAmount = params.amount ? parseFloat(params.amount) : PAYMENTS_SCREEN.defaultAmount;

  const handleSelectUpiApp = useCallback((appId: string) => {
    setSelectedMethod(appId);
    if (isWalletTopUp) {
      router.push({
        pathname: '/(buyer)/processing-payment',
        params: { amount: totalAmount.toString() },
      });
    } else {
      router.push({
        pathname: '/(buyer)/payment-success',
        params: { amount: totalAmount.toString() },
      });
    }
  }, [isWalletTopUp, totalAmount]);

  const handleAddCard = useCallback(() => {
    router.push({
      pathname: '/(buyer)/add-card',
      params: {
        amount: totalAmount.toString(),
        from: isWalletTopUp ? 'wallet' : 'cart',
      },
    });
  }, [isWalletTopUp, totalAmount]);

  const handleSelectCod = useCallback(() => {
    setSelectedMethod('cod');
    setShowCodModal(true);
  }, []);

  const handleConfirmCod = useCallback(() => {
    setShowCodModal(false);
    router.push({
      pathname: '/(buyer)/payment-success',
      params: { amount: totalAmount.toString() },
    });
  }, [totalAmount]);

  const handleCloseCodModal = useCallback(() => {
    setShowCodModal(false);
  }, []);

  const handleConfirmExit = useCallback(() => {
    setShowExitModal(false);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace(isWalletTopUp ? '/(buyer)/add-balance' : '/(buyer)/cart');
    }
  }, [navigation, isWalletTopUp]);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={PAYMENTS_SCREEN.title} onBackPress={() => setShowExitModal(true)} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, sidePadding]}
      >
        <PaymentAmountBanner label={PAYMENTS_SCREEN.totalAmountLabel} amount={totalAmount} />

        <View style={styles.section}>
          <PaymentUpiSection
            title={PAYMENTS_SCREEN.upiSectionTitle}
            onSelectApp={handleSelectUpiApp}
          />
        </View>

        <View style={styles.section}>
          <PaymentCardsSection
            title={PAYMENTS_SCREEN.cardsSectionTitle}
            addCardLabel={PAYMENTS_SCREEN.addCardLabel}
            onAddCardPress={handleAddCard}
          />
        </View>

        {!isWalletTopUp && (
          <View style={styles.section}>
            <PaymentCodSection
              label={PAYMENTS_SCREEN.codLabel}
              selected={selectedMethod === 'cod'}
              onSelect={handleSelectCod}
            />
          </View>
        )}
      </ScrollView>

      {/* Cash on Delivery Confirmation Modal */}
      <CodConfirmationModal
        visible={showCodModal}
        onClose={handleCloseCodModal}
        onConfirm={handleConfirmCod}
      />

      {/* Leave Payment Confirmation Modal */}
      <ExitPaymentModal
        visible={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmExit={handleConfirmExit}
      />
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
    gap: SPACING.lg,
  },

  section: {
    gap: SPACING.md,
  },
});
