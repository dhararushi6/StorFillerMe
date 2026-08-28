import React, { useCallback } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import truckFillIcon from '@/assets/icons/truck-fill.png';
import { AppText } from '@/components/common/AppText';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SUPPORT_SCREEN, TRACK_ORDER_SCREEN } from '@/constants/order';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING, useResponsive } from '@/theme';

export default function BuyerSupportScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    orderId?: string;
  }>();
  const { horizontalPadding } = useResponsive();

  const orderId = params.orderId || params.id || TRACK_ORDER_SCREEN.defaultOrderId;

  const handleChatWithUs = useCallback(() => {
    // Open chat or WhatsApp support
  }, []);

  const handleCallUs = useCallback(() => {
    Linking.openURL('tel:1800123456');
  }, []);

  const sidePadding = {
    paddingHorizontal: horizontalPadding,
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={SUPPORT_SCREEN.headerTitle}
        fallbackRoute="/(buyer)/home"
      />

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
        {/* Order ID & Confirmed Status Header */}
        <View style={styles.orderIdHeaderRow}>
          <View style={styles.orderIdCol}>
            <AppText style={styles.orderIdLabel}>
              {TRACK_ORDER_SCREEN.orderIdLabel}
            </AppText>

            <AppText style={styles.orderIdValue}>
              {orderId}
            </AppText>

            <AppText style={styles.placedDateText}>
              {TRACK_ORDER_SCREEN.placedOnPrefix} {TRACK_ORDER_SCREEN.defaultPlacedDate}
            </AppText>
          </View>

          {/* Confirmed Badge */}
          <View style={styles.confirmedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#009411" />
            <AppText style={styles.confirmedText}>
              {TRACK_ORDER_SCREEN.confirmedBadge}
            </AppText>
          </View>
        </View>

        {/* Delivery At Banner (Rectangle 366) */}
        <View style={styles.deliveryBanner}>
          <Image source={truckFillIcon} style={styles.truckIcon} resizeMode="contain" />

          <View style={styles.deliveryBannerTextCol}>
            <AppText style={styles.deliveryAtLabel}>
              {TRACK_ORDER_SCREEN.deliveryAtLabel}
            </AppText>
            <AppText style={styles.deliveryWindowText}>
              {TRACK_ORDER_SCREEN.defaultDeliveryWindow}
            </AppText>
          </View>
        </View>

        {/* Subtitle Notification */}
        <AppText style={styles.deliveryNotice}>
          {TRACK_ORDER_SCREEN.outForDeliveryNotice}
        </AppText>

        {/* Need Help Section */}
        <View style={styles.helpSection}>
          <AppText style={styles.helpTitle}>
            {SUPPORT_SCREEN.helpSectionTitle}
          </AppText>

          <AppText style={styles.helpSubtitle}>
            {SUPPORT_SCREEN.helpSectionSubtitle}
          </AppText>

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
                <Ionicons name="chatbubble-outline" size={26} color={COLORS.orange.normal} />

                <View style={styles.cardTextCol}>
                  <AppText style={styles.cardMainTitle}>
                    {SUPPORT_SCREEN.chatWithUsTitle}
                  </AppText>
                  <AppText style={styles.chatSubText}>
                    {SUPPORT_SCREEN.chatWithUsSubtitle}
                  </AppText>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#000000" />
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
                <Ionicons name="call-outline" size={26} color="#009411" />

                <View style={styles.cardTextCol}>
                  <AppText style={styles.cardMainTitle}>
                    {SUPPORT_SCREEN.callUsTitle}
                  </AppText>
                  <AppText style={styles.callSubText}>
                    {SUPPORT_SCREEN.callUsSubtitle}
                  </AppText>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#000000" />
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

  orderIdHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  orderIdCol: {
    gap: 2,
  },

  orderIdLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: '#444444',
  },

  orderIdValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
    marginTop: 2,
  },

  placedDateText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: '#666666',
    marginTop: 2,
  },

  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },

  confirmedText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: '#009411',
  },

  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(204, 93, 40, 0.20)',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    gap: SPACING.md,
    minHeight: 64,
  },

  truckIcon: {
    width: 32,
    height: 32,
  },

  deliveryBannerTextCol: {
    gap: 2,
  },

  deliveryAtLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: '#111111',
  },

  deliveryWindowText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 14,
    color: COLORS.orange.normal,
  },

  deliveryNotice: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: '#555555',
    marginTop: -4,
  },

  helpSection: {
    marginTop: SPACING.sm,
    gap: 4,
  },

  helpTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 16,
    color: '#000000',
  },

  helpSubtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: '#555555',
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
    borderColor: '#009411',
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

  cardTextCol: {
    gap: 2,
    flex: 1,
  },

  cardMainTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    lineHeight: 14,
    color: '#000000',
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
    color: '#009411',
  },

  pressed: {
    opacity: 0.75,
  },
});
