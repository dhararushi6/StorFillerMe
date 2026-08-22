import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';

import { INITIAL_SAVED_ADDRESSES, LOCATION_STRINGS } from '@/constants/location';

import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, LINE_HEIGHT } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';
import { useResponsive } from '@/theme/responsive';
import { ICON_SIZES } from '@/theme/iconSizes';

export default function BuyerAddAddressMapScreen() {
  const { horizontalPadding } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedAddress = INITIAL_SAVED_ADDRESSES[0];

  // Navigate back to location screen
  const handleBack = useCallback(() => {
    router.push('/(buyer)/location' as any);
  }, []);

  // Navigate to the form screen (add-address-form)
  const handleAddAddressDetails = useCallback(() => {
    router.push('/(buyer)/add-address-form' as any);
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      {/* SOLID PEACH HEADER BAR (#FAE2BB) */}
      <View style={styles.headerContainer}>
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          <Pressable onPress={handleBack} hitSlop={SPACING.md}>
            <AppIcon name="back" size={ICON_SIZES.md} color={COLORS.text.primary} />
          </Pressable>

          <AppText style={styles.headerTitle} fontSize="lg">
            {LOCATION_STRINGS.addAddressHeader}
          </AppText>
        </View>
      </View>

      {/* MAP AREA */}
      <View style={styles.mapArea}>
        {/* Floating Search Bar */}
        <View
          style={[styles.searchContainer, { paddingHorizontal: horizontalPadding }]}
          pointerEvents="box-none"
        >
          <View style={styles.searchBar} pointerEvents="auto">
            <AppIcon name="search" size={ICON_SIZES.sm} color={COLORS.text.secondary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={LOCATION_STRINGS.searchPlaceholder}
              placeholderTextColor={COLORS.text.secondary}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Bottom Stack: Current Location Badge + Delivery Card */}
        <View
          style={[styles.bottomStack, { paddingHorizontal: horizontalPadding }]}
          pointerEvents="box-none"
        >
          {/* Current Location Badge */}
          <Pressable style={styles.currentLocationBadge} pointerEvents="auto">
            <AppIcon name="locate" size={ICON_SIZES.md} color={COLORS.text.primary} />
            <AppText style={styles.locationText} fontSize="sm">
              {LOCATION_STRINGS.useCurrentLocation}
            </AppText>
          </Pressable>

          {/* Delivery Card */}
          <View style={styles.addressCard} pointerEvents="auto">
            <AppText style={styles.deliveryLabel} fontSize="xs" color={COLORS.text.secondary}>
              {LOCATION_STRINGS.deliveringYourOrderTo}
            </AppText>

            <View style={styles.addressDetailsRow}>
              <View style={styles.pinIconBox}>
                <AppIcon name="location" size={ICON_SIZES.md} color={COLORS.text.primary} />
              </View>

              <View style={styles.addressTextContainer}>
                <AppText style={styles.shopTitle} fontSize="md" numberOfLines={1}>
                  {selectedAddress.title}
                </AppText>

                <AppText style={styles.addressText} fontSize="sm" color={COLORS.text.secondary}>
                  {selectedAddress.address}
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

  /* HEADER */
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
  },

  /* MAP AREA */
  mapArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.yellow.normal,
  },

  /* SEARCH BAR */
  searchContainer: {
    position: 'absolute',
    top: SPACING.md,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    height: SIZES.inputHeight,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: SPACING.sm,
    shadowOffset: { width: 0, height: SPACING.xs },
  },
  searchInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text.primary,
  },

  /* BOTTOM STACK */
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

  /* CURRENT LOCATION BADGE */
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
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  locationText: {
    fontFamily: FONT_FAMILY.medium,
  },

  /* BOTTOM CARD */
  addressCard: {
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    gap: SPACING.md,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOpacity: 0.08,
    shadowRadius: SPACING.sm,
    shadowOffset: { width: 0, height: SPACING.xs },
  },
  deliveryLabel: {
    fontFamily: FONT_FAMILY.semiBold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  /* ADDRESS */
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
    color: COLORS.orange.promoText,
  },
  addressText: {
    fontFamily: FONT_FAMILY.regular,
    lineHeight: LINE_HEIGHT.md,
  },

  /* BUTTON */
  actionButton: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.pill,
    height: SIZES.buttonHeight,
    marginTop: SPACING.sm,
  },
});
