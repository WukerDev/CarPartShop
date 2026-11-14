import { defineStore } from 'pinia';
import { api } from '@/services/api';
import type { AppNotification } from '@/types';

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as AppNotification[],
    unreadCount: 0,
    loading: false,
    error: null as string | null
  }),

  getters: {
    hasUnread: (state) => state.unreadCount > 0,
    unreadNotifications: (state) => state.notifications.filter(n => !n.isRead)
  },

  actions: {
    async fetchNotifications() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.getNotifications();
        this.notifications = res.notifications;
        this.unreadCount = res.unreadCount;
      } catch (err: any) {
        this.error = err.message || 'Nie udało się pobrać powiadomień';
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(id: number) {
      try {
        const item = this.notifications.find(n => n.id === id);
        if (item && !item.isRead) {
          item.isRead = true;
          if (this.unreadCount > 0) this.unreadCount--;
        }
        const res = await api.markNotificationAsRead(id);
        this.unreadCount = res.unreadCount;
      } catch (err: any) {
        console.error('Błąd oznaczania powiadomienia:', err);
      }
    },

    async markAllAsRead() {
      try {
        this.notifications.forEach(n => { n.isRead = true; });
        this.unreadCount = 0;
        await api.markAllNotificationsAsRead();
      } catch (err: any) {
        console.error('Błąd oznaczania wszystkich powiadomień:', err);
      }
    },

    addNotification(notif: AppNotification, unreadCount?: number) {
      const existing = this.notifications.find(n => n.id === notif.id);
      if (!existing) {
        this.notifications.unshift(notif);
        if (unreadCount !== undefined) {
          this.unreadCount = unreadCount;
        } else if (!notif.isRead) {
          this.unreadCount++;
        }
      }
    }
  }
});
