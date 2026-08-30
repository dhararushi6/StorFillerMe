import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';
import { useResponsive } from '@/theme/responsive';

import { useAddresses } from './AddressContext';

type AddressType = 'Shop' | 'Warehouse';

/* ============================================================
   FIGMA ICONS
============================================================ */

import ARROW_ICON from '@/assets/icons/Arrow 10.png';
import SHOP_ICON from '@/assets/icons/storefront (2) 1.png';
import WAREHOUSE_ICON from '@/assets/icons/warehouse 1.png';

/* ============================================================
   CUSTOM INPUT
============================================================ */

interface CustomTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

function CustomTextInput({ label, value, onChangeText, placeholder }: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const showPlaceholder = value.length === 0 && !isFocused;

  return React.createElement(
    View,
    { style: styles.inputGroup },

    React.createElement(Text, { style: styles.label }, label),

    React.createElement(
      View,
      { style: styles.inputWrapper },

      React.createElement(TextInput, {
        style: styles.textInput,
        value,
        onChangeText,
        placeholder: '',
        underlineColorAndroid: 'transparent',
        cursorColor: COLORS.text.location,
        selectionColor: COLORS.text.location,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
      }),

      showPlaceholder
        ? React.createElement(
            Text,
            {
              style: styles.customPlaceholder,
              pointerEvents: 'none',
            },
            placeholder,
          )
        : null,
    ),
  );
}

/* ============================================================
   SCREEN
============================================================ */

export default function BuyerAddAddressFormScreen() {
  const { horizontalPadding } = useResponsive();

  const { addAddress } = useAddresses();

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<AddressType>('Shop');

  const isFormComplete = useMemo(() => {
    return shopName.trim().length > 0 && address.trim().length > 0 && landmark.trim().length > 0;
  }, [shopName, address, landmark]);

  const handleBack = useCallback(() => {
    router.push('/(buyer)/add-address' as any);
  }, []);

  const handleSaveAddress = useCallback(() => {
    if (!isFormComplete) {
      return;
    }

    /*
      Store only shop name + address in AddressContext —
      the location list and map card show just these two
      fields, so the landmark ("Delivery Details") is kept
      out of the stored address text.
    */

    addAddress({
      id: Date.now().toString(),
      title: shopName.trim(),
      address: address.trim(),
      isSelected: true,
      type: addressType,
    } as any);

    router.push('/(buyer)/location');
  }, [isFormComplete, shopName, address, landmark, addressType, addAddress]);

  return React.createElement(
    SafeAreaView,
    {
      style: styles.screen,
      edges: ['top', 'bottom'],
    },

    /* ========================================================
       HEADER
    ======================================================== */

    React.createElement(
      View,
      {
        style: [
          styles.headerContainer,
          {
            paddingHorizontal: horizontalPadding,
          },
        ],
      },

      React.createElement(
        View,
        { style: styles.header },

        React.createElement(
          Pressable,
          {
            onPress: handleBack,
            hitSlop: SPACING.md,
            style: styles.backButton,
          },

          React.createElement(Image, {
            source: ARROW_ICON,
            style: styles.arrowIcon,
            resizeMode: 'contain',
          }),
        ),

        React.createElement(Text, { style: styles.headerTitle }, 'Add Address'),
      ),
    ),

    /* ========================================================
       BODY
    ======================================================== */

    React.createElement(
      View,
      { style: styles.body },

      React.createElement(
        ScrollView,
        {
          showsVerticalScrollIndicator: false,
          contentContainerStyle: [
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
            },
          ],
          bounces: false,
          keyboardShouldPersistTaps: 'handled',
        },

        React.createElement(Text, { style: styles.sectionHeading }, 'Edit Address'),

        React.createElement(CustomTextInput, {
          label: 'Shop Name',
          value: shopName,
          onChangeText: setShopName,
          placeholder: 'Enter shop name',
        }),

        React.createElement(CustomTextInput, {
          label: 'Address',
          value: address,
          onChangeText: setAddress,
          placeholder: 'House / Shop No. / Street / Area / PIN Code',
        }),

        React.createElement(CustomTextInput, {
          label: 'Delivery Details',
          value: landmark,
          onChangeText: setLandmark,
          placeholder: 'Landmark',
        }),

        /* ====================================================
           ADDRESS TYPE
        ==================================================== */

        React.createElement(
          View,
          { style: styles.inputGroup },

          React.createElement(Text, { style: styles.label }, 'Address Type'),

          React.createElement(
            View,
            { style: styles.typeRow },

            /* SHOP */

            React.createElement(
              Pressable,
              {
                style: [
                  styles.typeCard,
                  addressType === 'Shop' ? styles.typeCardShopSelected : styles.typeCardUnselected,
                ],
                onPress: () => setAddressType('Shop'),
              },

              React.createElement(Image, {
                source: SHOP_ICON,
                style: styles.typeIcon,
                resizeMode: 'contain',
              }),

              React.createElement(Text, { style: styles.typeText }, 'Shop'),
            ),

            /* WAREHOUSE */

            React.createElement(
              Pressable,
              {
                style: [
                  styles.typeCard,
                  addressType === 'Warehouse'
                    ? styles.typeCardWarehouseSelected
                    : styles.typeCardUnselected,
                ],
                onPress: () => setAddressType('Warehouse'),
              },

              React.createElement(Image, {
                source: WAREHOUSE_ICON,
                style: styles.typeIcon,
                resizeMode: 'contain',
              }),

              React.createElement(Text, { style: styles.typeText }, 'Warehouse'),
            ),
          ),
        ),
      ),

      /* ======================================================
         SAVE BUTTON
      ====================================================== */

      React.createElement(
        View,
        {
          style: [
            styles.bottomContainer,
            {
              paddingHorizontal: horizontalPadding,
            },
          ],
        },

        React.createElement(
          Pressable,
          {
            onPress: handleSaveAddress,
            disabled: !isFormComplete,
            style: [styles.saveButton, isFormComplete ? styles.saveButtonActive : null],
          },

          React.createElement(
            Text,
            {
              style: [styles.saveButtonText, isFormComplete ? styles.saveButtonTextActive : null],
            },
            'Save Address',
          ),
        ),
      ),
    ),
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headerContainer: {
    height: SIZES.headerHeight,
    backgroundColor: COLORS.header,
    justifyContent: 'center',
    borderBottomLeftRadius: RADIUS.header,
    borderBottomRightRadius: RADIUS.header,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
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

  body: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.none,
    gap: SPACING.xl,
  },

  sectionHeading: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
    color: COLORS.text.primary,
  },

  inputGroup: {
    gap: SPACING.sm,
  },

  label: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.label,
    color: COLORS.text.primary,
  },

  /* ========================================================
     INPUT LINE
  ======================================================== */

  inputWrapper: {
    position: 'relative',
    width: '100%',
    height: SIZES.inputUnderlineHeight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.text.location,
    borderStyle: 'solid',
  },

  textInput: {
    width: '100%',
    height: SIZES.inputUnderlineHeight,
    borderWidth: 0,
    borderRadius: 0,

    paddingHorizontal: 0,

    /*
      Keeps typed text vertically aligned with
      the underline.
    */
    paddingTop: SIZES.inputPaddingTop,
    paddingBottom: 0,

    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,

    color: COLORS.text.primary,
    backgroundColor: 'transparent',

    outlineStyle: 'none',
  } as any,

  customPlaceholder: {
    position: 'absolute',
    left: 0,
    right: 0,

    top: SIZES.inputPlaceholderTop,

    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,

    color: COLORS.text.secondary,

    pointerEvents: 'none',
  },

  /* ========================================================
     ADDRESS TYPE
  ======================================================== */

  typeRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },

  typeCard: {
    width: SIZES.addressTypeCardWidth,
    height: SIZES.addressTypeCardHeight,

    paddingTop: SIZES.addressTypePaddingTop,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,

    borderRadius: RADIUS.xl,

    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  typeCardShopSelected: {
    backgroundColor: COLORS.orange.card,
  },

  typeCardWarehouseSelected: {
    backgroundColor: COLORS.cart.couponCard,
  },

  typeCardUnselected: {
    backgroundColor: COLORS.orange.typeUnselected,
  },

  typeIcon: {
    width: SIZES.addressTypeIcon,
    height: SIZES.addressTypeIcon,
  },

  typeText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.typeText,
    fontWeight: '400',
    color: COLORS.black,
  },

  /* ========================================================
     SAVE BUTTON
  ======================================================== */

  bottomContainer: {
    paddingTop: SPACING.none,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },

  saveButton: {
    alignSelf: 'stretch',
    height: SIZES.saveButtonHeight,
    borderRadius: RADIUS.md,

    backgroundColor: COLORS.orange.lightActive,

    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonActive: {
    backgroundColor: COLORS.orange.normal,
  },

  saveButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.text.primary,
  },

  saveButtonTextActive: {
    color: COLORS.surface,
  },
});
