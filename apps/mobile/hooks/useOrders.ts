import { useQuery } from '@tanstack/react-query';

import { ORDER_ASSETS } from '@/features/orders/orders.assets';

import type { Order } from '@/features/orders/orders.types';

const MOCK_ORDERS: Order[] = [
  {
    id: 'DRUBNDG3543678',
    status: 'delivered',
    deliveredAt: 'Jun 03',
    itemCount: 3,
    totalAmount: 6850,
    deliveryFee: 25,
    handlingFee: 25,

    products: [
      {
        id: 'fortune-oil',
        name: 'Fortune Sunlite refined Oil',
        image: ORDER_ASSETS.fortuneOil,
        quantity: 20,
        packSize: '1 KG',
        unitPrice: 165,
        originalPrice: 3300,
      },
      {
        id: 'tata-toor-dal',
        name: 'Tata Sampann Toor Dal',
        image: ORDER_ASSETS.tataToorDal,
        quantity: 20,
        packSize: '1 KG',
        unitPrice: 120,
        originalPrice: 2640,
      },
      {
        id: 'ashirvaad-atta',
        name: 'Aashirvaad Superior MP Atta',
        image: ORDER_ASSETS.ashirvaadAtta,
        quantity: 20,
        packSize: '1 KG',
        unitPrice: 70,
        originalPrice: 1650,
      },
    ],

    deliveryDetails: {
      shopName: 'Shop',
      shopAddress: 'opposite: petrol bunk, B.C.Road, Gajuwaka, Visakhapatnam, 530026',
      customerName: 'Jagadeesh',
      customerPhone: '9516365113',
    },
  },

  {
    id: 'ORD-002',
    status: 'delivered',
    deliveredAt: 'May 28',
    itemCount: 5,
    totalAmount: 428,
    deliveryFee: 25,
    handlingFee: 10,

    products: [
      {
        id: 'ashirvaad-atta',
        name: 'Aashirvaad Atta',
        image: ORDER_ASSETS.ashirvaadAtta,
        quantity: 1,
        packSize: '1 KG',
        unitPrice: 100,
        originalPrice: 110,
      },
      {
        id: 'ghee',
        name: 'Ghee',
        image: ORDER_ASSETS.ghee,
        quantity: 1,
        packSize: '500 g',
        unitPrice: 120,
        originalPrice: 135,
      },
      {
        id: 'tata-toor-dal',
        name: 'Tata Sampann Toor Dal',
        image: ORDER_ASSETS.tataToorDal,
        quantity: 1,
        packSize: '1 KG',
        unitPrice: 90,
        originalPrice: 100,
      },
      {
        id: 'biscuits',
        name: 'Biscuits',
        image: ORDER_ASSETS.biscuits,
        quantity: 1,
        packSize: '1 Pack',
        unitPrice: 58,
        originalPrice: 65,
      },
      {
        id: 'tea',
        name: 'Tea',
        image: ORDER_ASSETS.tea,
        quantity: 1,
        packSize: '250 g',
        unitPrice: 60,
        originalPrice: 70,
      },
    ],

    deliveryDetails: {
      shopName: 'Shop',
      shopAddress: 'opposite: petrol bunk, B.C.Road, Gajuwaka, Visakhapatnam, 530026',
      customerName: 'Jagadeesh',
      customerPhone: '9516365113',
    },
  },

  {
    id: 'ORD-003',
    status: 'processing',
    itemCount: 4,
    totalAmount: 315,
    deliveryFee: 25,
    handlingFee: 10,

    products: [
      {
        id: 'india-gate-rice',
        name: 'India Gate Classic Basmati Rice',
        image: ORDER_ASSETS.indiaGateRice,
        quantity: 1,
        packSize: '1 KG',
        unitPrice: 120,
        originalPrice: 135,
      },
      {
        id: 'cereals',
        name: 'Cereals',
        image: ORDER_ASSETS.cereals,
        quantity: 1,
        packSize: '500 g',
        unitPrice: 80,
        originalPrice: 90,
      },
      {
        id: 'chips',
        name: 'Chips',
        image: ORDER_ASSETS.chips,
        quantity: 1,
        packSize: '1 Pack',
        unitPrice: 55,
        originalPrice: 60,
      },
      {
        id: 'rice',
        name: 'Rice',
        image: ORDER_ASSETS.rice,
        quantity: 1,
        packSize: '1 KG',
        unitPrice: 60,
        originalPrice: 70,
      },
    ],

    deliveryDetails: {
      shopName: 'Shop',
      shopAddress: 'opposite: petrol bunk, B.C.Road, Gajuwaka, Visakhapatnam, 530026',
      customerName: 'Jagadeesh',
      customerPhone: '9516365113',
    },
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
