import { createRouter, createWebHistory } from 'vue-router';
import CatalogView from '@/views/CatalogView.vue';
import CartView from '@/views/CartView.vue';
import CheckoutView from '@/views/CheckoutView.vue';
import OrdersView from '@/views/OrdersView.vue';
import ReturnsView from '@/views/ReturnsView.vue';
import LoginView from '@/views/LoginView.vue';

const router = createRouter({
  history: createWebHistory('/portal/'),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: CatalogView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView
    },
    {
      path: '/returns',
      name: 'returns',
      component: ReturnsView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
