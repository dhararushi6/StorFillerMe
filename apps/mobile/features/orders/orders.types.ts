export type OrderStatus =
  'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderProduct {
  id: string;
  name: string;
  image: number;
  quantity: number;
  packSize: string;
  unitPrice: number;
  originalPrice: number;
}

export interface OrderDeliveryDetails {
  shopName: string;
  shopAddress: string;
  customerName: string;
  customerPhone: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  deliveredAt?: string;
  itemCount: number;
  totalAmount: number;
  products: OrderProduct[];
  deliveryFee: number;
  handlingFee: number;
  deliveryDetails: OrderDeliveryDetails;
}
