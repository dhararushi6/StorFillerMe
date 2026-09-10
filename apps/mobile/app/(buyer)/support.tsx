import React, { useCallback } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import messageSquareIcon from '@/assets/icons/message-square.png';
import { OrderHeaderSection } from '@/components/buyer/order';
import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SUPPORT_SCREEN, TRACK_ORDER_SCREEN } from '@/constants/order';
import { COLORS, FONT_FAMILY, SPACING, useResponsive } from '@/theme';

export default function BuyerSupportScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    orderId?: string;
  }>();
  const { horizontalPadding } = useResponsive();

  const orderId = params.orderId || params.id || TRACK_ORDER_SCREEN.defaultOrderId;

  const handleChatWithUs = useCallback(() => {
    router.push({
      pathname: '/(buyer)/chat',
      params: { orderId },
    });
  }, [orderId]);

  const handleCallUs = useCallback(() => {
    Linking.openURL('tel:1800123456');
  }, []);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={SUPPORT_SCREEN.headerTitle} fallbackRoute="/(buyer)/track-order" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          sidePadding,
          {
            paddingBottom: insets.bottom + SPACING.xxl,
          },
        ]}
      >
        {/* Reusable Order Header (Order ID + Confirmed + Delivery At Banner + Notice) */}
        <OrderHeaderSection orderId={orderId} />

        {/* Need Help Section */}
        <View style={styles.helpSection}>
          <AppText style={styles.helpTitle}>{SUPPORT_SCREEN.helpSectionTitle}</AppText>

          <AppText style={styles.helpSubtitle}>{SUPPORT_SCREEN.helpSectionSubtitle}</AppText>

          {/* Action Cards */}
          <View style={styles.cardsList}>
            {/* Chat With Us Card (Rectangle 367) */}
            <Pressable
              onPress={handleChatWithUs}
              accessibilityRole="button"
              accessibilityLabel={SUPPORT_SCREEN.chatWithUsTitle}
              hitSlop={8}
              style={({ pressed }) => [styles.chatCard, pressed && styles.pressed]}
            >
              <View style={styles.cardLeftGroup}>
                <Image
                  source={messageSquareIcon}
                  style={styles.actionCardIcon}
                  resizeMode="contain"
                />

                <View style={styles.cardTextCol}>
                  <AppText style={styles.cardMainTitle}>{SUPPORT_SCREEN.chatWithUsTitle}</AppText>
                  <AppText style={styles.chatSubText}>{SUPPORT_SCREEN.chatWithUsSubtitle}</AppText>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color={COLORS.black} />
            </Pressable>

            {/* Call Us Card (Rectangle 368) */}
            <Pressable
              onPress={handleCallUs}
              accessibilityRole="button"
              accessibilityLabel={SUPPORT_SCREEN.callUsTitle}
              hitSlop={8}
              style={({ pressed }) => [styles.callCard, pressed && styles.pressed]}
            >
              <View style={styles.cardLeftGroup}>
                <Ionicons name="call-outline" size={26} color={COLORS.green.dark} />

                <View style={styles.cardTextCol}>
                  <AppText style={styles.cardMainTitle}>{SUPPORT_SCREEN.callUsTitle}</AppText>
                  <AppText style={styles.callSubText}>{SUPPORT_SCREEN.callUsSubtitle}</AppText>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color={COLORS.black} />
            </Pressable>
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
    gap: SPACING.md,
  },

  helpSection: {
    marginTop: SPACING.sm,
    gap: 4,
  },

  helpTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 16,
    color: COLORS.black,
  },

  helpSubtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    lineHeight: 14,
    color: COLORS.text.body,
    marginBottom: SPACING.sm,
  },

  cardsList: {
    gap: SPACING.md,
  },

  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(204, 93, 40, 0.10)',
    borderRadius: 12,
    borderWidth: 0.4,
    borderColor: COLORS.orange.normal,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    minHeight: 64,
  },

  callCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 148, 17, 0.10)',
    borderRadius: 12,
    borderWidth: 0.4,
    borderColor: COLORS.green.dark,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    minHeight: 64,
  },

  cardLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },

  actionCardIcon: {
    width: 26,
    height: 26,
  },

  cardTextCol: {
    gap: 2,
    flex: 1,
  },

  cardMainTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    lineHeight: 14,
    color: COLORS.black,
  },

  chatSubText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 12,
    lineHeight: 14,
    color: COLORS.orange.normal,
  },

  callSubText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 12,
    lineHeight: 14,
    color: COLORS.green.dark,
  },

  pressed: {
    opacity: 0.75,
  },
});
