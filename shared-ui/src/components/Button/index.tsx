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
  onPress?: () => void;
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
      'border-2 border-primary-200 text-primary hover:bg-primary-50 active:bg-primary-100 dark:border-primary-500 dark:text-primary-200 dark:hover:bg-primary-900/40 dark:active:bg-primary-900/60',
    ghost:
      'text-primary hover:bg-primary-50 active:bg-primary-100 dark:text-primary-200 dark:hover:bg-primary-900/40 dark:active:bg-primary-900/60',
    link: 'text-primary underline hover:text-primary-dark active:text-primary-dark p-0 h-auto dark:text-primary-200 dark:hover:text-primary-100 dark:active:text-primary-50',
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
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  onPress,
  ...props
}: ButtonProps) => {
  try {
    const { TouchableOpacity, Text } = require('react-native');

    const buttonStyles = {
      primary: { backgroundColor: '#14287f', color: '#ffffff' },
      secondary: { backgroundColor: '#f6a20b', color: '#ffffff' },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '#14287f',
        borderWidth: 1,
        color: '#14287f',
      },
      ghost: { backgroundColor: 'transparent', color: '#14287f' },
      link: { backgroundColor: 'transparent', color: '#14287f' },
    };

    const sizeStyles = {
      xs: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
      sm: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 },
      md: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 16 },
      lg: { paddingHorizontal: 20, paddingVertical: 10, fontSize: 18 },
      xl: { paddingHorizontal: 24, paddingVertical: 12, fontSize: 20 },
    };

    const buttonStyle = {
      ...buttonStyles[variant],
      ...sizeStyles[size],
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
    };

    const textStyle = {
      color: buttonStyles[variant].color || '#14287f',
      fontSize: sizeStyles[size].fontSize,
      fontWeight: '600',
    };

    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress || onClick}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={textStyle}>{children}</Text>
      </TouchableOpacity>
    );
  } catch {
    return null;
  }
};

const Button = isWeb ? WebButton : NativeButton;

export default Button;
