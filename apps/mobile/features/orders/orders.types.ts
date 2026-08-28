export type OrderStatus =
  'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderProduct {
  id: string;
  name: string;
  image: number;
  quantity: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  deliveredAt?: string;
  itemCount: number;
  totalAmount: number;
  products: OrderProduct[];
}
