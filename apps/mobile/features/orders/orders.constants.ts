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
