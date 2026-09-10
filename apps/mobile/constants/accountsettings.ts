import { StyleSheet } from 'react-native';
import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';
import { ICON_SIZES } from '@/theme/iconSizes';

// ──────────────────────────────────────────────
// 1. Types
// ──────────────────────────────────────────────

export interface AccountSettingItemConfig {
  id: 'notifications' | 'privacyPolicy' | 'termsAndConditions';
  title: string;
  subtitle: string;
}

// ──────────────────────────────────────────────
// 2. Strings & Routes
// ──────────────────────────────────────────────

export const ACCOUNT_SETTINGS_STRINGS = {
  headerTitle: 'Account settings',
  sectionTitle: 'Privacy, security and account preferences',
  helpTitle: 'Need Help?',
  helpSubtitle: 'Our support team is here to help you',
  contactText: 'Contact Support',
  routes: {
    profile: '/(buyer)/profile',
    notifications: '/(buyer)/notification',
    privacyPolicy: '/(buyer)/PrivacyPolicy',
    termsAndConditions: '/(buyer)/terms-and-conditions',
    support: '/(buyer)/support',
  },
} as const;

export const ACCOUNT_SETTINGS_ITEMS: AccountSettingItemConfig[] = [
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Manage your notification preferences',
  },
  {
    id: 'privacyPolicy',
    title: 'Privacy Policy',
    subtitle: 'Learn how we collect and use your data',
  },
  {
    id: 'termsAndConditions',
    title: 'Terms & Conditions',
    subtitle: 'Read our terms and conditions',
  },
];

// ──────────────────────────────────────────────
// 3. Style Factory
// ──────────────────────────────────────────────

interface ResponsiveHelpers {
  horizontalPadding: number;
  verticalScale: (size: number) => number;
  moderateScale: (size: number) => number;
}

export const getAccountSettingsStyles = ({
  horizontalPadding,
  verticalScale,
  moderateScale,
}: ResponsiveHelpers) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.surface,
    },

    header: {
      width: '100%',
      height: verticalScale(SIZES.accountHeaderHeight),
      backgroundColor: COLORS.orange.normal,
      borderBottomLeftRadius: RADIUS.header,
      borderBottomRightRadius: RADIUS.header,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: horizontalPadding,
    },

    backButton: {
      width: moderateScale(SIZES.settingsBackButton),
      height: moderateScale(SIZES.settingsBackButton),
      justifyContent: 'center',
      alignItems: 'center',
    },

    backArrow: {
      width: moderateScale(16),
      height: moderateScale(16),
      tintColor: COLORS.white,
      resizeMode: 'contain',
    },

    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: FONT_SIZE.md,
      fontFamily: FONT_FAMILY.regular,
      fontWeight: FONT_WEIGHT.regular,
      color: COLORS.white,
      letterSpacing: SIZES.letterSpacingTiny,
      marginRight: moderateScale(SPACING.huge),
    },

    content: {
      flex: 1,
      paddingHorizontal: horizontalPadding,
      paddingTop: SPACING.xl,
    },

    sectionTitle: {
      fontSize: FONT_SIZE.xl,
      fontFamily: FONT_FAMILY.semiBold,
      fontWeight: FONT_WEIGHT.semiBold,
      color: COLORS.text.secondary,
      marginBottom: SPACING.gap18,
    },

    list: {
      gap: SPACING.xxs,
    },

    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.gap6,
    },

    iconContainer: {
      width: moderateScale(SIZES.settingsIconCircle),
      height: moderateScale(SIZES.settingsIconCircle),
      borderRadius: RADIUS.pill,
      backgroundColor: COLORS.orange.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.gap14,
    },

    icon: {
      width: ICON_SIZES.xxl,
      height: ICON_SIZES.xxl,
    },

    textContainer: {
      flex: 1,
    },

    itemTitle: {
      fontSize: FONT_SIZE.badge,
      fontFamily: FONT_FAMILY.bold,
      fontWeight: FONT_WEIGHT.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.xxs,
    },

    itemSubtitle: {
      fontSize: FONT_SIZE.sm,
      fontFamily: FONT_FAMILY.regular,
      color: COLORS.black,
    },

    caret: {
      width: ICON_SIZES.lg,
      height: ICON_SIZES.lg,
      tintColor: COLORS.black,
      transform: [{ rotate: '180deg' }],
    },

    helpContainer: {
      paddingHorizontal: SPACING.md,
      paddingBottom: SPACING.xxl,
      backgroundColor: COLORS.referEarn.cardBackground,
    },

    helpCard: {
      borderRadius: RADIUS.xl,
      paddingVertical: SPACING.xxl,
      paddingHorizontal: SPACING.lg,
      minHeight: verticalScale(SIZES.helpCardMinHeight),
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: 'transparent',
    },

    helpIconContainer: {
      width: moderateScale(SIZES.settingsIconCircle),
      height: moderateScale(SIZES.settingsIconCircle),
      borderRadius: RADIUS.pill,
      backgroundColor: COLORS.orange.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },

    helpIcon: {
      width: ICON_SIZES.xxl,
      height: ICON_SIZES.xxl,
    },

    helpTextContainer: {
      flex: 1,
      paddingTop: SPACING.xxs,
    },

    helpTitle: {
      fontSize: FONT_SIZE.badge,
      fontFamily: FONT_FAMILY.bold,
      fontWeight: FONT_WEIGHT.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.xxs,
    },

    helpSubtitle: {
      fontSize: FONT_SIZE.xs,
      fontFamily: FONT_FAMILY.regular,
      color: COLORS.black,
      marginBottom: SPACING.gap6,
    },

    contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    contactText: {
      fontSize: FONT_SIZE.sm,
      fontFamily: FONT_FAMILY.semiBold,
      fontWeight: FONT_WEIGHT.semiBold,
      color: COLORS.orange.normal,
      marginRight: SPACING.xs,
    },

    contactCaret: {
      width: ICON_SIZES.xs,
      height: ICON_SIZES.xs,
      tintColor: COLORS.black,
      transform: [{ rotate: '180deg' }],
    },
  });
