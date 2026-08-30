import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

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

/* ============================================================
   FIGMA ICONS
============================================================ */

// ✅ Replaced require() with ES imports
import MAP_PIN_ICON from '@/assets/icons/map-pin (4) 5.png';
import CROSSHAIR_ICON from '@/assets/icons/crosshair 1.png';
import ARROW_ICON from '@/assets/icons/Arrow 10.png';

/* ============================================================
   SCREEN
============================================================ */

export default function BuyerAddAddressMapScreen() {
  const { horizontalPadding } = useResponsive();

  const [searchQuery, setSearchQuery] = useState('');

  const { selectedAddress, addresses } = useAddresses();

  const currentAddress = selectedAddress || addresses?.[0];

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const handleBack = useCallback(() => {
    router.push('/(buyer)/location' as any);
  }, []);

  const handleAddAddressDetails = useCallback(() => {
    router.push('/(buyer)/add-address-form' as any);
  }, []);

  /* ==========================================================
     STYLES
  ========================================================== */

  const styles = useMemo(
    () =>
      StyleSheet.create({
        /* ====================================================
           SCREEN
        ==================================================== */

        screen: {
          flex: 1,
          backgroundColor: COLORS.header,
        },

        /* ====================================================
           HEADER
        ==================================================== */

        headerContainer: {
          width: '100%',
          height: SIZES.headerHeight,

          backgroundColor: COLORS.header,

          justifyContent: 'center',

          borderBottomLeftRadius: RADIUS.header,
          borderBottomRightRadius: RADIUS.header,

          overflow: 'hidden',

          zIndex: SIZES.elevationLarge,
        },

        header: {
          flexDirection: 'row',
          alignItems: 'center',

          paddingHorizontal: horizontalPadding,

          gap: SPACING.sm,
        },

        backButton: {
          width: SIZES.backButton,
          height: SIZES.backButton,

          alignItems: 'center',
          justifyContent: 'center',
        },

        arrowIcon: {
          width: SIZES.iconSmall,
          height: SIZES.iconSmall,
        },

        headerTitle: {
          fontFamily: FONT_FAMILY.semiBold,

          fontSize: FONT_SIZE.md,
          lineHeight: LINE_HEIGHT.md,

          color: COLORS.text.primary,
        },

        /* ====================================================
           MAP AREA
        ==================================================== */

        mapArea: {
          flex: 1,

          position: 'relative',

          backgroundColor: COLORS.map.background,

          overflow: 'hidden',
        },

        /* ====================================================
           SEARCH BAR
        ==================================================== */

        searchContainer: {
          position: 'absolute',

          top: SIZES.searchBarTop,

          left: SPACING.xxl,
          right: SPACING.xxl,

          height: SIZES.searchBarHeight,

          zIndex: SIZES.zIndexOverlay,
        },

        /* ====================================================
           BOTTOM STACK
        ==================================================== */

        bottomStack: {
          position: 'absolute',

          left: SPACING.xxl,
          right: SPACING.xxl,

          bottom: SPACING.xl,

          alignItems: 'center',

          gap: SPACING.md,

          zIndex: SIZES.zIndexOverlay,
        },

        /* ====================================================
           USE CURRENT LOCATION
        ==================================================== */

        currentLocationBadge: {
          alignSelf: 'center',

          flexDirection: 'row',

          alignItems: 'center',
          justifyContent: 'center',

          backgroundColor: COLORS.map.badge,

          borderRadius: RADIUS.pill,

          paddingHorizontal: SPACING.lg,
          paddingVertical: SIZES.locationBadgePaddingVertical,

          gap: SPACING.sm,

          elevation: SIZES.elevationSmall,

          shadowColor: COLORS.black,
          shadowOpacity: SIZES.shadowOpacityLight,
          shadowRadius: SIZES.shadowRadiusSmall,

          shadowOffset: {
            width: 0,
            height: SIZES.shadowOffsetSmall,
          },
        },

        crosshairIcon: {
          width: SIZES.iconSmall,
          height: SIZES.iconSmall,
        },

        /* Figma font styling */
        locationText: {
          fontFamily: FONT_FAMILY.medium,

          fontSize: FONT_SIZE.badge,
          lineHeight: LINE_HEIGHT.badge,

          color: COLORS.black,
        },

        /* ====================================================
           ADDRESS CARD
        ==================================================== */

        addressCard: {
          width: '100%',
          height: SIZES.mapAddressCardHeight,

          backgroundColor: COLORS.orange.card,

          borderRadius: RADIUS.xxl,

          paddingHorizontal: SPACING.lg,

          paddingTop: SIZES.addressCardPaddingTop,
          paddingBottom: SPACING.md,

          gap: SPACING.sm,

          elevation: SIZES.elevationCard,

          shadowColor: COLORS.black,
          shadowOpacity: SIZES.shadowOpacityMedium,
          shadowRadius: SIZES.shadowRadiusMedium,

          shadowOffset: {
            width: 0,
            height: SIZES.shadowOffsetMedium,
          },
        },

        /* ====================================================
           DELIVERY LABEL
        ==================================================== */

        deliveryLabel: {
          fontFamily: FONT_FAMILY.medium,

          fontSize: FONT_SIZE.xxs,
          lineHeight: LINE_HEIGHT.xxs,

          color: COLORS.text.location,

          textTransform: 'uppercase',

          letterSpacing: SIZES.letterSpacingTiny,

          height: LINE_HEIGHT.xxs,
        },

        /* ====================================================
           ADDRESS DETAILS
        ==================================================== */

        addressDetailsRow: {
          flexDirection: 'row',

          alignItems: 'flex-start',

          gap: SPACING.sm,

          minHeight: SIZES.addressDetailsRowMinHeight,
        },

        pinIconBox: {
          width: SIZES.iconLarge,
          height: SIZES.iconLarge,

          alignItems: 'center',
          justifyContent: 'center',
        },

        mapPinIcon: {
          width: SIZES.iconLarge,
          height: SIZES.iconLarge,
        },

        addressTextContainer: {
          flex: 1,

          gap: SIZES.addressTextGap,

          paddingTop: SPACING.none,
        },

        shopTitle: {
          fontFamily: FONT_FAMILY.semiBold,

          fontSize: FONT_SIZE.sm,
          lineHeight: LINE_HEIGHT.cardTitle,

          color: COLORS.orange.shopTitleAccent,
        },

        addressText: {
          fontFamily: FONT_FAMILY.regular,

          fontSize: FONT_SIZE.sm,
          lineHeight: LINE_HEIGHT.sm,

          color: COLORS.black,
        },

        /* ====================================================
           ADD ADDRESS DETAILS BUTTON
        ==================================================== */

        actionButton: {
          width: '100%',
          height: SIZES.actionButtonHeight,

          backgroundColor: COLORS.orange.actionButton,

          borderRadius: RADIUS.pill,

          justifyContent: 'center',
          alignItems: 'center',

          marginTop: SPACING.none,
        },

        actionButtonText: {
          fontFamily: FONT_FAMILY.semiBold,

          fontSize: FONT_SIZE.md,
          lineHeight: LINE_HEIGHT.buttonText,

          color: COLORS.white,
        },
      }),
    [horizontalPadding],
  );

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
            <Image source={ARROW_ICON} style={styles.arrowIcon} resizeMode="contain" />
          </Pressable>

          <AppText style={styles.headerTitle}>{LOCATION_STRINGS.addAddressHeader}</AppText>
        </View>
      </View>

      {/* ======================================================
          MAP AREA
      ====================================================== */}

      <View style={styles.mapArea}>
        {/* ====================================================
            SEARCH BAR
        ==================================================== */}

        <View style={styles.searchContainer} pointerEvents="box-none">
          <HomeSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={LOCATION_STRINGS.searchPlaceholder}
            onPress={() => {}}
            onMicPress={() => {}}
          />
        </View>

        {/* ====================================================
            BOTTOM STACK
        ==================================================== */}

        <View style={styles.bottomStack} pointerEvents="box-none">
          {/* ==================================================
              USE CURRENT LOCATION
          ================================================== */}

          <Pressable style={styles.currentLocationBadge} pointerEvents="auto">
            <Image source={CROSSHAIR_ICON} style={styles.crosshairIcon} resizeMode="contain" />

            <AppText style={styles.locationText}>{LOCATION_STRINGS.useCurrentLocation}</AppText>
          </Pressable>

          {/* ==================================================
              ADDRESS CARD
          ================================================== */}

          <View style={styles.addressCard} pointerEvents="auto">
            {/* ==================================================
                DELIVERY LABEL
            ================================================== */}

            <AppText style={styles.deliveryLabel}>{LOCATION_STRINGS.deliveringYourOrderTo}</AppText>

            {/* ==================================================
                ADDRESS DETAILS
            ================================================== */}

            <View style={styles.addressDetailsRow}>
              <View style={styles.pinIconBox}>
                <Image source={MAP_PIN_ICON} style={styles.mapPinIcon} resizeMode="contain" />
              </View>

              <View style={styles.addressTextContainer}>
                <AppText style={styles.shopTitle} numberOfLines={1}>
                  {currentAddress?.title ||
                    (currentAddress as { shopName?: string } | undefined)?.shopName ||
                    'Jagadeesh shop'}
                </AppText>

                <AppText style={styles.addressText} numberOfLines={2}>
                  {currentAddress?.address || 'Bangarpet, Kolar District, Karnataka, India'}
                </AppText>
              </View>
            </View>

            {/* ==================================================
                ADD ADDRESS DETAILS
            ================================================== */}

            <AppButton
              title={LOCATION_STRINGS.addAddressDetails}
              onPress={handleAddAddressDetails}
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
