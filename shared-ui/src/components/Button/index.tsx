import React from 'react';
import { isWeb, cn } from '../../utils/platform';

// 웹 환경에서 사용할 타입과 컴포넌트
const WebButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded transition-all focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-dark',
    outline: 'border border-primary text-primary hover:bg-primary-50 active:bg-primary-100',
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

  const classes = cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses],
    sizeClasses[size as keyof typeof sizeClasses],
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

// 네이티브 환경에서 사용할 타입과 컴포넌트
const NativeButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}) => {
  // React Native에서는 Pressable 컴포넌트를 사용하므로, 실제 구현은 사용 시 다르게 처리
  // 여기서는 플랫폼 코드 분기점만 제공
  
  // 실제 사용 시 View와 Pressable 관련 로직으로 대체됨
  return null;
};

export interface ButtonProps {
  /**
   * 버튼 변형
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  
  /**
   * 버튼 크기
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  
  /**
   * 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * 로딩 상태 여부
   * @default false
   */
  loading?: boolean;
  
  /**
   * 왼쪽 아이콘
   */
  leftIcon?: React.ReactNode;
  
  /**
   * 오른쪽 아이콘
   */
  rightIcon?: React.ReactNode;
  
  /**
   * 추가 클래스명
   */
  className?: string;
  
  /**
   * 클릭 핸들러
   */
  onClick?: () => void;
  
  /**
   * 자식 요소
   */
  children: React.ReactNode;
}

/**
 * 플랫폼에 따라 적절한 버튼 컴포넌트를 내보냄
 */
const Button = isWeb ? WebButton : NativeButton;

export default Button;
