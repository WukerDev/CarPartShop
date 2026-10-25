import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'darkAutoTheme',
    themes: {
      darkAutoTheme: {
        dark: true,
        colors: {
          background: '#0B0F19',
          surface: '#151D2C',
          'surface-variant': '#1F293D',
          primary: '#E11D48', 
          'primary-darken-1': '#BE123C',
          secondary: '#38BDF8', 
          accent: '#F59E0B', 
          success: '#10B981', 
          warning: '#FBBF24',
          error: '#EF4444',
          info: '#3B82F6'
        }
      }
    }
  }
});
