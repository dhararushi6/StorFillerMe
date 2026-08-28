import { useQuery } from '@tanstack/react-query';

import { ORDER_ASSETS } from '@/features/orders/orders.assets';
import type { Order } from '@/features/orders/orders.types';

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    status: 'delivered',
    deliveredAt: 'Jun 03',
    itemCount: 3,
    totalAmount: 63,
    products: [
      {
        id: 'fortune-oil',
        name: 'Fortune Sunlite Oil',
        image: ORDER_ASSETS.fortuneOil,
        quantity: 1,
      },
      {
        id: 'daawat-rice',
        name: 'Daawat Traditional Basmati Rice',
        image: ORDER_ASSETS.daawatRice,
        quantity: 1,
      },
      {
        id: 'atta',
        name: 'Atta',
        image: ORDER_ASSETS.atta,
        quantity: 1,
      },
    ],
  },

  {
    id: 'ORD-002',
    status: 'delivered',
    deliveredAt: 'May 28',
    itemCount: 5,
    totalAmount: 428,
    products: [
      {
        id: 'ashirvaad-atta',
        name: 'Aashirvaad Atta',
        image: ORDER_ASSETS.ashirvaadAtta,
        quantity: 1,
      },
      {
        id: 'ghee',
        name: 'Ghee',
        image: ORDER_ASSETS.ghee,
        quantity: 1,
      },
      {
        id: 'tata-toor-dal',
        name: 'Tata Sampann Toor Dal',
        image: ORDER_ASSETS.tataToorDal,
        quantity: 1,
      },
      {
        id: 'biscuits',
        name: 'Biscuits',
        image: ORDER_ASSETS.biscuits,
        quantity: 1,
      },
      {
        id: 'tea',
        name: 'Tea',
        image: ORDER_ASSETS.tea,
        quantity: 1,
      },
    ],
  },

  {
    id: 'ORD-003',
    status: 'processing',
    itemCount: 4,
    totalAmount: 315,
    products: [
      {
        id: 'india-gate-rice',
        name: 'India Gate Classic Basmati Rice',
        image: ORDER_ASSETS.indiaGateRice,
        quantity: 1,
      },
      {
        id: 'cereals',
        name: 'Cereals',
        image: ORDER_ASSETS.cereals,
        quantity: 1,
      },
      {
        id: 'chips',
        name: 'Chips',
        image: ORDER_ASSETS.chips,
        quantity: 1,
      },
      {
        id: 'rice',
        name: 'Rice',
        image: ORDER_ASSETS.rice,
        quantity: 1,
      },
    ],
  },
];

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      return MOCK_ORDERS;
    },
  });
}
