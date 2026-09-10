export const PAYMENTS_SCREEN = {
  title: 'Payments',
  totalAmountLabel: 'Total Amount',
  defaultAmount: 105,
  upiSectionTitle: 'UPI Apps',
  cardsSectionTitle: 'Cards',
  addCardLabel: 'Add Credit / Debit Card',
  codLabel: 'Cash On Delivery',
} as const;

export const EXIT_PAYMENT_MODAL = {
  title: 'Leave Payment?',
  description:
    'You are just one step away from completing your order. If you go back, payment process will be cancelled.',
  exitAnywayLabel: 'Exit Anyway',
  continuePaymentLabel: 'Continue Payment',
} as const;

export const COD_CONFIRMATION_MODAL = {
  title: 'Cash on Delivery',
  description: 'Are you sure you want to proceed with Cash on Delivery?',
  noLabel: 'No',
  continueLabel: 'Continue',
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
  headerTitle: 'Payment Successful',
  title: 'Money added successfully!',
  subtitleSuffix: 'rupees added to your\nstore filler wallet',
  amountAddedLabel: 'Amount Added',
  walletBalanceLabel: 'Wallet Balance',
  paymentMethodLabel: 'Payment Method',
  paymentMethodValue: 'Debit / Credit Card (VISA)',
  paymentTimeLabel: 'Payment & Time',
  defaultPaymentTime: '03 Aug, 2025, 09:00 PM',
  transactionIdLabel: 'Transaction ID',
  defaultTransactionId: '#TNV2356789013',
  copyLabel: 'Copy',
  walletStatusLabel: 'Store Filler Wallet',
  walletStatusSubtitle: 'Active & ready to use for orders',
  viewWalletLabel: 'View Wallet',
  goHomeLabel: 'Go To Home',
} as const;

export const ORDER_SUCCESS_SCREEN = {
  headerTitle: 'Bank Verification',
  title: 'Payment Successful!',
  subtitle: 'You order has been placed successfully',
  orderIdLabel: 'Order ID',
  defaultOrderId: '#SF2345678990',
  copyLabel: 'Copy',
  amountPaidLabel: 'Amount Paid',
  itemsOrderedLabel: 'Items Ordered',
  paymentTimeLabel: 'Payment & Time',
  defaultPaymentTime: '03 Aug, 2025, 09:00 PM',
  deliveryAtLabel: 'Delivery at',
  defaultDeliveryWindow: 'Tomorrow, 10:00 AM - 11:00 AM',
  trackOrderLabel: 'Track Order',
  continueShoppingLabel: 'Continue Shopping',
} as const;

export interface UpiAppItem {
  id: string;
  name: string;
  isCustomPhonePe?: boolean;
  imageSource?: any;
}
