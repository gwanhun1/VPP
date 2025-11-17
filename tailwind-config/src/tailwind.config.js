module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 메인 색상 - 기존 유지
        primary: {
          DEFAULT: '#14287f', // 메인 색상 (파랑 계열) - 기존 유지
          light: '#4456a5',
          dark: '#0a1345',
          50: '#e9ecf5',
          100: '#c7cfea',
          200: '#a4b0dd',
          300: '#8292d0',
          400: '#5d73c3',
          500: '#1A3297',
          600: '#2e4395',
          700: '#14287f',
          800: '#0f1f64',
          900: '#091549',
        },

        // MUI Indigo 색상 추가
        indigo: {
          DEFAULT: '#3f51b5',
          light: '#757ce8',
          dark: '#002884',
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5',
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e',
        },

        // 서브 색상 - MUI Orange로 변경
        secondary: {
          DEFAULT: '#ff9800', // MUI Orange 500
          light: '#ffcc80',
          dark: '#e65100',
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        },

        // red 색상 - MUI Red로 변경
        red: {
          DEFAULT: '#f44336', // MUI Red 500
          light: '#ef9a9a',
          dark: '#b71c1c',
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ef9a9a',
          300: '#e57373',
          400: '#ef5350',
          500: '#f44336',
          600: '#e53935',
          700: '#d32f2f',
          800: '#c62828',
          900: '#b71c1c',
        },

        // 중립 색상 (기존 유지)
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },

        // 추가 색상 1 - MUI Teal
        teal: {
          DEFAULT: '#009688',
          light: '#4db6ac', // 300 값
          dark: '#00796b', // 700 값
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688',
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
        },

        // 추가 색상 2 - MUI Purple
        purple: {
          DEFAULT: '#9c27b0',
          light: '#ba68c8', // 300 값
          dark: '#7b1fa2', // 700 값
          50: '#f3e5f5',
          100: '#e1bee7',
          200: '#ce93d8',
          300: '#ba68c8',
          400: '#ab47bc',
          500: '#9c27b0',
          600: '#8e24aa',
          700: '#7b1fa2',
          800: '#6a1b9a',
          900: '#4a148c',
        },

        // 추가 색상 3 - MUI Green
        green: {
          DEFAULT: '#4caf50',
          light: '#81c784', // 300 값
          dark: '#388e3c', // 700 값
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },

        // 추가 색상 4 - MUI Amber
        amber: {
          DEFAULT: '#ffc107',
          light: '#ffd54f', // 300 값
          dark: '#ffa000', // 700 값
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },

        // 추가 색상 5 - MUI Light Blue
        lightBlue: {
          DEFAULT: '#03a9f4',
          light: '#4fc3f7', // 300 값
          dark: '#0288d1', // 700 값
          50: '#e1f5fe',
          100: '#b3e5fc',
          200: '#81d4fa',
          300: '#4fc3f7',
          400: '#29b6f6',
          500: '#03a9f4',
          600: '#039be5',
          700: '#0288d1',
          800: '#0277bd',
          900: '#01579b',
        },

        // 추가 색상 6 - MUI Pink
        pink: {
          DEFAULT: '#e91e63',
          light: '#f06292', // 300 값
          dark: '#c2185b', // 700 값
          50: '#fce4ec',
          100: '#f8bbd0',
          200: '#f48fb1',
          300: '#f06292',
          400: '#ec407a',
          500: '#e91e63',
          600: '#d81b60',
          700: '#c2185b',
          800: '#ad1457',
          900: '#880e4f',
        },

        // 추가 색상 7 - MUI Cyan
        cyan: {
          DEFAULT: '#00bcd4',
          light: '#4dd0e1', // 300 값
          dark: '#0097a7', // 700 값
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00bcd4',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
        },
      },

      // 타이포그래피 설정 (기존 유지)
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        '2xl': '3rem', // 48px
        '3xl': '4rem', // 64px
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)',
        lg: '0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.08)',
        xl: '0 20px 30px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.07)',
        elevated:
          '0 12px 40px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem', // 2px
        DEFAULT: '0.25rem', // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem', // 8px
        xl: '0.75rem', // 12px
        '2xl': '1rem', // 16px
        '3xl': '1.5rem', // 24px
        '4xl': '2rem', // 32px
        full: '9999px',
      },
      screens: {
        xs: '120px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        fast: '100ms',
        slow: '300ms',
      },
      zIndex: {
        behind: -1,
        default: 1,
        dropdown: 10,
        sticky: 20,
        fixed: 30,
        modal: 40,
        popover: 50,
        tooltip: 60,
        highest: 999,
      },
    },
  },
  plugins: [],
};
