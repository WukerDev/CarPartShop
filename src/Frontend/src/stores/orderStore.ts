import { defineStore } from 'pinia';
import { api } from '@/services/api';
import type { Order, ReturnRequestPayload, PaymentPayload } from '@/types';
import { useCartStore } from './cartStore';
import i18n from '@/plugins/i18n';

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
    loading: false,
    error: null as string | null,
    lastCreatedOrder: null as Order | null
  }),

  actions: {
    async fetchOrders(userId?: string) {
      this.loading = true;
      this.error = null;
      try {
        this.orders = await api.getOrders(userId);
      } catch (err: any) {
        this.error = err.message || i18n.global.t('errors.ordersFetchError');
      } finally {
        this.loading = false;
      }
    },

    async checkout(customerInfo: {
      customerName: string;
      email: string;
      phone: string;
      shippingAddress: string;
      paymentMethod: string;
      courierName?: string;
      discountCode?: string;
    }): Promise<Order> {
      const cartStore = useCartStore();
      this.loading = true;
      this.error = null;

      try {
        const items = cartStore.items.map(i => ({
          partId: i.part.id,
          quantity: i.quantity
        }));

        const newOrder = await api.createOrder({
          ...customerInfo,
          discountCode: customerInfo.discountCode || (cartStore.couponCode || undefined),
          items
        });

        this.lastCreatedOrder = newOrder;
        this.orders.unshift(newOrder);
        cartStore.removeCoupon();
        cartStore.clearCart();
        return newOrder;
      } catch (err: any) {
        this.error = err.message || i18n.global.t('errors.orderCreateError');
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async processMockPayment(payload: PaymentPayload) {
      return await api.processPayment(payload);
    },

    async requestReturn(payload: ReturnRequestPayload) {
      this.loading = true;
      this.error = null;
      try {
        const result = await api.requestReturn(payload);
        const order = this.orders.find(o => o.id === payload.orderId);
        if (order) {
          order.status = 'Returned';
          order.returnStatus = 'Approved';
          order.returnReason = payload.reason;
        }
        return result;
      } catch (err: any) {
        this.error = err.message || i18n.global.t('errors.returnRequestError');
        throw err;
      } finally {
        this.loading = false;
      }
    },

    updateOrderStatus(orderId: number, status: string) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
    }
  }
});
