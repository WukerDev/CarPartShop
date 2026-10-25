import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'celadonTheme',
    themes: {
      celadonTheme: {
        dark: true,
        colors: {
          background: '#071314',
          surface: '#0E1C1E',
          'surface-variant': '#14272A',
          primary: '#14B8A6',
          'primary-darken-1': '#0D9488',
          secondary: '#2DD4BF',
          accent: '#5EEAD4',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#06B6D4'
        }
      }
    }
  }
});
