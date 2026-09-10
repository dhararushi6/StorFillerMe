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


export const LINE_HEIGHT_MULTIPLIER = 1.4;