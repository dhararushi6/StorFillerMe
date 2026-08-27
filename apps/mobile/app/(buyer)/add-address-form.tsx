import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/ui/AppButton';

// 1. Import useAddresses context hook
import { useAddresses } from './AddressContext';

import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';
import { useResponsive } from '@/theme/responsive';

type AddressType = 'Shop' | 'Warehouse';

export default function BuyerAddAddressFormScreen() {
  const { horizontalPadding } = useResponsive();

  // 2. Consume addAddress function
  const { addAddress } = useAddresses();

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<AddressType>('Shop');

  const isFormComplete = useMemo(() => {
    return shopName.trim() !== '' && address.trim() !== '' && landmark.trim() !== '';
  }, [shopName, address, landmark]);

  const handleBack = useCallback(() => {
    router.push('/(buyer)/add-address' as any);
  }, []);

  const handleSaveAddress = useCallback(() => {
    if (isFormComplete) {
      // 3. Dispatch the new address object into context state before navigating
      addAddress({
        id: Date.now().toString(),
        title: shopName.trim(),
        address: `${address.trim()} (${landmark.trim()})`,
        isSelected: true,
      });

      router.push('/(buyer)/location');
    }
  }, [isFormComplete, shopName, address, landmark, addAddress]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={SPACING.md}>
            <AppIcon name="back" size="md" color={COLORS.text.primary} />
          </Pressable>
          <AppText style={styles.headerTitle}>Add Address</AppText>
        </View>
      </View>

      {/* Main Screen Layout */}
      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <AppText style={styles.sectionHeading}>Edit Address</AppText>

          <View style={styles.inputGroup}>
            <AppText style={styles.label}>Shop Name</AppText>
            <TextInput
              style={styles.textInput}
              value={shopName}
              onChangeText={setShopName}
              placeholder="Enter shop name"
              placeholderTextColor={COLORS.text.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <AppText style={styles.label}>Address</AppText>
            <TextInput
              style={styles.textInput}
              value={address}
              onChangeText={setAddress}
              placeholder="House / Shop No. / Street / Area / PIN Code"
              placeholderTextColor={COLORS.text.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <AppText style={styles.label}>Delivery Details</AppText>
            <TextInput
              style={styles.textInput}
              value={landmark}
              onChangeText={setLandmark}
              placeholder="Landmark"
              placeholderTextColor={COLORS.text.secondary}
            />
          </View>

          {/* Address Type Selector */}
          <View style={styles.inputGroup}>
            <AppText style={styles.label}>Address Type</AppText>
            <View style={styles.typeRow}>
              <Pressable
                style={[
                  styles.typeCard,
                  addressType === 'Shop' ? styles.typeCardSelected : styles.typeCardUnselected,
                ]}
                onPress={() => setAddressType('Shop')}
              >
                <AppIcon name="store" size="xxl" color={COLORS.text.primary} />
                <AppText style={styles.typeText}>Shop</AppText>
              </Pressable>

              <Pressable
                style={[
                  styles.typeCard,
                  addressType === 'Warehouse' ? styles.typeCardSelected : styles.typeCardUnselected,
                ]}
                onPress={() => setAddressType('Warehouse')}
              >
                <AppIcon name="warehouse" size="xxl" color={COLORS.text.primary} />
                <AppText style={styles.typeText}>Warehouse</AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Container */}
        <View style={[styles.bottomContainer, { paddingHorizontal: horizontalPadding }]}>
          <AppButton
            title="Save Address"
            onPress={handleSaveAddress}
            disabled={!isFormComplete}
            style={[styles.saveButton, isFormComplete && styles.saveButtonActive]}
            textStyle={[styles.saveButtonText, isFormComplete && styles.saveButtonTextActive]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.orange.card,
    height: SIZES.headerHeight,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.text.primary,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.xl,
  },
  sectionHeading: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.text.primary,
  },
  textInput: {
    height: SIZES.inputHeight,
    borderWidth: 0,
    borderBottomWidth: SIZES.borderThin,
    borderBottomColor: COLORS.border,
    borderRadius: 0,
    paddingHorizontal: 0,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.xs,
    color: COLORS.text.primary,
    paddingBottom: SPACING.xs,
    outlineStyle: 'none',
  } as any,
  typeRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  typeCard: {
    width: 120,
    height: 105,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  typeCardSelected: {
    backgroundColor: COLORS.orange.card,
  },
  typeCardUnselected: {
    backgroundColor: COLORS.yellow.normal,
  },
  typeText: {
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.sm,
  },
  bottomContainer: {
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  saveButton: {
    alignSelf: 'stretch',
    height: 45,
    borderRadius: 8,
    backgroundColor: COLORS.orange.lightActive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonActive: {
    backgroundColor: COLORS.orange.normal,
  },
  saveButtonText: {
    color: COLORS.text.primary,
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md,
  },
  saveButtonTextActive: {
    color: COLORS.surface,
  },
});
