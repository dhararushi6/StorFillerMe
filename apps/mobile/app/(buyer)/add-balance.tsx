import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/ui/AppButton';
import { WalletBalanceCard, WalletNote, WalletQuickAdd } from '@/components/buyer/wallet';
import {
  WALLET_BALANCE,
  WALLET_NOTE,
  WALLET_QUICK_ADD_OPTIONS,
  WALLET_SCREEN,
} from '@/constants/wallet';
import { COLORS, SPACING, useResponsive } from '@/theme';

export default function BuyerAddBalanceScreen() {
  const insets = useSafeAreaInsets();
  const { horizontalPadding } = useResponsive();

  const [selectedOptionId, setSelectedOptionId] = useState<string>(WALLET_QUICK_ADD_OPTIONS[0].id);

  const handleTermsPress = useCallback(() => {
    router.push('/(buyer)/terms-and-conditions');
  }, []);

  const handleAddToWallet = useCallback(() => {
    // Wallet top-up will be connected to the payments API.
  }, []);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={WALLET_SCREEN.title} fallbackRoute="/(buyer)/cart" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, sidePadding]}
      >
        <WalletBalanceCard
          title={WALLET_SCREEN.cardTitle}
          statusLabel={WALLET_SCREEN.statusLabel}
          currentBalanceLabel={WALLET_SCREEN.currentBalanceLabel}
          balance={WALLET_BALANCE}
        />

        <View style={styles.section}>
          <WalletQuickAdd
            title={WALLET_SCREEN.quickAddTitle}
            options={WALLET_QUICK_ADD_OPTIONS}
            selectedId={selectedOptionId}
            onSelect={setSelectedOptionId}
          />
        </View>

        <View style={styles.section}>
          <WalletNote
            title={WALLET_NOTE.title}
            points={WALLET_NOTE.points}
            termsLabel={WALLET_NOTE.termsLabel}
            onTermsPress={handleTermsPress}
          />
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
        <AppButton title={WALLET_SCREEN.submitLabel} onPress={handleAddToWallet} />
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
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  section: {
    marginTop: SPACING.xl,
  },

  footer: {
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
  },
});
