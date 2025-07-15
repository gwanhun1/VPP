import React from 'react';
import { isWeb, cn } from '../../utils/platform';

// 웹 환경에서 사용할 뱃지 컴포넌트
const WebBadge = ({
  variant = 'default',
  size = 'md',
  rounded = 'default',
  icon,
  className = '',
  children,
  ...props
}: BadgeProps) => {
  const baseClasses = 'inline-flex items-center font-medium';

  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    point: 'bg-primary text-white',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success bg-opacity-15 text-success',
    warning: 'bg-warning bg-opacity-15 text-warning',
    error: 'bg-error bg-opacity-15 text-error',
    info: 'bg-info bg-opacity-15 text-info',
    outline: 'bg-transparent border border-neutral-300 text-neutral-800',
  };

  const sizeClasses = {
    xs: 'text-xs py-0.5 px-2',
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1 px-2.5',
    lg: 'text-base py-1 px-3',
    base: 'text-base p-1',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    default: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses],
    sizeClasses[size as keyof typeof sizeClasses],
    roundedClasses[rounded as keyof typeof roundedClasses],
    className
  );

  return (
    <span className={classes} {...props}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

// 네이티브 환경에서 사용할 뱃지 컴포넌트
const NativeBadge = ({
  variant = 'default',
  size = 'md',
  rounded = 'default',
  icon,
  className = '',
  children,
  ...props
}: BadgeProps) => {
  // React Native에서는 View 컴포넌트를 사용하므로, 실제 구현은 사용 시 다르게 처리
  // 여기서는 플랫폼 코드 분기점만 제공

  // 실제 사용 시 View 관련 로직으로 대체됨
  return null;
};

export interface BadgeProps {
  /**
   * 뱃지 변형
   * @default 'default'
   */
  variant?:
    | 'default'
    | 'primary'
    | 'point'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'outline';

  /**
   * 뱃지 크기
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'base';

  /**
   * 뱃지 모서리 둥글기
   * @default 'default'
   */
  rounded?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'full';

  /**
   * 아이콘
   */
  icon?: React.ReactNode;

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
 * 플랫폼에 따라 적절한 뱃지 컴포넌트를 내보냄
 */
const Badge = isWeb ? WebBadge : NativeBadge;

export default Badge;
