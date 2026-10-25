export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  partsCount?: number;
}

export interface CarPart {
  id: number;
  name: string;
  partNumber: string;
  categoryId: number;
  categoryName?: string;
  manufacturer: string;
  price: number;
  stockQuantity: number;
  description: string;
  compatibility: string;
  imageUrl: string;
  rating: number;
}

export interface CartItem {
  part: CarPart;
  quantity: number;
}

export interface OrderItem {
  id: number;
  partId: number;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  paymentMethod: string;
  returnStatus: string;
  returnReason?: string;
  items: OrderItem[];
}

export interface ReturnRequestPayload {
  orderId: number;
  reason: string;
  comments?: string;
}

export interface PaymentPayload {
  orderId: number;
  amount: number;
  paymentMethod: 'Card' | 'Blik' | 'Transfer';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  blikCode?: string;
}

export interface User {
  username: string;
  email: string;
  roles: string[];
  token: string | null;
}
