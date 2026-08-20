export interface Coupon {
  id: string;
  code: string;
  discount: string;
  minOrderText: string;
  validityText: string;
  variant: 'success' | 'danger';
}

export const COUPON_SCREEN = {
  title: 'Apply Coupon',
  inputPlaceholder: 'Add Coupon code',
  applyButton: 'Apply',
  termsLabel: 'T&C',
  emptyTitle: 'No Active Coupons',
  emptySubtitle: "Looks like there aren't any coupons right now",
} as const;

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    id: 'welcome-110-10',
    code: 'WELCOME110',
    discount: 'Flat 10% OFF',
    minOrderText: 'Minimum order value 500 rupees',
    validityText: 'Valid till 31 Aug 2025',
    variant: 'success',
  },
  {
    id: 'welcome-110-50',
    code: 'WELCOME110',
    discount: 'Flat 50% OFF',
    minOrderText: 'Minimum order value 5000 rupees',
    validityText: 'Valid till 31 Aug 2025',
    variant: 'danger',
  },
];
