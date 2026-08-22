export const PAYMENTS_SCREEN = {
  title: 'Payments',
  totalAmountLabel: 'Total Amount',
  defaultAmount: 105,
  upiSectionTitle: 'UPI Apps',
  cardsSectionTitle: 'Cards',
  addCardLabel: 'Add Credit / Debit Card',
} as const;

export const EXIT_PAYMENT_MODAL = {
  title: 'Leave Payment?',
  description:
    'You are just one step away from completing your order. If you go back, payment process will be cancelled.',
  exitAnywayLabel: 'Exit Anyway',
  continuePaymentLabel: 'Continue Payment',
} as const;

export const ADD_CARD_SCREEN = {
  title: 'Add Credit / Debit Card',
  cardNumberLabel: 'Card Number',
  expiryDateLabel: 'Expiry Date',
  cvvLabel: 'CVV',
  cardHolderNameLabel: 'Card Holder Name',
  payButtonLabel: 'Pay',
} as const;

export const BANK_VERIFICATION_SCREEN = {
  title: 'Bank Verification',
  descriptionPrefix: 'Enter the OTP registered mobile number ',
  defaultPhone: '+91 XXXXX XXXXX',
  resendPrefix: 'Resend code in ',
  resendAction: 'Resend code',
  resendDurationSeconds: 28,
  otpLength: 5,
  verifyButtonLabel: 'Verify',
} as const;

export const PROCESSING_PAYMENT_SCREEN = {
  title: 'Add Money...',
  description: 'Processing your payment, please\ndo not close the app',
} as const;

export const PAYMENT_SUCCESS_SCREEN = {
  title: 'Money added successfully!',
  subtitleSuffix: 'rupees added to your\nstore filler wallet',
  walletBalanceLabel: 'Wallet Balance',
  paymentMethodLabel: 'Payment Method',
  cardNumberMasked: 'Card number: hergunigk6789',
  cardBrand: 'VISA',
  transactionIdLabel: 'Transaction ID',
  defaultTransactionId: '#TNV2356789013',
  viewWalletLabel: 'View Wallet',
  goHomeLabel: 'Go To Home',
} as const;

export interface UpiAppItem {
  id: string;
  name: string;
  isCustomPhonePe?: boolean;
  imageSource?: any;
}
