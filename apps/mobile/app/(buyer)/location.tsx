import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/common/AppText';
import { LOCATION_STRINGS } from '@/constants/location';
import { useAddresses, type Address } from './AddressContext';

import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';
import { useResponsive } from '@/theme/responsive';

/* ============================================================
   FIGMA ICONS
============================================================ */

import ArrowIcon from '../../assets/icons/Arrow 10.png';
import CaretRightIcon from '../../assets/icons/caret-right (1) 13.png';
import MapPinIcon from '../../assets/icons/map-pin (4) 5.png';
import CloseIcon from '../../assets/icons/x 1 (1).png';
import PlusSquareIcon from '../../assets/icons/plus-square (1) 1.png';
import TrashIcon from '../../assets/icons/trash 2.png';

export default function BuyerLocationScreen() {
  const { horizontalPadding } = useResponsive();

  const { addresses, removeAddress, selectAddress } = useAddresses();

  const handleBack = useCallback(() => {
    router.push('/(buyer)/home' as any);
  }, []);

  const handleAddNewAddress = useCallback(() => {
    router.push('/(buyer)/add-address' as any);
  }, []);

  const handleDeleteAddress = useCallback(
    (id: string) => {
      removeAddress(id);
    },
    [removeAddress],
  );

  const handleSelectAddress = useCallback(
    (id: string) => {
      selectAddress(id);
      router.push('/(buyer)/home' as any);
    },
    [selectAddress],
  );

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backdrop} onPress={handleBack} />
      <View style={[styles.sheetContainer, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={handleBack} hitSlop={SPACING.md} style={styles.headerIconButton}>
              <Image source={ArrowIcon} style={styles.backIcon} />
            </Pressable>
            <AppText style={styles.headerTitleText}>{LOCATION_STRINGS.headerTitle}</AppText>
          </View>
          <Pressable onPress={handleBack} hitSlop={SPACING.md} style={styles.headerIconButton}>
            <Image source={CloseIcon} style={styles.closeIcon} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <Pressable style={styles.addAddressRow} onPress={handleAddNewAddress}>
            <View style={styles.addAddressLeft}>
              <View style={styles.addIconBox}>
                <Image source={PlusSquareIcon} style={styles.plusIcon} />
              </View>
              <AppText style={styles.addAddressText}>{LOCATION_STRINGS.addNewAddress}</AppText>
            </View>
            <Image source={CaretRightIcon} style={styles.caretRightIcon} />
          </Pressable>

          <AppText style={styles.sectionHeading}>{LOCATION_STRINGS.savedAddresses}</AppText>

          <View style={styles.addressList}>
            {addresses.length === 0 ? (
              <AppText style={styles.emptyText}>No saved addresses. Add one now!</AppText>
            ) : (
              addresses.map((item: Address) => (
                <View
                  key={item.id}
                  style={[styles.addressCard, item.isSelected && styles.selectedAddressCard]}
                >
                  <Pressable style={styles.cardLeft} onPress={() => handleSelectAddress(item.id)}>
                    <View style={styles.pinIconBox}>
                      <Image source={MapPinIcon} style={styles.mapPinIcon} />
                    </View>
                    <View style={styles.addressTextContainer}>
                      <AppText style={styles.shopTitle}>{item.title}</AppText>
                      <AppText style={styles.addressBody}>{item.address}</AppText>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteAddress(item.id)}
                    hitSlop={SPACING.sm}
                    style={styles.deleteButton}
                  >
                    <Image source={TrashIcon} style={styles.trashIcon} />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.none,
    borderTopRightRadius: RADIUS.none,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxxl,
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: SIZES.iconSmall,
    height: SIZES.iconSmall,
    tintColor: COLORS.text.primary,
    resizeMode: 'contain',
  },
  closeIcon: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
    resizeMode: 'contain',
  },
  headerTitleText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.text.primary,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  addAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  addAddressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  addIconBox: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
    resizeMode: 'contain',
  },
  addAddressText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
    color: COLORS.text.primary,
  },
  caretRightIcon: {
    width: SIZES.iconLarge,
    height: SIZES.iconLarge,
    resizeMode: 'contain',
  },
  sectionHeading: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.xs,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  addressList: {
    gap: SPACING.md,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.xs,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: SIZES.addressCardHeight,
  },
  selectedAddressCard: {
    borderColor: COLORS.orange.normal,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  pinIconBox: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinIcon: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
    resizeMode: 'contain',
  },
  addressTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  shopTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.xs,
    color: COLORS.orange.normal,
  },
  addressBody: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.xs,
    color: COLORS.text.primary,
  },
  deleteButton: {
    paddingLeft: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashIcon: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
    resizeMode: 'contain',
  },
  emptyText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
