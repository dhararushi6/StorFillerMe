export interface WalletTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
}

export const MY_WALLET_SCREEN = {
  title: 'My Wallet',
  helpLabel: 'Help',
  cardTitle: 'Store Filler Wallet',
  statusLabel: 'Low Balance',
  currentBalanceLabel: 'Current Balance',
  recentTransactionsTitle: 'Recent Transactions',
  viewAllLabel: 'View All',
  addToWalletLabel: 'Add to Wallet',
} as const;

export const WALLET_TRANSACTIONS: readonly WalletTransaction[] = [
  {
    id: '1',
    title: 'Cash Added to wallet',
    date: '01 Jul 2025, 10:39 AM',
    amount: 5000,
    type: 'credit',
  },
  {
    id: '2',
    title: 'Order Debited',
    date: '01 Jul 2025, 10:39 AM',
    amount: 5000,
    type: 'debit',
  },
  {
    id: '3',
    title: 'Refund Credited',
    date: '01 Jul 2025, 10:39 AM',
    amount: 5000,
    type: 'credit',
  },
  {
    id: '4',
    title: 'Wallet Balance Expired',
    date: '01 Jul 2025, 10:39 AM',
    amount: 5000,
    type: 'debit',
  },
] as const;

export const WALLET_SCREEN = {
  title: 'Add Balance',
  helpLabel: 'Help',
  cardTitle: 'Store Filler Wallet',
  statusLabel: 'Low Balance',
  currentBalanceLabel: 'Current Balance',
  quickAddTitle: 'Quick Add',
  submitLabel: 'Confirm Amount',
} as const;

export const WALLET_SUPPORT_MODAL = {
  title: 'Got a question?',
  availability: "We're available between 06:00 AM - 06:00 PM",
  chat: {
    title: 'Chat With us',
    description: 'Start a chat with our support team',
  },
  call: {
    title: 'Call Us',
    description: 'Speak with our support executive',
  },
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
    'Wallet balance must be used within 6 months of the top-up date.',
  ],
  termsLabel: 'Terms and Conditions',
} as const;

export const TERMS_SCREEN = {
  title: 'Terms & Conditions',
} as const;
