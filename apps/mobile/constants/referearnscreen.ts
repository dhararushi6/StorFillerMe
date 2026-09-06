import { useState, useCallback } from 'react';
import { ImageSourcePropType, Platform, Share, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';

import {
  COLORS,
  SPACING,
  RADIUS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  ICON_SIZES,
  SIZES,
} from '../theme';

import backIcon from '../assets/icons/caret-right (1) 15.png';
import infoIcon from '../assets/icons/warning-circle 2.png';
import illustrationIcon from '../assets/icons/Mask group.png';
import copyIcon from '../assets/icons/copy 1.png';
import inviteIcon from '../assets/icons/user-plus 1.png';
import shareIcon from '../assets/icons/Vector.png';
import packageIcon from '../assets/icons/Vector (1).png';
import rewardIcon from '../assets/icons/Vector (2).png';
import step4Icon from '../assets/icons/Vector (3).png';

// ==================== ASSETS & CONSTANTS ====================

export const ICONS = {
  back: backIcon,
  info: infoIcon,
  illustration: illustrationIcon,
  copy: copyIcon,
  invite: inviteIcon,
  share: shareIcon,
  friendSignup: inviteIcon,
  package: packageIcon,
  reward: rewardIcon,
  step3: rewardIcon,
  step4: step4Icon,
} satisfies Record<string, ImageSourcePropType>;

export const COPIED_FEEDBACK_DURATION_MS = 1500;
export const DEFAULT_REFERRAL_CODE = 'DEFAULT123';
export const MAX_CONTENT_WIDTH = 430;

// ==================== CONTENT ====================

export const REFER_EARN_CONTENT = {
  headerTitle: 'Refer Now',
  heading: 'Refer & Earn',
  subheading: 'Invite your friends and earn cash rewards when they place their first order.',
  referralCodeLabel: 'Your Referral Code',
  copyButtonLabel: 'Copy Code',
  copiedLabel: 'Copied!',
  inviteButtonLabel: 'Invite Friends',
  shareTitle: 'Invite a friend',

  getShareMessage: (code: string) =>
    `${REFER_EARN_CONTENT.heading}\n\nUse my referral code ${code} to sign up!`,

  getShareUrl: (code: string) => `https://yourapp.com/refer/${code}`,
} as const;

export const HOW_IT_WORKS_CONTENT = {
  title: 'How it works',
  gotItLabel: 'Got it',

  steps: [
    {
      icon: ICONS.share,
      title: 'Share your referral code',
      description: 'Send your code to your friends',
    },
    {
      icon: ICONS.friendSignup,
      title: 'Your friend sign up',
      description: 'They sign up using your referral code.',
    },
    {
      icon: ICONS.step3,
      title: 'Your friends places their first order',
      description: 'They place their first successful orders',
    },
    {
      icon: ICONS.step4,
      title: 'you earn 100, your friends gets 50',
      description: 'Rewards are credited to your wallet',
    },
  ],
} as const;

// ==================== LOGIC / HOOK ====================

export interface UseReferEarnProps {
  onBack?: () => void;
  onInviteFriends?: () => void;
}

export function useReferEarn({ onBack, onInviteFriends }: UseReferEarnProps = {}) {
  const { referralCode: paramCode } = useLocalSearchParams<{ referralCode?: string }>();

  const referralCode = paramCode || DEFAULT_REFERRAL_CODE;

  const [copied, setCopied] = useState(false);
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);
  const [inviteSending, setInviteSending] = useState(false);

  const handleCopyCode = useCallback(async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, COPIED_FEEDBACK_DURATION_MS);
  }, [referralCode]);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }

    router.replace('/(buyer)/profile');
  }, [onBack]);

  const handleInviteFriends = useCallback(async () => {
    if (onInviteFriends) {
      onInviteFriends();
      return;
    }

    if (inviteSending) {
      return;
    }

    try {
      setInviteSending(true);

      await Share.share({
        message: REFER_EARN_CONTENT.getShareMessage(referralCode),
        ...(Platform.OS === 'ios' ? { url: REFER_EARN_CONTENT.getShareUrl(referralCode) } : {}),
        title: REFER_EARN_CONTENT.shareTitle,
      });
    } catch (error) {
      console.warn('Error sharing referral code:', error);
    } finally {
      setInviteSending(false);
    }
  }, [onInviteFriends, referralCode, inviteSending]);

  return {
    referralCode,
    copied,
    howItWorksVisible,
    setHowItWorksVisible,
    inviteSending,
    handleCopyCode,
    handleBack,
    handleInviteFriends,
  };
}

// ==================== STYLES ====================

export const referEarnStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    backgroundColor: COLORS.orange.normal,
    borderBottomLeftRadius: RADIUS.headerCompact,
    borderBottomRightRadius: RADIUS.headerCompact,
    overflow: 'hidden',
    paddingBottom: SPACING.sm,

    ...Platform.select({
      android: {
        elevation: SIZES.elevationTiny,
      },

      ios: {
        shadowColor: COLORS.black,
        shadowOpacity: SIZES.shadowOpacityLight,
        shadowOffset: {
          width: 0,
          height: SIZES.shadowOffsetSmall,
        },
        shadowRadius: SIZES.shadowRadiusSmall,
      },
    }),
  },

  headerSafeArea: {
    backgroundColor: COLORS.orange.normal,
  },

  headerInner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },

  header: {
    backgroundColor: COLORS.orange.normal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    height: 44,
  },

  headerIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerBackIcon: {
    width: ICON_SIZES.xxl,
    height: ICON_SIZES.xxl,
    tintColor: COLORS.white,
  },

  headerInfoIcon: {
    width: ICON_SIZES.md2,
    height: ICON_SIZES.md2,
    tintColor: COLORS.white,
  },

  headerTitle: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: FONT_WEIGHT.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.white,
  },

  scrollWrapper: {
    flex: 1,
    width: '100%',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },

  contentContainer: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignItems: 'center',
  },

  illustration: {
    width: '100%',
    maxWidth: 320,
    height: 200,
    marginBottom: SPACING.md,
  },

  heading: {
    fontFamily: FONT_FAMILY.semiBold,
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE.heading,
    lineHeight: LINE_HEIGHT.xxl,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },

  subheading: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: FONT_WEIGHT.regular,
    fontSize: FONT_SIZE.badge,
    lineHeight: LINE_HEIGHT.badge,
    color: COLORS.black,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },

  referralCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.referEarn.cardBackground,
    borderColor: COLORS.referEarn.cardBorder,
    borderWidth: SIZES.borderStandard,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },

  codeCardLabel: {
    fontFamily: FONT_FAMILY.semiBold,
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE.badge,
    lineHeight: LINE_HEIGHT.badge,
    color: COLORS.text.primary,
    textAlign: 'center',
  },

  codePill: {
    width: '85%',
    maxWidth: 260,
    height: 38,
    borderWidth: SIZES.borderStandard,
    borderStyle: 'dashed',
    borderColor: COLORS.orange.normal,
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.smd,
    alignItems: 'center',
    justifyContent: 'center',
  },

  codeText: {
    fontFamily: FONT_FAMILY.bold,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.code,
    lineHeight: LINE_HEIGHT.lg,
    color: COLORS.orange.normal,
    textAlign: 'center',
  },

  copyButton: {
    minWidth: 140,
    height: 36,
    borderWidth: SIZES.borderStandard,
    borderColor: COLORS.orange.normal,
    backgroundColor: COLORS.orange.card,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },

  copyIcon: {
    width: ICON_SIZES.md2,
    height: ICON_SIZES.md2,
    tintColor: COLORS.black,
  },

  copyButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.buttonText,
    color: COLORS.black,
    textAlign: 'center',
  },

  bottomBar: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.xs,
    width: '100%',
  },

  bottomBarInner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },

  inviteButton: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.orange.normal,
    borderRadius: RADIUS.smd,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.gap6,
  },

  inviteButtonPressed: {
    opacity: 0.85,
  },

  inviteIcon: {
    width: ICON_SIZES.md,
    height: ICON_SIZES.md,
    tintColor: COLORS.white,
    marginRight: SPACING.xs,
  },

  inviteButtonText: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: FONT_WEIGHT.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.buttonText,
    color: COLORS.white,
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.referEarn.modalOverlay,
    justifyContent: 'flex-end',
  },

  modalCard: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingTop: SPACING.gap9,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.gap14,
  },

  modalHandle: {
    alignSelf: 'center',
    width: SIZES.referEarnModalHandleWidth,
    height: SIZES.referEarnModalHandleHeight,
    borderRadius: RADIUS.xxs,
    backgroundColor: COLORS.black,
    marginBottom: SPACING.gap13,
  },

  modalTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.modalTitle,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.gap17,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: SIZES.stepRowMinHeight,
    marginBottom: SPACING.gap15,
  },

  lastStepRow: {
    marginBottom: SPACING.md,
  },

  stepIconCircle: {
    width: SIZES.stepIconCircleSize,
    height: SIZES.stepIconCircleSize,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.orange.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.gap13,
  },

  stepIcon: {
    width: ICON_SIZES.xl,
    height: ICON_SIZES.xl,
    tintColor: COLORS.orange.normal,
  },

  stepTextGroup: {
    flex: 1,
    justifyContent: 'center',
  },

  stepTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE.badge,
    lineHeight: LINE_HEIGHT.badge,
    color: COLORS.black,
    marginBottom: SPACING.xxs,
  },

  stepDescription: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: FONT_WEIGHT.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,
    color: COLORS.black,
  },

  gotItButton: {
    width: '100%',
    height: SIZES.gotItButtonHeight,
    borderRadius: RADIUS.smd,
    backgroundColor: COLORS.orange.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gotItButtonText: {
    fontFamily: FONT_FAMILY.regular,
    fontWeight: FONT_WEIGHT.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.white,
    textAlign: 'center',
  },
});
