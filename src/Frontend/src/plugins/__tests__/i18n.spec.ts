import { describe, it, expect } from 'vitest';
import i18n, { setLanguage } from '@/plugins/i18n';

describe('i18n plugin', () => {
  it('initializes with default locale pl', () => {
    expect(i18n.global.locale.value).toBe('pl');
    expect(i18n.global.t('common.brand')).toBe('AUTOPARTS');
    expect(i18n.global.t('navbar.catalog')).toBe('Katalog');
    expect(i18n.global.t('cart.title')).toBe('Twój Koszyk Zakupowy');
  });

  it('switches to en locale and translates correctly', () => {
    setLanguage('en');
    expect(i18n.global.locale.value).toBe('en');
    expect(i18n.global.t('navbar.catalog')).toBe('Catalog');
    expect(i18n.global.t('cart.title')).toBe('Your Shopping Cart');
    setLanguage('pl');
  });

  it('handles email strings without error', () => {
    expect(i18n.global.t('footer.email')).toBe('pomoc@autopartspro.local');
  });
});
