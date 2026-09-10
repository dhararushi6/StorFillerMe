import { StyleSheet } from 'react-native';
import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';

// ──────────────────────────────────────────────
// 1. Interfaces & Types
// ──────────────────────────────────────────────

export interface SavedAddressItem {
  id: string;
  title: string;
  address: string;
  isSelected?: boolean;
}

export type AddressType = 'Shop' | 'Warehouse';

export interface Address extends SavedAddressItem {
  pincode?: string;
  type?: AddressType;
}

// ──────────────────────────────────────────────
// 2. All Strings
// ──────────────────────────────────────────────

export const LOCATION_STRINGS = {
  headerTitle: 'Location',
  addNewAddress: 'Add New Address',
  savedAddresses: 'Saved addresses',
  addAddressHeader: 'Add Address',
  searchPlaceholder: 'Search for address',
  useCurrentLocation: 'Use current location',
  deliveringYourOrderTo: 'DELIVERING YOUR ORDER TO',
  addAddressDetails: 'Add address details',
  editAddress: 'Edit Address',
  shopNameLabel: 'Shop Name',
  shopNamePlaceholder: 'Enter shop name',
  addressLabel: 'Address',
  addressPlaceholder: 'House / Shop No. / Street / Area',
  pincodeLabel: 'Pincode',
  pincodePlaceholder: 'Enter PIN Code',
  deliveryDetailsLabel: 'Delivery Details',
  deliveryDetailsPlaceholder: 'Landmark (optional)',
  addressTypeLabel: 'Address Type',
  saveAddress: 'Save Address',
  routes: {
    home: '/(buyer)/home',
    location: '/(buyer)/location',
    addAddress: '/(buyer)/locationaddress',
    addAddressForm: '/(buyer)/locationaddressform',
  },
} as const;

// ──────────────────────────────────────────────
// 3. Static Data
// ──────────────────────────────────────────────

export const ADDRESS_TYPES: readonly AddressType[] = ['Shop', 'Warehouse'] as const;
export const INITIAL_SAVED_ADDRESSES: SavedAddressItem[] = [];

// ──────────────────────────────────────────────
// 4. Helpers
// ──────────────────────────────────────────────

export const createSavedAddress = (
  title: string,
  addressDetails: string,
  landmark?: string,
): SavedAddressItem => {
  const formattedAddress = landmark?.trim()
    ? `${addressDetails.trim()}, Near ${landmark.trim()}`
    : addressDetails.trim();
  return {
    id: Date.now().toString(),
    title: title.trim(),
    address: formattedAddress,
    isSelected: true,
  };
};

// ──────────────────────────────────────────────
// 5. Style Factories
// ──────────────────────────────────────────────

export const getAddAddressStyles = (horizontalPadding: number) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.header },
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
    arrowIcon: { width: SIZES.iconSmall, height: SIZES.iconSmall },
    headerTitle: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZE.md,
      lineHeight: LINE_HEIGHT.md,
      color: COLORS.text.primary,
    },
    mapArea: {
      flex: 1,
      position: 'relative',
      backgroundColor: COLORS.map.background,
      overflow: 'hidden',
    },
    searchContainer: {
      position: 'absolute',
      top: SIZES.searchBarTop,
      left: SPACING.xxl,
      right: SPACING.xxl,
      height: SIZES.searchBarHeight,
      zIndex: SIZES.zIndexOverlay,
    },
    bottomStack: {
      position: 'absolute',
      left: SPACING.xxl,
      right: SPACING.xxl,
      bottom: SPACING.xl,
      alignItems: 'center',
      gap: SPACING.md,
      zIndex: SIZES.zIndexOverlay,
    },
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
      shadowOffset: { width: 0, height: SIZES.shadowOffsetSmall },
    },
    crosshairIcon: { width: SIZES.iconSmall, height: SIZES.iconSmall },
    locationText: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZE.badge,
      lineHeight: LINE_HEIGHT.badge,
      color: COLORS.black,
    },
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
      shadowOffset: { width: 0, height: SIZES.shadowOffsetMedium },
    },
    deliveryLabel: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZE.xxs,
      lineHeight: LINE_HEIGHT.xxs,
      color: COLORS.text.location,
      textTransform: 'uppercase',
      letterSpacing: SIZES.letterSpacingTiny,
      height: LINE_HEIGHT.xxs,
    },
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
    mapPinIcon: { width: SIZES.iconLarge, height: SIZES.iconLarge },
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
  });

export const getAddAddressFormStyles = (horizontalPadding: number) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.background },
    headerContainer: {
      height: SIZES.headerHeight,
      backgroundColor: COLORS.header,
      justifyContent: 'center',
      borderBottomLeftRadius: RADIUS.header,
      borderBottomRightRadius: RADIUS.header,
      paddingHorizontal: horizontalPadding,
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
    arrowIcon: { width: SIZES.iconSmall, height: SIZES.iconSmall },
    headerTitle: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZE.md,
      lineHeight: LINE_HEIGHT.md,
      color: COLORS.text.primary,
    },
    body: { flex: 1 },
    scrollContent: {
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.none,
      gap: SPACING.xl,
      paddingHorizontal: horizontalPadding,
    },
    sectionHeading: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZE.xl,
      lineHeight: LINE_HEIGHT.xl,
      color: COLORS.text.primary,
    },
    inputGroup: { gap: SPACING.sm },
    label: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZE.md,
      lineHeight: LINE_HEIGHT.label,
      color: COLORS.text.primary,
    },
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
    rowContainer: {
      flexDirection: 'row',
      gap: SPACING.md,
      alignItems: 'flex-start',
    },
    addressColumn: { flex: 2, gap: SPACING.sm },
    pincodeColumn: { flex: 1, gap: SPACING.sm },
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
    typeCardShopSelected: { backgroundColor: COLORS.orange.card },
    typeCardWarehouseSelected: { backgroundColor: COLORS.orange.card },
    typeCardUnselected: { backgroundColor: COLORS.orange.typeUnselected },
    typeIcon: { width: SIZES.addressTypeIcon, height: SIZES.addressTypeIcon },
    typeText: {
      fontFamily: FONT_FAMILY.regular,
      fontSize: FONT_SIZE.lg,
      lineHeight: LINE_HEIGHT.typeText,
      fontWeight: '400',
      color: COLORS.black,
    },
    bottomContainer: {
      paddingTop: SPACING.none,
      paddingBottom: SPACING.md,
      backgroundColor: COLORS.background,
      paddingHorizontal: horizontalPadding,
    },
    saveButton: {
      alignSelf: 'stretch',
      height: SIZES.saveButtonHeight,
      borderRadius: RADIUS.md,
      backgroundColor: COLORS.orange.disabledButtonBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButtonActive: { backgroundColor: COLORS.orange.normal },
    saveButtonText: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZE.md,
      lineHeight: LINE_HEIGHT.md,
      color: COLORS.text.primary,
    },
    saveButtonTextActive: { color: COLORS.surface },
  });

export const getLocationStyles = (horizontalPadding: number) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'flex-end' },
    backdrop: { flex: 1 },
    sheetContainer: {
      backgroundColor: COLORS.surface,
      borderTopLeftRadius: RADIUS.none,
      borderTopRightRadius: RADIUS.none,
      paddingTop: SPACING.sm,
      paddingBottom: SPACING.xxxl,
      maxHeight: '60%',
      paddingHorizontal: horizontalPadding,
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
    scrollContent: { paddingBottom: SPACING.xxxl },
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
    addressList: { gap: SPACING.md },
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
    selectedAddressCard: { borderColor: COLORS.orange.normal },
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
    addressTextContainer: { flex: 1, justifyContent: 'center' },
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
