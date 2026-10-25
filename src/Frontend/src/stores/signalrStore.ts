import { defineStore } from 'pinia';
import { signalRService } from '@/services/signalrClient';
import { useCatalogStore } from './catalogStore';
import { useOrderStore } from './orderStore';
import i18n from '@/plugins/i18n';

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export const useSignalRStore = defineStore('signalr', {
  state: () => ({
    connected: false,
    notifications: [] as NotificationItem[],
    activeToast: null as NotificationItem | null
  }),

  actions: {
    init() {
      signalRService.startConnection();

      signalRService.onOrderStatusChanged((orderId, status, message) => {
        const orderStore = useOrderStore();
        orderStore.updateOrderStatus(orderId, status);
        this.addNotification('info', i18n.global.t('signalr.orderStatus', { orderId, message }));
      });

      signalRService.onStockUpdate((partId, newStock) => {
        const catalogStore = useCatalogStore();
        catalogStore.updateStock(partId, newStock);
      });

      signalRService.onReturnUpdate((orderId, returnStatus, message) => {
        this.addNotification('warning', i18n.global.t('signalr.returnUpdate', { orderId, message }));
      });

      signalRService.onOrderPlaced((orderId, customerName, total) => {
        this.addNotification('success', i18n.global.t('signalr.orderPlaced', { orderId, customerName, total: total.toFixed(2) }));
      });

      this.connected = true;
    },

    addNotification(type: 'info' | 'success' | 'warning' | 'error', message: string) {
      const item: NotificationItem = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        message,
        timestamp: new Date()
      };
      this.notifications.unshift(item);
      this.activeToast = item;
    },

    clearToast() {
      this.activeToast = null;
    }
  }
});
