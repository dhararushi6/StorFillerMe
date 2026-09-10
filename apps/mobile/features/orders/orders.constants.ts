import { COLORS } from '@/theme';

import type { OrderStatus } from './orders.types';

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    backgroundColor: string;
  }
> = {
  pending: {
    label: 'Pending',
    color: COLORS.warning,
    backgroundColor: COLORS.payment.card,
  },

  confirmed: {
    label: 'Confirmed',
    color: COLORS.warning,
    backgroundColor: COLORS.payment.card,
  },

  processing: {
    label: 'Processing',
    color: COLORS.warning,
    backgroundColor: COLORS.payment.card,
  },

  out_for_delivery: {
    label: 'Out for delivery',
    color: COLORS.orange.normal,
    backgroundColor: COLORS.orange.light,
  },

  delivered: {
    label: 'Delivered',
    color: COLORS.success,
    backgroundColor: COLORS.successLight,
  },

  cancelled: {
    label: 'Cancelled',
    color: COLORS.danger,
    backgroundColor: COLORS.orange.light,
  },
};

export const HELP_TOPICS = [
  {
    id: 'missing-items',
    title: 'Missing items',
    description: 'Some items are missing from my order',
  },
  {
    id: 'wrong-items',
    title: 'Wrong items received',
    description: 'I received wrong products',
  },
  {
    id: 'damaged-items',
    title: 'Damaged items',
    description: 'I received damaged or broken items',
  },
  {
    id: 'delivery-issue',
    title: 'Delivery issue',
    description: 'Order not delivered / Late delivery',
  },
  {
    id: 'invoice-issue',
    title: 'Invoice issue',
    description: 'Problem with invoice or billing',
  },
  {
    id: 'payment-issue',
    title: 'Payment issue',
    description: 'Payment failed or wrong amount deducted',
  },
] as const;
