import React from 'react';
import { isWeb, cn } from '../../utils/platform';

export interface ButtonProps {
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
}

const WebButton: React.FC<ButtonProps> = ({
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
  ...props
}) => {
  const baseClasses = 'font-medium transition-all focus:outline-none';

  const variantClasses = {
    primary:
      'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark',
    secondary:
      'bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-dark',
    outline:
      'border border-primary text-primary hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-primary hover:bg-primary-50 active:bg-primary-100',
    link: 'text-primary underline hover:text-primary-dark active:text-primary-dark p-0 h-auto',
  };

  const sizeClasses = {
    xs: 'text-xs py-1 px-2',
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
    xl: 'text-xl py-3 px-6',
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

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded], // ✅ radius 추가
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

const NativeButton: React.FC<ButtonProps> = ({
  // 동일하게 props 구조 유지
  ...props
}) => {
  return null;
};

/**
 * 플랫폼에 따라 적절한 버튼 컴포넌트를 내보냄
 */
const Button = isWeb ? WebButton : NativeButton;

export default Button;
