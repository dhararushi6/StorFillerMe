import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import {
  WalletBalanceCard,
  WalletHelpModal,
  WalletRecentTransactions,
} from '@/components/buyer/wallet';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { MY_WALLET_SCREEN, WALLET_BALANCE, WALLET_TRANSACTIONS } from '@/constants/wallet';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING, useResponsive } from '@/theme';

export default function BuyerWalletScreen() {
  const insets = useSafeAreaInsets();
  const { horizontalPadding } = useResponsive();
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const handleHelpPress = useCallback(() => {
    setIsHelpVisible(true);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setIsHelpVisible(false);
  }, []);

  const handleChatPress = useCallback(() => {
    setIsHelpVisible(false);
    router.push('/(buyer)/support');
  }, []);

  const handleCallPress = useCallback(() => {
    setIsHelpVisible(false);
    router.push('/(buyer)/support');
  }, []);

  const handleAddBalance = useCallback(() => {
    router.push('/(buyer)/add-balance');
  }, []);

  const handleViewAllTransactions = useCallback(() => {
    // Navigate to full transaction history or expand view
  }, []);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  const helpButton = (
    <Pressable
      onPress={handleHelpPress}
      accessibilityRole="button"
      accessibilityLabel={MY_WALLET_SCREEN.helpLabel}
      hitSlop={8}
      style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
    >
      <AppText variant="caption" color="primary" style={styles.helpText}>
        {MY_WALLET_SCREEN.helpLabel}
      </AppText>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={MY_WALLET_SCREEN.title}
        fallbackRoute="/(buyer)/home"
        rightElement={helpButton}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, sidePadding]}
      >
        <WalletBalanceCard
          title={MY_WALLET_SCREEN.cardTitle}
          statusLabel={MY_WALLET_SCREEN.statusLabel}
          currentBalanceLabel={MY_WALLET_SCREEN.currentBalanceLabel}
          balance={WALLET_BALANCE}
        />

        <View style={styles.section}>
          <WalletRecentTransactions
            title={MY_WALLET_SCREEN.recentTransactionsTitle}
            viewAllLabel={MY_WALLET_SCREEN.viewAllLabel}
            transactions={WALLET_TRANSACTIONS}
            onViewAllPress={handleViewAllTransactions}
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
        <AppButton title={MY_WALLET_SCREEN.addToWalletLabel} onPress={handleAddBalance} />
      </View>

      <WalletHelpModal
        visible={isHelpVisible}
        onClose={handleCloseHelp}
        onChatPress={handleChatPress}
        onCallPress={handleCallPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  helpButton: {
    backgroundColor: COLORS.header,
    borderWidth: 1,
    borderColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.xs - 1,
  },

  helpText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.xl,
  },

  section: {
    gap: SPACING.md,
  },

  footer: {
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
  },

  pressed: {
    opacity: 0.75,
  },
});
