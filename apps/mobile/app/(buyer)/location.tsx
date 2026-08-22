import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';

import { INITIAL_SAVED_ADDRESSES, LOCATION_STRINGS, SavedAddressItem } from '@/constants/location';

import { COLORS } from '@/theme/colors';
import { FONT_FAMILY } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SPACING } from '@/theme/spacing';
import { useResponsive } from '@/theme/responsive';
import { ICON_SIZES } from '@/theme/iconSizes';

export default function BuyerLocationScreen() {
  const { horizontalPadding } = useResponsive();

  const [addresses, setAddresses] = useState<SavedAddressItem[]>(INITIAL_SAVED_ADDRESSES);

  // Navigate back to home screen
  const handleBack = useCallback(() => {
    router.push('/(buyer)/home' as any);
  }, []);

  // Navigate to Add Address Map screen
  const handleAddNewAddress = useCallback(() => {
    router.push('/(buyer)/add-address' as any);
  }, []);

  const handleDeleteAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <View style={styles.screen}>
      {/* Translucent Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleBack} />

      {/* White Bottom Sheet */}
      <View style={[styles.sheetContainer, { paddingHorizontal: horizontalPadding }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={handleBack} hitSlop={SPACING.md}>
              <AppIcon name="back" size={ICON_SIZES.lg} color={COLORS.text.primary} />
            </Pressable>
            <AppText style={styles.headerTitleText}>{LOCATION_STRINGS.headerTitle}</AppText>
          </View>
          <Pressable onPress={handleBack} hitSlop={SPACING.md}>
            <AppIcon name="close" size={ICON_SIZES.lg} color={COLORS.text.primary} />
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
                <AppIcon name="add" size={ICON_SIZES.sm} color={COLORS.text.primary} />
              </View>
              <AppText style={styles.addAddressText}>{LOCATION_STRINGS.addNewAddress}</AppText>
            </View>
            <AppIcon name="chevronRight" size={ICON_SIZES.md} color={COLORS.text.secondary} />
          </Pressable>

          {/* SAVED ADDRESSES */}
          <AppText style={styles.sectionHeading} fontSize="sm" color={COLORS.text.secondary}>
            {LOCATION_STRINGS.savedAddresses}
          </AppText>

          {/* ADDRESS LIST */}
          <View style={styles.addressList}>
            {addresses.map((item) => (
              <View key={item.id} style={styles.addressCard}>
                <View style={styles.cardLeft}>
                  <View style={styles.pinIcon}>
                    <AppIcon name="location" size={ICON_SIZES.md} color={COLORS.orange.normal} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <AppText style={styles.shopTitle} fontSize="md">
                      {item.title}
                    </AppText>
                    <AppText style={styles.addressBody} fontSize="sm">
                      {item.address}
                    </AppText>
                  </View>
                </View>
                <Pressable
                  onPress={() => handleDeleteAddress(item.id)}
                  hitSlop={SPACING.sm}
                  style={styles.deleteButton}
                >
                  <AppIcon name="delete" size={ICON_SIZES.md} color={COLORS.text.primary} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },

  backdrop: {
    flex: 1,
  },

  sheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    maxHeight: '85%',
  },

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

  headerTitleText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 20,
    color: COLORS.text.primary,
  },

  addAddressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  addAddressText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 16,
    color: COLORS.text.primary,
  },

  scrollContent: {
    paddingBottom: SPACING.section,
  },

  addAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
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

  sectionHeading: {
    marginBottom: SPACING.md,
  },

  addressList: {
    gap: SPACING.md,
  },

  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: SPACING.sm,
    paddingRight: SPACING.sm,
  },

  pinIcon: {
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

  addressBody: {
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text.primary,
  },

  deleteButton: {
    paddingLeft: SPACING.sm,
  },
});
