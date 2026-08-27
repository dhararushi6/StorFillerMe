import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';

import { LOCATION_STRINGS } from '@/constants/location';
// Fixed: Relative import to match your Explorer structure
import { useAddresses, type Address } from './AddressContext';

import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, FONT_SIZE } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SPACING } from '@/theme/spacing';
import { useResponsive } from '@/theme/responsive';

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
      {/* BACKDROP */}
      <Pressable style={styles.backdrop} onPress={handleBack} />

      {/* BOTTOM SHEET */}
      <View
        style={[
          styles.sheetContainer,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={handleBack} hitSlop={SPACING.md}>
              <AppIcon name="back" size="lg" color={COLORS.text.primary} />
            </Pressable>

            <AppText style={styles.headerTitleText}>{LOCATION_STRINGS.headerTitle}</AppText>
          </View>

          <Pressable onPress={handleBack} hitSlop={SPACING.md}>
            <AppIcon name="close" size="lg" color={COLORS.text.primary} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* ADD NEW ADDRESS */}
          <Pressable style={styles.addAddressRow} onPress={handleAddNewAddress}>
            <View style={styles.addAddressLeft}>
              <View style={styles.addIconBox}>
                <AppIcon name="add" size="sm" color={COLORS.text.primary} />
              </View>

              <AppText style={styles.addAddressText}>{LOCATION_STRINGS.addNewAddress}</AppText>
            </View>

            <AppIcon name="chevronRight" size="md" color={COLORS.text.secondary} />
          </Pressable>

          {/* SAVED ADDRESSES */}
          <AppText style={styles.sectionHeading}>{LOCATION_STRINGS.savedAddresses}</AppText>

          {/* ADDRESS LIST */}
          <View style={styles.addressList}>
            {addresses.map((item: Address) => (
              <View
                key={item.id}
                style={[styles.addressCard, item.isSelected && styles.selectedAddressCard]}
              >
                <Pressable style={styles.cardLeft} onPress={() => handleSelectAddress(item.id)}>
                  {/* LOCATION PIN */}
                  <View style={styles.pinIconBox}>
                    <AppIcon name="location" size="lg" color={COLORS.text.primary} />
                  </View>

                  {/* ADDRESS DETAILS */}
                  <View style={styles.addressTextContainer}>
                    {/* SHOP NAME */}
                    <AppText style={styles.shopTitle}>{item.title}</AppText>

                    {/* ADDRESS */}
                    <AppText style={styles.addressBody}>{item.address}</AppText>
                  </View>
                </Pressable>

                {/* DELETE */}
                <Pressable
                  onPress={() => handleDeleteAddress(item.id)}
                  hitSlop={SPACING.sm}
                  style={styles.deleteButton}
                >
                  <AppIcon name="delete" size="md" color={COLORS.text.primary} />
                </Pressable>
              </View>
            ))}
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
    justifyContent: 'flex-end', // Fixed typo from 'justify' to 'justifyContent'
  },

  backdrop: {
    flex: 1,
  },

  sheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    maxHeight: '85%',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  /* LOCATION TITLE */
  headerTitleText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    lineHeight: FONT_SIZE.xl * 1.6,
    letterSpacing: 0,
    color: COLORS.text.primary,
  },

  scrollContent: {
    paddingBottom: SPACING.xl,
  },

  /* ADD NEW ADDRESS */
  addAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },

  addAddressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  addIconBox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: COLORS.text.primary,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addAddressText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text.primary,
  },

  /* SAVED ADDRESSES */
  sectionHeading: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },

  addressList: {
    gap: SPACING.md,
  },

  /* ADDRESS CARD */
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  selectedAddressCard: {
    borderColor: COLORS.orange.normal,
  },

  /* CARD LEFT */
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
    paddingRight: SPACING.sm,
  },

  /* LOCATION PIN */
  pinIconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ADDRESS TEXT */
  addressTextContainer: {
    flex: 1,
    gap: SPACING.xs / 2,
  },

  /* SHOP NAME */
  shopTitle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.orange.normal,
  },

  /* ADDRESS */
  addressBody: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
  },

  /* DELETE */
  deleteButton: {
    paddingLeft: SPACING.sm,
  },
});
