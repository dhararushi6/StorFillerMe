import { StyleSheet } from 'react-native';
import { COLORS } from '@/theme/colors';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from '@/theme/typography';
import { RADIUS } from '@/theme/radius';
import { SIZES } from '@/theme/sizes';
import { SPACING } from '@/theme/spacing';
import { ICON_SIZES } from '@/theme/iconSizes';

// ──────────────────────────────────────────────
// 1. Types
// ──────────────────────────────────────────────

export interface PrivacyPolicySection {
  id: string;
  title: string;
  summary: string;
  detail: string;
}

// ──────────────────────────────────────────────
// 2. Strings & Routes
// ──────────────────────────────────────────────

export const PRIVACY_POLICY_STRINGS = {
  headerTitle: 'Privacy Policy',
  subtitle: 'Learn how we collect, use and protect your information',
  routes: {
    accountSettings: '/(buyer)/accountsettings',
  },
} as const;

export const PRIVACY_POLICY_SECTIONS: PrivacyPolicySection[] = [
  {
    id: 'collect',
    title: 'Information we collect',
    summary: 'What data we collect and why',
    detail:
      'We collect information you provide directly such as your name, mobile number, address, and order details. We also collect device, location and usage information.',
  },
  {
    id: 'use',
    title: 'How we use your data',
    summary: 'How your data is used',
    detail:
      'We use your data to process orders, provide crop advisory, improve our services and send important updates and offers.',
  },
  {
    id: 'sharing',
    title: 'Data sharing',
    summary: 'When and why we share data',
    detail:
      'We do not sell your data. We share your information only with trusted service partners for order delivery, payments and analytics.',
  },
  {
    id: 'rights',
    title: 'Your rights & choices',
    summary: 'Your privacy rights and control',
    detail:
      'You can access, update or delete your personal information. You can also opt out of marketing communications.',
  },
  {
    id: 'security',
    title: 'Data security',
    summary: 'How we protect your data',
    detail:
      'We use industry-standard security measures to protect your data from unauthorized access, alteration or loss.',
  },
];

// ──────────────────────────────────────────────
// 3. Style Factory (Responsive)
// ──────────────────────────────────────────────

interface ResponsiveHelpers {
  horizontalPadding: number;
  verticalScale: (size: number) => number;
  moderateScale: (size: number) => number;
}

export const getPrivacyPolicyStyles = ({
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

    backIcon: {
      width: moderateScale(16),
      height: moderateScale(16),
      tintColor: COLORS.white,
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

    scrollView: {
      flex: 1,
      backgroundColor: COLORS.surface,
    },

    scrollContent: {
      paddingBottom: SPACING.gap30,
    },

    content: {
      paddingHorizontal: horizontalPadding,
      paddingTop: SPACING.xl,
    },

    subtitle: {
      fontSize: FONT_SIZE.xl,
      fontFamily: FONT_FAMILY.semiBold,
      fontWeight: FONT_WEIGHT.semiBold,
      color: COLORS.text.secondary,
      marginBottom: SPACING.gap18,
    },

    accordionContainer: {},

    accordionButton: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: SPACING.gap6,
      minHeight: verticalScale(60),
    },

    textContainer: {
      flex: 1,
      paddingRight: SPACING.lg,
    },

    sectionTitle: {
      fontSize: FONT_SIZE.badge,
      fontFamily: FONT_FAMILY.bold,
      fontWeight: FONT_WEIGHT.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.xxs,
    },

    sectionDescription: {
      fontSize: FONT_SIZE.sm,
      fontFamily: FONT_FAMILY.regular,
      color: COLORS.black,
      lineHeight: LINE_HEIGHT.description,
    },

    arrowImage: {
      width: ICON_SIZES.lg,
      height: ICON_SIZES.lg,
      tintColor: COLORS.black,
      marginTop: SPACING.xxs,
    },

    arrowCollapsed: {
      transform: [{ rotate: '180deg' }],
    },

    arrowExpanded: {
      transform: [{ rotate: '270deg' }],
    },
  });
