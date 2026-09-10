export interface TimelineStep {
  id: string;
  title: string;
  timestamp: string;
  isCompleted: boolean;
}

export const TRACK_ORDER_SCREEN = {
  headerTitle: 'Order Details',
  needHelpLabel: 'Need Help?',
  orderIdLabel: 'Order ID',
  defaultOrderId: '#SF2345678990',
  placedOnPrefix: 'Placed on',
  defaultPlacedDate: '03 Aug, 2025, 09:00 PM',
  confirmedBadge: 'Confirmed',
  deliveryAtLabel: 'Delivery at',
  defaultDeliveryWindow: 'Tomorrow, 10:00 AM - 11:00 AM',
  outForDeliveryNotice: "We'll notify you when your order is out for delivery.",
  alertNotice: 'We will notify you once your order is out for delivery.',

  deliveryAddressTitle: 'Delivery Address',
  storeName: 'Jagadeesh Kirana store',
  addressLine:
    'H.No 12-4-56, Near bus Stand, Kappegalu Village, Bellary District Karnataka - 583101',
  phonePrefix: 'Phone:',
  phoneNumber: '1234567890',

  orderStatusTitle: 'Order Status',

  orderSummaryTitle: 'Order Summary',
  defaultItemsCount: '26 items',
  moreItemsLabel: '+ More items',
  defaultTotalAmount: 9200,

  downloadInvoiceLabel: 'Download Invoice',
  shareOrderLabel: 'Share Order',
} as const;

export const SUPPORT_SCREEN = {
  headerTitle: 'Need Help',
  helpSectionTitle: 'Need help with this order?',
  helpSectionSubtitle: 'Our Support team is here to help you',
  chatWithUsTitle: 'Chat With us',
  chatWithUsSubtitle: 'Start a chat with our support team',
  callUsTitle: 'Call Us',
  callUsSubtitle: 'Speak with our support executive',
} as const;

export const DEFAULT_TIMELINE_STEPS: TimelineStep[] = [
  {
    id: '1',
    title: 'Ordered Placed',
    timestamp: '03 Aug 2025, 09:00 PM',
    isCompleted: true,
  },
  {
    id: '2',
    title: 'Order Confirmed',
    timestamp: '03 Aug 2025, 09:15 PM',
    isCompleted: true,
  },
  {
    id: '3',
    title: 'Packed',
    timestamp: '03 Aug 2025, 11:45 PM',
    isCompleted: true,
  },
  {
    id: '4',
    title: 'Out for delivery',
    timestamp: 'Expected on 04 Aug 2025',
    isCompleted: false,
  },
  {
    id: '5',
    title: 'Delivered',
    timestamp: 'Expected on 04 Aug 2025 by 9:30 AM',
    isCompleted: false,
  },
];

export const ORDER_DELIVERED_SCREEN = {
  headerTitle: 'Order Delivered',
  title: 'Delivered Successful!',
  subtitle: 'Your Order has been delivered on',
  deliveredDate: '04 Aug 2025, 09:25 AM',
  orderIdLabel: 'Order ID',
  defaultOrderId: '#SF2345678990',
  copyLabel: 'Copy',
  amountPaidLabel: 'Amount Paid',
  defaultAmount: 9200,
  itemsOrderedLabel: 'Items Ordered',
  defaultItemsCount: '26 Items',
  paymentTimeLabel: 'Payment & Time',
  defaultPaymentTime: '03 Aug, 2025, 09:00 PM',
  deliveryAtLabel: 'Delivery at',
  defaultDeliveryWindow: 'Tomorrow, 10:00 AM - 11:00 AM',
  backToHomeLabel: 'Back to Home',
} as const;
