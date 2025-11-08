/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bengali cultural colors - deep red/maroon representing বাঙালি heritage
        primary: {
          DEFAULT: '#C41E3A',
          50: '#F8E5E9',
          100: '#F1CCD3',
          200: '#E399A7',
          300: '#D5667B',
          400: '#C7334F',
          500: '#C41E3A',
          600: '#9D182E',
          700: '#761223',
          800: '#4F0C17',
          900: '#28060C',
        },
        // Text colors for hierarchy and readability
        text: {
          dark: '#242424',
          medium: '#6B6B6B',
          light: '#9CA3AF',
        },
        // Background and surface colors
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
          tertiary: '#F3F4F6',
        },
        // Border colors
        border: {
          DEFAULT: '#E5E5E5',
          light: '#F3F4F6',
          dark: '#D1D5DB',
        },
        // Accent colors for categories and tags
        accent: {
          red: '#DC2626',
          orange: '#EA580C',
          amber: '#D97706',
          yellow: '#CA8A04',
          green: '#16A34A',
          teal: '#0D9488',
          blue: '#2563EB',
          indigo: '#4F46E5',
          purple: '#9333EA',
          pink: '#DB2777',
        },
      },
      fontFamily: {
        // Serif font for headings, logo, and article titles
        serif: ['Playfair Display', 'serif'],
        // Sans-serif for body text and UI elements
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Custom font sizes for typography scale
        'display-1': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],      // 64px
        'display-2': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],    // 56px
        'display-3': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],      // 48px
        'heading-1': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],    // 40px
        'heading-2': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],      // 32px
        'heading-3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],    // 24px
        'heading-4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],   // 20px
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],    // 18px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],           // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],    // 14px
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],     // 12px
      },
      spacing: {
        // Custom spacing scale for consistent layouts
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
      },
      maxWidth: {
        // Content width constraints
        'container': '1200px',
        'content': '720px',
        'narrow': '600px',
        'wide': '1400px',
      },
      borderRadius: {
        'sm': '0.25rem',   // 4px
        'md': '0.5rem',    // 8px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        '2xl': '1.5rem',   // 24px
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Add line-clamp plugin for text truncation
    require('@tailwindcss/line-clamp'),
  ],
}
