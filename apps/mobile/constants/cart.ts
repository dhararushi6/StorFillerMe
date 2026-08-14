import ashirvaadMpAttaImage from '@/assets/images/home/ashirvaad-mp-atta.png';
import fortuneSunliteOilImage from '@/assets/images/home/fortune-sunlite-oil.png';
import tataSampannToorDalImage from '@/assets/images/home/tata-sampann-toor-dal.png';

export interface CartItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  image: number;
}

export interface RecommendationProduct {
  id: string;
  name: string;
  unit: string;
  price: number;
  oldPrice?: number;
  image: number;
}

export const CART_DELIVERY_ADDRESS = {
  title: 'Delivery to',
  highlight: 'shop',
  address: 'H.No 12-4-56, Near bus Stand, Kappegalu Village, Bellary District Karnataka - 583101',
} as const;

export const CART_FREE_DELIVERY = {
  title: 'Get Free Delivery',
  prefixText: 'Adding items worth ',
  thresholdAmount: 63,
  viewMoreLabel: 'View More',
  percentageLabel: '70%',
  progressRatio: 0.7,
} as const;

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'ashirvaad-mp-atta',
    name: 'Aashirvaad Superior MP Atta',
    unit: '1 Kg',
    price: 63,
    oldPrice: 74,
    quantity: 1,
    image: ashirvaadMpAttaImage,
  },
];

export const CART_ACTIONS = {
  addMoreItems: 'Add More Items',
  applyCouponTitle: 'Apply Coupon',
  applyCouponSubtitle: 'Checkout offers and coupons',
} as const;

export const CART_RECOMMENDATIONS = {
  title: 'You might like this',
  viewAllLabel: 'View All',
  products: [
    {
      id: 'ashirvaad-mp-atta',
      name: 'Aashirvaad Superior MP Atta',
      unit: '1 Kg',
      price: 63,
      oldPrice: 74,
      image: ashirvaadMpAttaImage,
    },
    {
      id: 'tata-sampann-toor-dal',
      name: 'tata sampann toor dal',
      unit: '1 Kg',
      price: 145,
      oldPrice: 165,
      image: tataSampannToorDalImage,
    },
    {
      id: 'fortune-sunlite-oil',
      name: 'Fortune sunlite refined Oil',
      unit: '850 g',
      price: 160,
      oldPrice: 190,
      image: fortuneSunliteOilImage,
    },
  ] as RecommendationProduct[],
} as const;

export const CART_BILL_DATA = {
  title: 'Your Bill',
  itemsTotalLabel: 'items total',
  deliveryFeeLabel: 'Delivery fee',
  handlingFeeLabel: 'Handling fee',
  totalAmountLabel: 'Total amount',
  deliveryFeeAmount: 30,
  handlingFeeAmount: 12,
  savingsText: 'you are saving 11 rupees on this order',
} as const;

export const CART_CANCELLATION_POLICY = {
  title: 'Cancellation policy',
  description:
    'If the order does not meet your expectations, you can connect the order or exchange the items at shop',
} as const;

export const CART_WALLET_DATA = {
  label: 'Wallet:',
  balance: 0,
  addBalanceLabel: 'Add Balance',
} as const;

export const CART_FOOTER = {
  viewBillDetailsLabel: 'View Bill Details',
  continueLabel: 'Continue',
} as const;
