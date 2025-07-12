module.exports = {
  theme: {
    extend: {
      colors: {
        // 메인 및 서브 색상 - 다양한 음영으로 확장
        primary: {
          DEFAULT: '#14287f', // 메인 색상
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
        secondary: {
          DEFAULT: '#f6a20b', // 서브 색상
          light: '#fac157',
          dark: '#d88c00',
          50: '#fff8e9',
          100: '#fee9bf',
          200: '#fdd994',
          300: '#fcc969',
          400: '#fbba3e',
          500: '#f6a20b',
          600: '#d88c00',
          700: '#b57400',
          800: '#925d00',
          900: '#704700',
        },
        // 중립 색상 (텍스트, 배경 등)
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
        // 상태 색상
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      // 타이포그래피 설정
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
      // 간격 시스템
      spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        '2xl': '3rem', // 48px
        '3xl': '4rem', // 64px
      },
      // 그림자 설정
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)',
        lg: '0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.08)',
        xl: '0 20px 30px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.07)',
        elevated:
          '0 12px 40px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.06)',
      },
      // 테두리 반경 설정
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
      // 미디어 쿼리 브레이크포인트
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      // 애니메이션 지속 시간
      transitionDuration: {
        DEFAULT: '150ms',
        fast: '100ms',
        slow: '300ms',
      },
      // Z-index 계층
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
