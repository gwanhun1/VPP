import React from 'react';
import { isWeb, cn } from '../../utils/platform';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  onClick?: () => void;
  children: React.ReactNode;
  isIconOnly?: boolean;
};

const WebButton = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  rounded = 'md',
  children,
  className = '',
  isIconOnly = false,
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-medium transition-all focus:outline-none';

  const variantClasses = {
    primary:
      'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark',
    secondary:
      'bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-dark',
    outline:
      'border-2 border-primary-200 text-primary hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-primary hover:bg-primary-50 active:bg-primary-100',
    link: 'text-primary underline hover:text-primary-dark active:text-primary-dark p-0 h-auto',
  };

  const sizeClasses = {
    xs: 'xs: text-[14px] sm:text-xs py-1.5 px-2',
    sm: 'xs: text-xs sm:text-xs py-2 px-3',
    md: 'xs: text-xs sm:text-sm py-2 px-4',
    lg: 'xs: text-md sm:text-lg py-3 px-5',
    xl: 'xs: text-lg sm:text-xl py-3.5 px-6',
  };

  const stateClasses = {
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'opacity-70 cursor-wait',
    fullWidth: 'w-full',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  const iconOnlyClasses = isIconOnly
    ? {
        xs: 'p-1 aspect-square',
        sm: 'p-1.5 aspect-square',
        md: 'p-2 aspect-square',
        lg: 'p-2.5 aspect-square',
        xl: 'p-3 aspect-square',
      }
    : {};

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    isIconOnly ? iconOnlyClasses[size] : sizeClasses[size],
    roundedClasses[rounded],
    disabled && stateClasses.disabled,
    loading && stateClasses.loading,
    fullWidth && stateClasses.fullWidth,
    className
  );

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {loading ? <span>로딩중...</span> : children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

const NativeButton = ({
  // 동일하게 props 구조 유지
  ...props
}: ButtonProps) => {
  return null;
};

/**
 * 플랫폼에 따라 적절한 버튼 컴포넌트를 내보냄
 */
const Button = isWeb ? WebButton : NativeButton;

export default Button;
