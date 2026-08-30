import React, { useCallback, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import {
  WalletBalanceCard,
  WalletHelpModal,
  WalletNote,
  WalletQuickAdd,
} from '@/components/buyer/wallet';
import {
  WALLET_BALANCE,
  WALLET_NOTE,
  WALLET_QUICK_ADD_OPTIONS,
  WALLET_SCREEN,
} from '@/constants/wallet';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING, useResponsive } from '@/theme';

export default function BuyerAddBalanceScreen() {
  const insets = useSafeAreaInsets();
  const { horizontalPadding } = useResponsive();

  const [selectedOptionId, setSelectedOptionId] = useState<string>(WALLET_QUICK_ADD_OPTIONS[0].id);
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const handleHelpPress = useCallback(() => {
    setIsHelpVisible(true);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setIsHelpVisible(false);
  }, []);

  const handleChatPress = useCallback(() => {
    setIsHelpVisible(false);
    router.push('/(buyer)/chat');
  }, []);

  const handleCallPress = useCallback(() => {
    setIsHelpVisible(false);
    Linking.openURL('tel:1800123456');
  }, []);

  const handleTermsPress = useCallback(() => {
    router.push('/(buyer)/terms-and-conditions');
  }, []);

  const handleAddToWallet = useCallback(() => {
    const selectedOption = WALLET_QUICK_ADD_OPTIONS.find((opt) => opt.id === selectedOptionId);
    const amount = selectedOption ? selectedOption.amount : 500;
    router.push({
      pathname: '/(buyer)/payment',
      params: { amount: amount.toString(), from: 'wallet' },
    });
  }, [selectedOptionId]);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  const helpButton = (
    <Pressable
      onPress={handleHelpPress}
      accessibilityRole="button"
      accessibilityLabel={WALLET_SCREEN.helpLabel}
      hitSlop={8}
      style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
    >
      <AppText variant="caption" color="primary" style={styles.helpText}>
        {WALLET_SCREEN.helpLabel}
      </AppText>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={WALLET_SCREEN.title}
        fallbackRoute="/(buyer)/wallet"
        rightElement={helpButton}
      />

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
        <AppButton
          title={WALLET_SCREEN.submitLabel}
          onPress={handleAddToWallet}
          style={styles.confirmButton}
        />
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
  },

  section: {
    marginTop: SPACING.xl,
  },

  footer: {
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
  },

  confirmButton: {
    height: 43,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.orange.normal,
  },

  pressed: {
    opacity: 0.75,
  },
});
