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
  trackingNumber?: string;
  courierName?: string;
  discountCode?: string;
  discountAmount?: number;
  invoiceNumber?: string;
  items: OrderItem[];
}

export interface ProductReview {
  id: number;
  carPartId: number;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountPercent: number;
  discountFixed: number;
  discountAmount: number;
  description: string;
  message?: string;
}

export interface ShippingProfile {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  courierName?: string;
}

export interface InvoiceSeller {
  name: string;
  nip: string;
  regon: string;
  address: string;
  bankName: string;
  bankAccount: string;
  email: string;
  phone: string;
}

export interface InvoiceBuyer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceItem {
  id: number;
  partName: string;
  partNumber: string;
  quantity: number;
  netUnitPrice: number;
  grossUnitPrice: number;
  vatRate: string;
  netTotalPrice: number;
  vatTotalPrice: number;
  grossTotalPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderId: number;
  issueDate: string;
  saleDate: string;
  paymentDueDate: string;
  paymentMethod: string;
  paymentStatus: string;
  seller: InvoiceSeller;
  buyer: InvoiceBuyer;
  items: InvoiceItem[];
  discountCode?: string;
  discountAmount?: number;
  trackingNumber?: string;
  courierName?: string;
  summary: {
    totalNet: number;
    totalVat: number;
    totalGross: number;
    currency: string;
  };
}

export interface ReturnRequestPayload {
  orderId: number;
  reason: string;
  comments?: string;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
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
