import React from 'react';
import { isWeb, cn } from '../../utils/platform';

// 웹 환경에서 사용할 텍스트 컴포넌트
const WebText = ({
  variant = 'body',
  color = 'default',
  weight = 'normal',
  align = 'left',
  transform,
  truncate = false,
  className = '',
  children,
  ...props
}: TextProps) => {
  const baseClasses = 'transition-colors';

  const variantClasses = {
    h1: 'xs:text-3xl sm:text-4xl leading-tight tracking-tight',
    h2: 'xs:text-2xl sm:text-3xl leading-tight tracking-tight',
    h3: 'xs:text-xl sm:text-2xl leading-tight tracking-tight',
    h4: 'xs:text-lg sm:text-xl leading-tight tracking-tight',
    h5: 'xs:text-base sm:text-lg leading-tight tracking-tight',
    h6: 'xs:text-[14px] sm:text-base leading-tight font-medium tracking-tight',
    subtitle1: 'xs:text-md sm:text-lg tracking-tight',
    subtitle2: 'xs:text-[14px] sm:text-base tracking-tight',
    body: 'xs:text-[12px] sm:text-[14px] tracking-tight',
    body2: 'xs:text-[10px] sm:text-[12px] tracking-tight',
    caption: 'xs:text-[8px] sm:text-[10px] tracking-tight',
    caption2: 'xs:text-[6px] sm:text-[8px] tracking-tight',
    overline: 'xs:text-[6px] sm:text-[6px] uppercase tracking-wider',
  };

  const colorClasses = {
    default: 'text-neutral-900',
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-neutral-400',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
    white: 'text-white',
  };

  const weightClasses = {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const transformClasses = {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    normalCase: 'normal-case',
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses],
    colorClasses[color as keyof typeof colorClasses],
    weightClasses[weight as keyof typeof weightClasses],
    alignClasses[align as keyof typeof alignClasses],
    transform && transformClasses[transform as keyof typeof transformClasses],
    truncate && 'truncate',
    className
  );

  // 헤더 변형인 경우 해당 HTML 태그를 사용
  if (variant === 'h1')
    return (
      <h1 className={classes} {...props}>
        {children}
      </h1>
    );
  if (variant === 'h2')
    return (
      <h2 className={classes} {...props}>
        {children}
      </h2>
    );
  if (variant === 'h3')
    return (
      <h3 className={classes} {...props}>
        {children}
      </h3>
    );
  if (variant === 'h4')
    return (
      <h4 className={classes} {...props}>
        {children}
      </h4>
    );
  if (variant === 'h5')
    return (
      <h5 className={classes} {...props}>
        {children}
      </h5>
    );
  if (variant === 'h6')
    return (
      <h6 className={classes} {...props}>
        {children}
      </h6>
    );

  // 나머지 경우에는 p 태그 사용
  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
};

// 네이티브 환경에서 사용할 텍스트 컴포넌트
const NativeText = ({
  variant = 'body',
  color = 'default',
  weight = 'normal',
  align = 'left',
  transform,
  truncate = false,
  children,
  ...props
}: TextProps) => {
  try {
    const { Text } = require('react-native');
    
    // 사이즈 매핑
    const variantStyles = {
      h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
      h2: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
      h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
      h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
      h5: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
      h6: { fontSize: 16, fontWeight: '500', lineHeight: 22 },
      subtitle1: { fontSize: 18, fontWeight: '400', lineHeight: 24 },
      subtitle2: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
      body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
      body2: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
      caption: { fontSize: 10, fontWeight: '400', lineHeight: 14 },
      caption2: { fontSize: 8, fontWeight: '400', lineHeight: 12 },
      overline: { fontSize: 10, fontWeight: '500', lineHeight: 14, textTransform: 'uppercase' }
    };
    
    // 색상 매핑
    const colorStyles = {
      default: '#1e293b',
      primary: '#14287f',
      secondary: '#f6a20b',
      muted: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      white: '#ffffff'
    };
    
    // 무게 매핑
    const weightStyles = {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    };
    
    const textStyle = {
      ...variantStyles[variant],
      color: colorStyles[color],
      fontWeight: weightStyles[weight],
      textAlign: align,
      textTransform: transform,
      ...(truncate && { numberOfLines: 1 })
    };
    
    return (
      <Text style={textStyle} {...props}>
        {children}
      </Text>
    );
  } catch {
    return null;
  }
};

export interface TextProps {
  /**
   * 텍스트 변형
   * @default 'body'
   */
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body'
    | 'body2'
    | 'caption'
    | 'caption2'
    | 'overline';

  /**
   * 텍스트 색상
   * @default 'default'
   */
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'muted'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'white';

  /**
   * 폰트 가중치
   * @default 'normal'
   */
  weight?:
    | 'thin'
    | 'extralight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | 'black';

  /**
   * 텍스트 정렬
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right' | 'justify';

  /**
   * 텍스트 변환
   */
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normalCase';

  /**
   * 텍스트 잘림 여부
   * @default false
   */
  truncate?: boolean;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 자식 요소
   */
  children: React.ReactNode;
}

/**
 * 플랫폼에 따라 적절한 텍스트 컴포넌트를 내보냄
 */
const Text = isWeb ? WebText : NativeText;

export default Text;
