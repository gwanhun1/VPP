import React from 'react';
import { isWeb, cn } from '../../utils/platform';

// 웹 환경에서 사용할 카드 컴포넌트
const WebCard: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'default',
  shadow = 'md',
  bordered = false,
  hoverEffect = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'rounded-lg overflow-hidden transition-all';
  
  const variantClasses = {
    default: 'bg-white',
    primary: 'bg-primary-50',
    secondary: 'bg-secondary-50',
  };

  const paddingClasses = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses],
    paddingClasses[padding as keyof typeof paddingClasses],
    shadowClasses[shadow as keyof typeof shadowClasses],
    bordered && 'border border-neutral-200',
    hoverEffect && 'hover:shadow-lg hover:-translate-y-0.5',
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// 카드 헤더 컴포넌트
export const WebCardHeader: React.FC<CardSectionProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <div className={cn('p-4 border-b border-neutral-200', className)} {...props}>
      {children}
    </div>
  );
};

// 카드 본문 컴포넌트
export const WebCardBody: React.FC<CardSectionProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  );
};

// 카드 푸터 컴포넌트
export const WebCardFooter: React.FC<CardSectionProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <div className={cn('p-4 border-t border-neutral-200', className)} {...props}>
      {children}
    </div>
  );
};

// 네이티브 환경에서 사용할 카드 컴포넌트
const NativeCard: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'default',
  shadow = 'md',
  bordered = false,
  hoverEffect = false,
  className = '',
  children,
  ...props
}) => {
  // React Native에서는 View 컴포넌트를 사용하므로, 실제 구현은 사용 시 다르게 처리
  // 여기서는 플랫폼 코드 분기점만 제공
  
  // 실제 사용 시 View 관련 로직으로 대체됨
  return null;
};

// 네이티브 환경에서 사용할 카드 섹션 컴포넌트들
const NativeCardHeader = () => null;
const NativeCardBody = () => null;
const NativeCardFooter = () => null;

export interface CardProps {
  /**
   * 카드 변형
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'secondary';
  
  /**
   * 패딩 크기
   * @default 'default'
   */
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  
  /**
   * 그림자 크기
   * @default 'md'
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 테두리 표시 여부
   * @default false
   */
  bordered?: boolean;
  
  /**
   * 호버 효과 여부
   * @default false
   */
  hoverEffect?: boolean;
  
  /**
   * 추가 클래스명
   */
  className?: string;
  
  /**
   * 자식 요소
   */
  children: React.ReactNode;
}

export interface CardSectionProps {
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
 * 플랫폼에 따라 적절한 카드 컴포넌트를 내보냄
 */
const Card = isWeb ? WebCard : NativeCard;
export const CardHeader = isWeb ? WebCardHeader : NativeCardHeader;
export const CardBody = isWeb ? WebCardBody : NativeCardBody;
export const CardFooter = isWeb ? WebCardFooter : NativeCardFooter;

export default Card;
