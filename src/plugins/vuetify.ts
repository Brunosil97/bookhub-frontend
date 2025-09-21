/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          'primary': '#5e72e4',
          'secondary': '#8392ab',
          'accent': '#fb6340',
          'error': '#f5365c',
          'warning': '#fb6340',
          'info': '#11cdef',
          'success': '#2dce89',
          'background': '#f8f9fa',
          'surface': '#ffffff',
          'on-primary': '#ffffff',
          'on-secondary': '#ffffff',
          'on-surface': '#344767',
          'on-background': '#344767',
          'grey-lighten-5': '#fafafa',
          'grey-lighten-4': '#f5f5f5',
          'grey-lighten-3': '#eeeeee',
          'grey-lighten-2': '#e0e0e0',
          'grey-lighten-1': '#bdbdbd',
          'grey': '#9e9e9e',
          'grey-darken-1': '#757575',
          'grey-darken-2': '#616161',
          'grey-darken-3': '#424242',
          'grey-darken-4': '#212121',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none; font-weight: 500;',
    },
    VCard: {
      elevation: 1,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
})
