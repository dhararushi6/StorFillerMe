import { StyleSheet } from 'react-native';
import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT_MULTIPLIER } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';
import { ICON_SIZES } from '@/theme/iconSizes';

// ──────────────────────────────────────────────
// 1. Types
// ──────────────────────────────────────────────

export interface NotificationRowConfig {
  id: 'orderUpdates' | 'cropAdvisoryAlerts' | 'offersAndPromotions' | 'walletUpdates';
  title: string;
  subtitle: string;
  defaultValue: boolean;
}

export interface NotificationSettingsState {
  orderUpdates: boolean;
  cropAdvisoryAlerts: boolean;
  offersAndPromotions: boolean;
  walletUpdates: boolean;
}

// ──────────────────────────────────────────────
// 2. Strings & Routes
// ──────────────────────────────────────────────

export const NOTIFICATION_STRINGS = {
  headerTitle: 'Notifications',
  sectionSubtitle: 'Choose what you want to be notified about',
  saveButtonText: 'Save Changes',
  routes: {
    // Back caret on this screen goes to Account settings
    accountSettings: '/(buyer)/accountsettings',
  },
} as const;

export const NOTIFICATION_ROWS: NotificationRowConfig[] = [
  {
    id: 'orderUpdates',
    title: 'Order Updates',
    subtitle: 'Get updates about your orders',
    defaultValue: true,
  },
  {
    id: 'cropAdvisoryAlerts',
    title: 'Crop Advisory Alerts',
    subtitle: 'Important advisory and tips',
    defaultValue: true,
  },
  {
    id: 'offersAndPromotions',
    title: 'Offers & Promotions',
    subtitle: 'Discounts and special offers',
    defaultValue: true,
  },
  {
    id: 'walletUpdates',
    title: 'Wallet Updates',
    subtitle: 'Transactions and wallet updates',
    defaultValue: false,
  },
];

// ──────────────────────────────────────────────
// 3. Toggle geometry (derived, used by the ToggleSwitch component)
// ──────────────────────────────────────────────

export const TOGGLE_GEOMETRY = {
  trackWidth: SIZES.toggleTrackWidth,
  trackHeight: SIZES.toggleTrackHeight,
  knobSize: SIZES.toggleKnobSize,
  knobMargin: SIZES.toggleKnobMargin,
  get knobTravel() {
    return this.trackWidth - this.knobSize - this.knobMargin * 2;
  },
};

// ──────────────────────────────────────────────
// 4. Style Factory
// ──────────────────────────────────────────────

export const getNotificationStyles = (horizontalPadding: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.surface,
    },

    header: {
      width: '100%',
      height: SIZES.notificationHeaderHeight,
      backgroundColor: COLORS.orange.normal,
      borderBottomLeftRadius: RADIUS.header,
      borderBottomRightRadius: RADIUS.header,
      paddingHorizontal: horizontalPadding,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },

    backButton: {
      position: 'absolute',
      left: horizontalPadding,
      top: 0,
      bottom: 0,
      width: SIZES.notificationBackButton,
      justifyContent: 'center',
      alignItems: 'center',
    },

    backIcon: {
      width: ICON_SIZES.xxxl,
      height: ICON_SIZES.xxxl,
      tintColor: COLORS.white,
    },

    headerTitle: {
      color: COLORS.white,
      fontFamily: FONT_FAMILY.semiBold,
      fontWeight: FONT_WEIGHT.semiBold,
      fontSize: FONT_SIZE.md,
      textAlign: 'center',
    },

    scroll: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: horizontalPadding,
      paddingTop: SPACING.none,
      paddingBottom: SPACING.xxl,
    },

    sectionSubtitle: {
      width: '100%',
      marginTop: SPACING.xl,
      marginBottom: SPACING.md,
      fontFamily: FONT_FAMILY.semiBold,
      fontWeight: FONT_WEIGHT.semiBold,
      fontSize: FONT_SIZE.lg,
      lineHeight: FONT_SIZE.lg * LINE_HEIGHT_MULTIPLIER,
      letterSpacing: 0,
      color: COLORS.text.tertiary,
      textAlign: 'left',
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: SPACING.gap17,
    },

    rowTextContainer: {
      flex: 1,
      paddingRight: SPACING.lg,
    },

    rowTitle: {
      fontFamily: FONT_FAMILY.semiBold,
      fontWeight: FONT_WEIGHT.semiBold,
      fontSize: FONT_SIZE.md,
      lineHeight: FONT_SIZE.md * LINE_HEIGHT_MULTIPLIER,
      letterSpacing: 0,
      color: COLORS.black,
      marginBottom: SPACING.xs,
    },

    rowSubtitle: {
      fontFamily: FONT_FAMILY.regular,
      fontWeight: FONT_WEIGHT.regular,
      fontSize: FONT_SIZE.sm,
      lineHeight: FONT_SIZE.sm * LINE_HEIGHT_MULTIPLIER,
      letterSpacing: 0,
      color: COLORS.black,
    },

    toggleTrack: {
      width: TOGGLE_GEOMETRY.trackWidth,
      height: TOGGLE_GEOMETRY.trackHeight,
      borderRadius: RADIUS.pill,
      padding: TOGGLE_GEOMETRY.knobMargin,
      justifyContent: 'center',
    },

    toggleKnob: {
      width: TOGGLE_GEOMETRY.knobSize,
      height: TOGGLE_GEOMETRY.knobSize,
      borderRadius: RADIUS.pill,
      backgroundColor: COLORS.white,
    },

    saveButtonContainer: {
      paddingHorizontal: horizontalPadding,
      paddingBottom: SPACING.xl,
      paddingTop: SPACING.sm,
      alignItems: 'center',
    },

    saveButton: {
      width: '100%',
      height: SIZES.saveButtonHeight,
      backgroundColor: COLORS.orange.normal,
      borderRadius: RADIUS.md,
      justifyContent: 'center',
      alignItems: 'center',
    },

    saveButtonText: {
      color: COLORS.white,
      fontFamily: FONT_FAMILY.regular,
      fontWeight: FONT_WEIGHT.regular,
      fontSize: FONT_SIZE.extraLarge,
      textAlign: 'center',
    },
  });
