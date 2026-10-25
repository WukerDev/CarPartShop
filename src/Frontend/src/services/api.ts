import type { Category, CarPart, Order, ReturnRequestPayload, PaymentPayload, ProductReview, CouponValidationResult, InvoiceData } from '@/types';
import i18n from '@/plugins/i18n';

class ApiService {
  private getBaseUrl(): string {
    return '';
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const token = localStorage.getItem('carpart_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${this.getBaseUrl()}/api/catalog/categories`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(i18n.global.t('errors.categoriesLoadError'));
    return await res.json();
  }

  async getParts(params?: {
    categoryId?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    carMake?: string;
    carModel?: string;
    carYear?: number;
  }): Promise<{ parts: CarPart[]; totalCount: number }> {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append('categoryId', params.categoryId.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    if (params?.inStockOnly) query.append('inStockOnly', 'true');
    if (params?.carMake) query.append('carMake', params.carMake);
    if (params?.carModel) query.append('carModel', params.carModel);
    if (params?.carYear) query.append('carYear', params.carYear.toString());

    const res = await fetch(`${this.getBaseUrl()}/api/catalog/parts?${query.toString()}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(i18n.global.t('errors.catalogLoadError'));
    return await res.json();
  }

  async getVehicleMakes(): Promise<string[]> {
    const res = await fetch(`${this.getBaseUrl()}/api/vehicle/makes`, {
      headers: this.getHeaders()
    });
    if (!res.ok) return [];
    return await res.json();
  }

  async getVehicleModels(make: string): Promise<string[]> {
    const res = await fetch(`${this.getBaseUrl()}/api/vehicle/models?make=${encodeURIComponent(make)}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) return [];
    return await res.json();
  }

  async getVehicleYears(make: string, model?: string): Promise<number[]> {
    let url = `${this.getBaseUrl()}/api/vehicle/years?make=${encodeURIComponent(make)}`;
    if (model) url += `&model=${encodeURIComponent(model)}`;
    const res = await fetch(url, {
      headers: this.getHeaders()
    });
    if (!res.ok) return [];
    return await res.json();
  }

  async getPartById(id: number): Promise<CarPart> {
    const res = await fetch(`${this.getBaseUrl()}/api/catalog/parts/${id}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(i18n.global.t('errors.partLoadError', { id }));
    return await res.json();
  }

  async createOrder(payload: {
    customerName: string;
    email: string;
    phone: string;
    shippingAddress: string;
    paymentMethod: string;
    courierName?: string;
    discountCode?: string;
    items: { partId: number; quantity: number }[];
  }): Promise<Order> {
    const res = await fetch(`${this.getBaseUrl()}/api/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: i18n.global.t('errors.orderCreateError') }));
      throw new Error(err.message || i18n.global.t('errors.orderCreateError'));
    }
    return await res.json();
  }

  async getOrders(userId?: string): Promise<Order[]> {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${this.getBaseUrl()}/api/orders${query}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(i18n.global.t('errors.ordersFetchError'));
    return await res.json();
  }

  async requestReturn(payload: ReturnRequestPayload): Promise<{ success: boolean; message: string; orderId: number; newStatus: string }> {
    const res = await fetch(`${this.getBaseUrl()}/api/orders/return`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: i18n.global.t('errors.returnRequestError') }));
      throw new Error(err.message || i18n.global.t('errors.returnRequestError'));
    }
    return await res.json();
  }

  async processPayment(payload: PaymentPayload): Promise<{ success: boolean; transactionId: string; message: string }> {
    const res = await fetch(`${this.getBaseUrl()}/api/payment/process`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: i18n.global.t('errors.paymentError') }));
      throw new Error(err.message || i18n.global.t('errors.paymentError'));
    }
    return await res.json();
  }

  async seedDatabase(reset = true): Promise<{
    success: boolean;
    message: string;
    categoriesCount: number;
    partsCount: number;
    ordersCount: number;
    returnsCount: number;
  }> {
    const res = await fetch(`${this.getBaseUrl()}/api/seed?reset=${reset}`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: i18n.global.t('errors.seedError') }));
      throw new Error(err.message || i18n.global.t('errors.seedError'));
    }
    return await res.json();
  }

  async getSeedStatus(): Promise<{
    isSeeded: boolean;
    categoriesCount: number;
    partsCount: number;
    ordersCount: number;
    returnsCount: number;
  }> {
    const res = await fetch(`${this.getBaseUrl()}/api/seed/status`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(i18n.global.t('errors.seedStatusError'));
    return await res.json();
  }

  async getPartReviews(partId: number): Promise<ProductReview[]> {
    const res = await fetch(`${this.getBaseUrl()}/api/catalog/parts/${partId}/reviews`, {
      headers: this.getHeaders()
    });
    if (!res.ok) return [];
    return await res.json();
  }

  async addPartReview(partId: number, authorName: string, rating: number, comment: string): Promise<any> {
    const res = await fetch(`${this.getBaseUrl()}/api/catalog/parts/${partId}/reviews`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ authorName, rating, comment })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: i18n.global.t('errors.reviewAddError') }));
      throw new Error(err.message || i18n.global.t('errors.reviewAddError'));
    }
    return await res.json();
  }

  async validateCoupon(code: string, amount: number): Promise<CouponValidationResult> {
    const res = await fetch(`${this.getBaseUrl()}/api/orders/coupons/validate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code, amount })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: i18n.global.t('errors.invalidCoupon') }));
      throw new Error(err.message || i18n.global.t('errors.invalidCoupon'));
    }
    return await res.json();
  }

  async getOrderInvoice(orderId: number): Promise<InvoiceData> {
    const res = await fetch(`${this.getBaseUrl()}/api/orders/${orderId}/invoice`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(i18n.global.t('errors.invoiceFetchError'));
    return await res.json();
  }
}

export const api = new ApiService();
