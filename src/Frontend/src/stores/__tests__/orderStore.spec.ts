import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useOrderStore } from '../orderStore';
import type { Order } from '@/types';

vi.mock('@/services/api', () => ({
  api: {
    getOrders: vi.fn(),
    createOrder: vi.fn(),
    processPayment: vi.fn(),
    requestReturn: vi.fn(),
    updateOrderStatus: vi.fn()
  }
}));

const mockOrder: Order = {
  id: 101,
  customerName: 'Jan Kowalski',
  email: 'jan@example.com',
  phone: '500600700',
  shippingAddress: 'ul. Marszalkowska 1, Warszawa',
  status: 'Pending',
  totalPrice: 350.00,
  createdAt: new Date().toISOString(),
  paymentMethod: 'Przelewy24',
  returnStatus: 'None',
  items: [
    {
      id: 1,
      partId: 1,
      partName: 'Tarcze hamulcowe Brembo',
      partNumber: 'BRE-09.9772.11',
      unitPrice: 350.00,
      quantity: 1,
      totalPrice: 350.00
    }
  ]
};

describe('useOrderStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty orders and loading false', () => {
    const store = useOrderStore();
    expect(store.orders).toHaveLength(0);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('updates order status in memory correctly', () => {
    const store = useOrderStore();
    store.orders = [{ ...mockOrder }];

    store.updateOrderStatus(101, 'Shipped');

    expect(store.orders[0].status).toBe('Shipped');
  });

  it('fetches orders successfully via api service', async () => {
    const { api } = await import('@/services/api');
    vi.mocked(api.getOrders).mockResolvedValueOnce([{ ...mockOrder }]);

    const store = useOrderStore();
    await store.fetchOrders('user-1');

    expect(api.getOrders).toHaveBeenCalledWith('user-1');
    expect(store.orders).toHaveLength(1);
    expect(store.orders[0].id).toBe(101);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('updates order status to Returned and Approved on requestReturn', async () => {
    const { api } = await import('@/services/api');
    vi.mocked(api.requestReturn).mockResolvedValueOnce({
      success: true,
      message: 'Zwrot zaakceptowany',
      orderId: 101,
      newStatus: 'Returned'
    });

    const store = useOrderStore();
    store.orders = [{ ...mockOrder, status: 'Delivered' }];

    const result = await store.requestReturn({
      orderId: 101,
      reason: 'Wrong part ordered'
    });

    expect(result.success).toBe(true);
    expect(result.orderId).toBe(101);
    expect(store.orders[0].status).toBe('Returned');
    expect(store.orders[0].returnStatus).toBe('Approved');
    expect(store.orders[0].returnReason).toBe('Wrong part ordered');
  });

  it('calls changeOrderStatus api and updates status, tracking number, and courier', async () => {
    const { api } = await import('@/services/api');
    vi.mocked(api.updateOrderStatus).mockResolvedValueOnce({
      ...mockOrder,
      status: 'Shipped',
      trackingNumber: 'DPD-12345678',
      courierName: 'DPD'
    });

    const store = useOrderStore();
    store.orders = [{ ...mockOrder }];

    await store.changeOrderStatus(101, 'Shipped', 'DPD-12345678', 'DPD');

    expect(api.updateOrderStatus).toHaveBeenCalledWith(101, 'Shipped', 'DPD-12345678', 'DPD');
    expect(store.orders[0].status).toBe('Shipped');
    expect(store.orders[0].trackingNumber).toBe('DPD-12345678');
    expect(store.orders[0].courierName).toBe('DPD');
  });
});
