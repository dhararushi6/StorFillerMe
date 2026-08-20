import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/common/ScreenHeader';
import { TERMS_SCREEN } from '@/constants/wallet';
import { COLORS, SPACING } from '@/theme';

export default function BuyerTermsAndConditionsScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader title={TERMS_SCREEN.title} fallbackRoute="/(buyer)/add-balance" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
  },
});
