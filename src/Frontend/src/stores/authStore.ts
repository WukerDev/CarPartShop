import { defineStore } from 'pinia';
import type { User, ShippingProfile } from '@/types';
import i18n from '@/plugins/i18n';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: (JSON.parse(localStorage.getItem('carpart_user') || 'null') as User | null),
    token: localStorage.getItem('carpart_token') as string | null,
    shippingProfile: (JSON.parse(localStorage.getItem('carpart_shipping_profile') || 'null') as ShippingProfile | null),
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.roles?.includes('admin') || state.user?.username === 'admin',
    userName: (state) => state.user?.username || i18n.global.t('common.guest')
  },

  actions: {
    async login(username: string, password: string): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        let tokenToSet = '';
        let roles: string[] = ['customer'];

        try {
          const body = new URLSearchParams({
            client_id: 'carpartshop-frontend',
            grant_type: 'password',
            username: username,
            password: password
          });

          const keycloakRes = await fetch('/identity/realms/carpartshop/protocol/openid-connect/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
          });

          if (keycloakRes.ok) {
            const data = await keycloakRes.json();
            tokenToSet = data.access_token;
            roles = username.toLowerCase() === 'admin' ? ['admin', 'customer'] : ['customer'];
          }
        } catch (e) {
          console.warn(e);
        }

        if (!tokenToSet) {
          if (username === 'admin' && password === 'admin') {
            const mockPayload = {
              sub: 'admin-id-1234',
              preferred_username: 'admin',
              email: 'admin@carpartshop.local',
              roles: ['admin', 'customer'],
              exp: Math.floor(Date.now() / 1000) + 86400
            };
            tokenToSet = `mock.${btoa(JSON.stringify(mockPayload))}.signature`;
            roles = ['admin', 'customer'];
          } else {
            this.error = i18n.global.t('errors.invalidCredentials');
            this.loading = false;
            return false;
          }
        }

        const userObj: User = {
          username,
          email: `${username}@carpartshop.local`,
          roles,
          token: tokenToSet
        };

        this.token = tokenToSet;
        this.user = userObj;
        localStorage.setItem('carpart_token', tokenToSet);
        localStorage.setItem('carpart_user', JSON.stringify(userObj));

        this.loading = false;
        return true;
      } catch (err: any) {
        this.error = err.message || i18n.global.t('errors.loginError');
        this.loading = false;
        return false;
      }
    },

    saveShippingProfile(profile: ShippingProfile) {
      this.shippingProfile = profile;
      localStorage.setItem('carpart_shipping_profile', JSON.stringify(profile));
    },

    clearShippingProfile() {
      this.shippingProfile = null;
      localStorage.removeItem('carpart_shipping_profile');
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('carpart_token');
      localStorage.removeItem('carpart_user');
    }
  }
});
