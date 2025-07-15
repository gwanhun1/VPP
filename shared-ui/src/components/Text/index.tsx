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
  className = '',
  children,
  ...props
}: TextProps) => {
  // React Native에서는 Text 컴포넌트를 사용하므로, 실제 구현은 사용 시 다르게 처리
  // 여기서는 플랫폼 코드 분기점만 제공

  // 실제 사용 시 React Native의 Text 관련 로직으로 대체됨
  return null;
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
