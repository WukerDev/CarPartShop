import { createI18n } from 'vue-i18n';
import pl from '@/locales/pl';
import en from '@/locales/en';

const savedLocale = typeof localStorage !== 'undefined' ? (localStorage.getItem('carpart_locale') || 'pl') : 'pl';

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    pl,
    en
  }
});

export function setLanguage(lang: 'pl' | 'en') {
  if (i18n.global.locale) {
    (i18n.global.locale as any).value = lang;
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('carpart_locale', lang);
  }
  if (typeof document !== 'undefined') {
    document.querySelector('html')?.setAttribute('lang', lang);
  }
}

export default i18n;
