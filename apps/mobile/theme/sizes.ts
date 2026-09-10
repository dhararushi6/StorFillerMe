export const SIZES = {
  buttonHeight: 48,
  inputHeight: 48,
  reviewInputHeight: 96,
  smallButtonHeight: 40,
  compactButtonHeight: 32,

  headerHeight: 56,
  headerCompactHeight: 63,
  headerLargeHeight: 107,
  bottomTabHeight: 64,

  iconSmall: 16,
  iconMedium: 20,
  iconLarge: 24,

  avatarSmall: 32,
  avatarMedium: 40,
  avatarLarge: 48,

  showcaseCardWidth: 122,
  showcaseCardHeight: 132,
  showcaseImageHeight: 82,

  quickHelpCardWidth: 224,
  chatBubbleWidth: 224,
  chatThumbnailSize: 44,
  ticketIconSize: 34,
  onlineDotSize: 7,

  chipHeight: 23,

  addressTypeCardWidth: 110,
  addressTypeCardHeight: 83,
  addressCardHeight: 55,

  borderThin: 0.8,
  borderStandard: 1,

  saveButtonHeight: 48,
  backButton: 32,
  backIcon: 24,
  addressTypeIcon: 28,
  borderNone: 0,

  elevationTiny: 2,
  elevationSmall: 3,
  elevationMedium: 4,
  elevationLarge: 10,
  elevationCard: 5,

  shadowRadiusSmall: 4,
  shadowRadiusMedium: 8,
  shadowOpacityLight: 0.08,
  shadowOpacityMedium: 0.1,
  shadowOpacityStrong: 0.2,
  shadowOffsetSmall: 2,
  shadowOffsetMedium: 4,

  letterSpacingSmall: 0.6,
  letterSpacingTiny: 0.125,

  inputUnderlineHeight: 30,
  inputPaddingTop: 12,
  inputPlaceholderTop: 6,

  formSectionGap: 22,
  formFieldGap: 6,
  addressTypePaddingTop: 10,

  mapAddressCardHeight: 186,
  addressCardPaddingTop: 36,
  addressDetailsRowMinHeight: 43,
  addressTextGap: 2,
  locationBadgePaddingVertical: 9,

  actionButtonHeight: 46,
  searchBarTop: 10,
  searchBarHeight: 36,

  zIndexOverlay: 30,

  actionSheetIconCircle: 56,
  successIconCircle: 72,

  uploadButtonHeight: 41,
  shopCardMinHeight: 62,
  progressTrackHeight: 8,
  borderThick: 3,

  // --- Auth screens (from qurrath) ---
  authWelcomeImageHeight: 400,
  authWelcomeImageTop: 0,
  authWelcomeTextGap: 1,
  authProgressWidth: 31,
  authProgressHeight: 3,
  authBackArrowWidth: 28,
  authBackArrowHeight: 28,
  authCountryCodeWidth: 60,
  authPhoneInputGap: 8,

  orderProductImage: 60,
  orderProductAsset: 64,
  orderProductRowHeight: 64,
  orderPriceWidth: 64,
  helpButtonWidth: 60,
  helpButtonHeight: 27,

  helpModalMaxWidth: 450,
  helpModalTopicHeight: 64,
  helpModalHandleWidth: 60,
  helpModalHandleHeight: 4,

  referEarnModalHandleWidth: 34,
  referEarnModalHandleHeight: 2,
  stepRowMinHeight: 52,
  stepIconCircleSize: 52,
  gotItButtonHeight: 42,

  // ──────────────────────────────────────────────
  // Account Settings Screen
  // ──────────────────────────────────────────────
  accountHeaderHeight: 100,
  settingsBackButton: 40,
  backArrowFontSize: 24,
  settingsIconCircle: 44,
  helpCardMinHeight: 120,

  // ──────────────────────────────────────────────
  // Notification Screen
  // ──────────────────────────────────────────────
  toggleTrackWidth: 50,
  toggleTrackHeight: 28,
  toggleKnobSize: 24,
  toggleKnobMargin: 2,
  notificationHeaderHeight: 90,
  notificationBackButton: 40,

  // ──────────────────────────────────────────────
  // Privacy Policy Screen
  // ──────────────────────────────────────────────
  privacyScreenMaxWidth: 500,
  privacyHeaderHeight: 100,
  privacyBackButton: 40,
  privacyHeaderCaret: 20,
  privacyAccordionMinHeight: 80,
  privacyArrowBox: 24,

  // --- Issue details (from qurrath) ---
  issueDetailsImageBoxWidth: 100,
  issueDetailsImageBoxHeight: 100,
  issueDetailsNoticeHeight: 36,
  issueChangeButtonWidth: 75,
  issueChangeButtonHeight: 22,
} as const;

export const FONT_FAMILY = {
  regular: 'SchibstedGrotesk-Regular',
  medium: 'SchibstedGrotesk-Medium',
  semiBold: 'SchibstedGrotesk-SemiBold',
  bold: 'SchibstedGrotesk-Bold',
} as const;

export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

export const FONT_SIZE = {
  authTitle: 32,
  micro: 8,
  tiny: 9,
  xxs: 10,
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  title: 20,
  xxl: 22,
  heading: 24,
  xxxl: 28,
  display: 32,
  badge: 13,
  extraLarge: 20,
  code: 19,
  // Added for PrivacyPolicy.ts
  policyTitle: 18,   // renamed from duplicate `title: 18`
  subtitle: 14,
} as const;

export const LINE_HEIGHT = {
  micro: 10,
  tiny: 12,
  xxs: 12,
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  title: 24,
  xl: 28,
  heading: 29,
  xxl: 32,
  display: 38,
  authTitle: 43,
  authDescription: 22,
  hero: 53,
  category: 14.4,
  label: 16.8,
  typeText: 19.2,
  badge: 17,
  cardTitle: 15,
  buttonText: 18,
  small: 17,
  medium: 21,
  modalTitle: 23,
  
  subtitle: 20,
  description: 18,
  
  note: 15.6,
  amount: 16.8,
  helper: 18.2,
  paragraph: 20.8,
} as const;

export const LETTER_SPACING = {
  authTitle: -0.7,
} as const;

// Added for notification.ts
export const LINE_HEIGHT_MULTIPLIER = 1.4;