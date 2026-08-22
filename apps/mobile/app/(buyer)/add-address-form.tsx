import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';

import { COLORS } from '@/theme/colors';
import { FONT_FAMILY } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';
import { useResponsive } from '@/theme/responsive';
import { ICON_SIZES } from '@/theme/iconSizes';

export default function BuyerAddAddressFormScreen() {
  const { horizontalPadding } = useResponsive();

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<'Shop' | 'Warehouse'>('Shop');

  // Check if all input fields are filled
  const isFormComplete = useMemo(() => {
    return shopName.trim() !== '' && address.trim() !== '' && landmark.trim() !== '';
  }, [shopName, address, landmark]);

  // Navigate back to the add-address (map) screen
  const handleBack = useCallback(() => {
    router.push('/(buyer)/add-address' as any);
  }, []);

  const handleSaveAddress = useCallback(() => {
    if (isFormComplete) {
      router.push('/(buyer)/location');
    }
  }, [isFormComplete]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* HEADER */}
      <View style={[styles.headerContainer, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={SPACING.md}>
            <AppIcon name="back" size={ICON_SIZES.lg} color={COLORS.text.primary} />
          </Pressable>
          <AppText style={styles.headerTitle} fontSize="lg">
            Add Address
          </AppText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
        bounces={false}
      >
        <AppText style={styles.sectionHeading} fontSize="xl">
          Edit Address
        </AppText>

        {/* Shop Name Field */}
        <View style={styles.inputGroup}>
          <AppText style={styles.label} fontSize="sm">
            Shop Name
          </AppText>
          <TextInput
            style={styles.textInput}
            placeholder=""
            value={shopName}
            onChangeText={setShopName}
            placeholderTextColor={COLORS.text.secondary}
          />
        </View>

        {/* Address Field */}
        <View style={styles.inputGroup}>
          <AppText style={styles.label} fontSize="sm">
            Address
          </AppText>
          <TextInput
            style={styles.textInput}
            placeholder="House / Shop No. / Street / Area / PIN Code"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={COLORS.text.secondary}
          />
        </View>

        {/* Delivery Details / Landmark Field */}
        <View style={styles.inputGroup}>
          <AppText style={styles.label} fontSize="sm">
            Delivery Details
          </AppText>
          <TextInput
            style={styles.textInput}
            placeholder="Landmark"
            value={landmark}
            onChangeText={setLandmark}
            placeholderTextColor={COLORS.text.secondary}
          />
        </View>

        {/* Address Type Selector */}
        <View style={styles.inputGroup}>
          <AppText style={styles.label} fontSize="sm">
            Address Type
          </AppText>
          <View style={styles.typeRow}>
            <Pressable
              style={[
                styles.typeCard,
                addressType === 'Shop' ? styles.typeCardSelected : styles.typeCardUnselected,
              ]}
              onPress={() => setAddressType('Shop')}
            >
              <AppIcon name="store" size={ICON_SIZES.xxl} color={COLORS.text.primary} />
              <AppText style={styles.typeText} fontSize="md">
                Shop
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.typeCard,
                addressType === 'Warehouse' ? styles.typeCardSelected : styles.typeCardUnselected,
              ]}
              onPress={() => setAddressType('Warehouse')}
            >
              <AppIcon name="warehouse" size={ICON_SIZES.xxl} color={COLORS.text.primary} />
              <AppText style={styles.typeText} fontSize="md">
                Warehouse
              </AppText>
            </Pressable>
          </View>
        </View>

        {/* Save Address Button */}
        <AppButton
          title="Save Address"
          onPress={handleSaveAddress}
          style={[styles.saveButton, isFormComplete && styles.saveButtonActive]}
          textStyle={[styles.saveButtonText, isFormComplete && styles.saveButtonTextActive]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF6EE',
  },
  headerContainer: {
    backgroundColor: '#FAE2BB',
    height: SIZES.headerHeight,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FONT_FAMILY.semiBold,
  },
  scrollContent: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.xl,
  },
  sectionHeading: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.text.primary,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text.primary,
  },
  textInput: {
    height: SIZES.inputHeight,
    borderBottomWidth: SIZES.borderThin,
    borderBottomColor: COLORS.text.secondary,
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    color: COLORS.text.primary,
    paddingBottom: SPACING.xs,
  },
  typeRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  typeCard: {
    width: 125,
    height: 105,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  typeCardSelected: {
    backgroundColor: '#F7DDB2',
  },
  typeCardUnselected: {
    backgroundColor: '#EFE3D5',
  },
  typeText: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text.primary,
  },
  saveButton: {
    alignSelf: 'stretch',
    backgroundColor: '#E3C1B0',
    borderRadius: RADIUS.lg,
    height: 52,
    marginTop: SPACING.lg,
  },
  saveButtonActive: {
    backgroundColor: COLORS.orange.normal,
  },
  saveButtonText: {
    color: COLORS.text.primary,
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16,
  },
  saveButtonTextActive: {
    color: COLORS.surface,
  },
});
