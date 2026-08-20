export const WALLET_SCREEN = {
  title: 'Add Balance',
  cardTitle: 'Store Filler Wallet',
  statusLabel: 'Low Balance',
  currentBalanceLabel: 'Current Balance',
  quickAddTitle: 'Quick Add',
  submitLabel: 'Add to Wallet',
} as const;

export const WALLET_BALANCE = 0;

export const WALLET_QUICK_ADD_OPTIONS = [
  { id: '500', amount: 500 },
  { id: '1000', amount: 1000 },
  { id: '5000', amount: 5000 },
] as const;

export const WALLET_NOTE = {
  title: 'Important Note:',
  points: [
    'Valid only for purchases in the Store Filler app.',
    'Non-refundable and non-transferable.',
    'Wallet balance must be used within 1 year of the top-up date.',
  ],
  termsLabel: 'Terms and Conditions',
} as const;

export const TERMS_SCREEN = {
  title: 'Terms & Conditions',
} as const;
