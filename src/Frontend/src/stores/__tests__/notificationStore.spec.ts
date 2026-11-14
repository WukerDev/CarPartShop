import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotificationStore } from '../notificationStore';
import type { AppNotification } from '@/types';

vi.mock('@/services/api', () => ({
  api: {
    getNotifications: vi.fn(),
    markNotificationAsRead: vi.fn(),
    markAllNotificationsAsRead: vi.fn(),
    createNotification: vi.fn()
  }
}));

const mockNotifications: AppNotification[] = [
  {
    id: 1,
    title: '🔥 Nowa promocja: Kod TUNING20 (-20%)',
    message: 'Skorzystaj z kodu TUNING20 przy kasie!',
    type: 'promo',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/portal/'
  },
  {
    id: 2,
    title: '📦 Darmowa dostawa od 300 zł',
    message: 'Darmowa dostawa kurierem DPD lub Paczkomatem InPost.',
    type: 'info',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/portal/'
  }
];

describe('useNotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('starts with empty notifications and unreadCount 0', () => {
    const store = useNotificationStore();
    expect(store.notifications).toHaveLength(0);
    expect(store.unreadCount).toBe(0);
    expect(store.hasUnread).toBe(false);
  });

  it('fetches notifications and updates state and unreadCount', async () => {
    const { api } = await import('@/services/api');
    vi.mocked(api.getNotifications).mockResolvedValueOnce({
      unreadCount: 2,
      totalCount: 2,
      notifications: [...mockNotifications]
    });

    const store = useNotificationStore();
    await store.fetchNotifications();

    expect(api.getNotifications).toHaveBeenCalled();
    expect(store.notifications).toHaveLength(2);
    expect(store.unreadCount).toBe(2);
    expect(store.hasUnread).toBe(true);
  });

  it('marks a notification as read and decrements unreadCount', async () => {
    const { api } = await import('@/services/api');
    vi.mocked(api.markNotificationAsRead).mockResolvedValueOnce({
      success: true,
      unreadCount: 1
    });

    const store = useNotificationStore();
    store.notifications = JSON.parse(JSON.stringify(mockNotifications));
    store.unreadCount = 2;

    await store.markAsRead(1);

    expect(api.markNotificationAsRead).toHaveBeenCalledWith(1);
    expect(store.notifications[0].isRead).toBe(true);
    expect(store.unreadCount).toBe(1);
  });

  it('marks all notifications as read and resets unreadCount to 0', async () => {
    const { api } = await import('@/services/api');
    vi.mocked(api.markAllNotificationsAsRead).mockResolvedValueOnce({
      success: true,
      updatedCount: 2,
      unreadCount: 0
    });

    const store = useNotificationStore();
    store.notifications = JSON.parse(JSON.stringify(mockNotifications));
    store.unreadCount = 2;

    await store.markAllAsRead();

    expect(api.markAllNotificationsAsRead).toHaveBeenCalled();
    expect(store.notifications.every(n => n.isRead)).toBe(true);
    expect(store.unreadCount).toBe(0);
    expect(store.hasUnread).toBe(false);
  });

  it('adds a new notification in real-time from SignalR', () => {
    const store = useNotificationStore();
    store.notifications = [];
    store.unreadCount = 0;

    const newNotification: AppNotification = {
      id: 99,
      title: 'Nowe powiadomienie',
      message: 'Treść',
      type: 'promo',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    store.addNotification(newNotification, 1);

    expect(store.notifications).toHaveLength(1);
    expect(store.notifications[0].id).toBe(99);
    expect(store.unreadCount).toBe(1);
    expect(store.hasUnread).toBe(true);
  });
});
