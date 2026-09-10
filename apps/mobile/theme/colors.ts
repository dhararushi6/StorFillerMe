export const COLORS = {
  orange: {
    light: '#FAEFEA',
    lightHover: '#F7E7DF',
    lightActive: '#EFCDBC',
    normal: '#CC5D28',
    normalHover: '#B85424',
    normalActive: '#A34A20',
    dark: '#99461E',
    darkHover: '#7A3818',
    darkActive: '#5C2A12',
    darker: '#47210E',
    promoText: '#9D3E11',
    banner: '#EFA980',
    showcase: '#FECA7A',
    card: '#FAE2BB',
    lightCard: '#F7DDB2',
    typeUnselected: '#EFE3D5',
    disabledButton: '#E3C1B0',
    bottomBar: '#FAE2BB',
    actionButton: '#D45C25',
    shopTitleAccent: '#B33C03',
    disabledButtonBackground: '#CC5D2852',
    chatBubble: '#FDEDDA',
    borderAlpha30: 'rgba(204, 93, 40, 0.30)',
    borderAlpha25: 'rgba(204, 93, 40, 0.25)',
    bgAlpha10: 'rgba(204, 93, 40, 0.10)',
  },

  yellow: {
    light: '#FEFEFD',
    lightHover: '#FDFDFB',
    lightActive: '#FCFBF8',
    normal: '#F6F2E7',
    normalHover: '#DDDAD0',
    normalActive: '#C5C2B9',
    dark: '#B9B6AD',
    darkHover: '#94918B',
    darkActive: '#6F6D68',
    darker: '#565551',
  },

  header: '#FFF1CB',
  background: '#F6F2E7',
  backgroundSecondary: '#FAF6EE',
  surface: '#FFFFFF',

  // Added for notification.tsx
  toggle: {
    off: '#D9D9D9',
    on: '#CC5D28',
  },

  text: {
    primary: '#111111',
    strong: '#333333',
    body: '#3C3C3C',
    detail: '#535353',
    placeholder: '#646464',
    secondary: '#666666',
    muted: '#8A8A8A',
    location: '#3C3C3C',
    inverse: '#FFFFFF',
    inverseSecondary: '#DDDDDD',
    danger: '#D64545',
    // Added for notification.ts and PrivacyPolicy.ts
    tertiary: '#999999',
    slate: '#475569',
  },

  deal: {
    card: '#FFF1CC',
    inner: '#CC5D281A',
  },
  order: {
    card: '#FFF0D7',
    summaryCard: '#FFF3E0',
    alertCard: '#FAE2BB',
    border: '#C87C01',
    productBackground: '#CC5D281A',
    delivered: '#296601',
  },

  cart: {
    billCalculation: '#EFCDBC99',
    billHeader: '#FAE2BB',
    cancellation: '#FAE2BB',
    walletBar: '#FAE2BB',
    couponCard: '#CC5D281A',
    recommendations: '#E9A37B',
  },

  payment: {
    amountBanner: '#D8E6FD',
    amountText: '#3A83FF',
    card: '#FFF1CB',
    dashedBorder: '#D4C5A9',
  },

  map: {
    background: '#E8E3D5',
    badge: '#FBE4C0',
  },
  coupon: {
    border: '#CEE0FE',
  },

  wallet: {
    cardGradient: ['#CC5D28', '#6B2605'] as const,
  },

  green: {
    light: '#DDF7D0',
    normal: '#1EA836',
    dark: '#009411',
  },

  referEarn: {
    cardBackground: '#FFF5E5',
    cardBorder: '#DABFFF99',
    illustrationShadow: '#E9DCFD',
    modalOverlay: 'rgba(0,0,0,0.45)',
  },

  border: '#E5DED2',
  borderDark: '#C8C4BC',
  borderStrong: '#6A6A6A',
  borderSubtle: 'rgba(0,0,0,0.1)',

  inactive: '#8E98A8',

  imageUpload: '#F0F0F0',
  success: '#1EA836',
  successLight: '#DDF7D0',
  warning: '#F2A900',
  danger: '#D64545',
  rating: '#F2A900',

  overlay: 'rgba(17, 17, 17, 0.55)',

  white: '#FFFFFF',
  black: '#000000',

  shopScreenBackground: '#FFFBF2',
  shopCardBackground: '#FFF0D7',
  photoBoxBackground: '#FFF1DA',
  errorLight: '#FDECEC',
  overlayLight: 'rgba(0,0,0,0.35)',
} as const;