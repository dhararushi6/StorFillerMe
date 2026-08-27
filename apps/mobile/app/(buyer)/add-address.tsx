import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { HomeSearchBar } from '../../components/buyer/home/HomeSearchBar';

import { LOCATION_STRINGS } from '@/constants/location';
import { useAddresses } from './AddressContext';

import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';
import { useResponsive } from '@/theme/responsive';

export default function BuyerAddAddressMapScreen() {
  const { horizontalPadding } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');

  // Access dynamic address state from context
  const { selectedAddress, addresses } = useAddresses();
  const currentAddress = selectedAddress || addresses[0];

  const handleBack = useCallback(() => {
    router.push('/(buyer)/location' as any);
  }, []);

  const handleAddAddressDetails = useCallback(() => {
    router.push('/(buyer)/add-address-form' as any);
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      {/* SOLID PEACH HEADER BAR */}
      <View style={styles.headerContainer}>
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          <Pressable onPress={handleBack} hitSlop={SPACING.md}>
            <AppIcon name="back" size="md" color={COLORS.text.primary} />
          </Pressable>
          <AppText style={styles.headerTitle}>{LOCATION_STRINGS.addAddressHeader}</AppText>
        </View>
      </View>

      {/* MAP AREA */}
      <View style={styles.mapArea}>
        {/* Floating Search Bar */}
        <View
          style={[styles.searchContainer, { paddingHorizontal: horizontalPadding }]}
          pointerEvents="box-none"
        >
          <HomeSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={LOCATION_STRINGS.searchPlaceholder}
            onPress={() => {}}
            onMicPress={() => {}}
          />
        </View>

        {/* Bottom Stack: Current Location Badge + Delivery Card */}
        <View
          style={[styles.bottomStack, { paddingHorizontal: horizontalPadding }]}
          pointerEvents="box-none"
        >
          <Pressable style={styles.currentLocationBadge} pointerEvents="auto">
            <AppIcon name="locate" size="md" color={COLORS.text.primary} />
            <AppText style={styles.locationText}>{LOCATION_STRINGS.useCurrentLocation}</AppText>
          </Pressable>

          <View style={styles.addressCard} pointerEvents="auto">
            <AppText style={styles.deliveryLabel}>{LOCATION_STRINGS.deliveringYourOrderTo}</AppText>

            <View style={styles.addressDetailsRow}>
              <View style={styles.pinIconBox}>
                <AppIcon name="location" size="md" color={COLORS.text.primary} />
              </View>
              <View style={styles.addressTextContainer}>
                <AppText style={styles.shopTitle} numberOfLines={1}>
                  {currentAddress?.title || (currentAddress as any)?.shopName || 'Current Location'}
                </AppText>
                <AppText style={styles.addressText}>
                  {currentAddress?.address || 'Select or add a new address'}
                </AppText>
              </View>
            </View>

            <AppButton
              title={LOCATION_STRINGS.addAddressDetails}
              onPress={handleAddAddressDetails}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.orange.card,
  },
  headerContainer: {
    backgroundColor: COLORS.orange.card,
    paddingBottom: SPACING.xs,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text.primary,
  },
  mapArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.yellow.normal,
  },
  searchContainer: {
    position: 'absolute',
    top: SPACING.md,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  bottomStack: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: 0,
    right: 0,
    alignItems: 'stretch',
    gap: SPACING.lg,
    zIndex: 10,
    elevation: 10,
  },
  currentLocationBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.orange.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    elevation: 3,
    shadowColor: COLORS.text.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  locationText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
  },
  addressCard: {
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.xxl ?? RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    elevation: 4,
    shadowColor: COLORS.text.primary,
    shadowOpacity: 0.08,
    shadowRadius: SPACING.sm,
    shadowOffset: { width: 0, height: SPACING.xs },
  },
  deliveryLabel: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  addressDetailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  pinIconBox: {
    marginTop: SPACING.xs / 2,
  },
  addressTextContainer: {
    flex: 1,
    gap: SPACING.xs / 2,
  },
  shopTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.orange.normal,
  },
  addressText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    lineHeight: LINE_HEIGHT.md,
  },
  actionButton: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
    height: SIZES.buttonHeight ?? 52,
    marginTop: SPACING.sm,
  },
});
