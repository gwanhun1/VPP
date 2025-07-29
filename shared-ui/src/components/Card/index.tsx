import React from 'react';
import { isWeb, cn } from '../../utils/platform';

// 웹 환경에서 사용할 카드 컴포넌트
const WebCard = ({
  variant = 'default',
  padding = 'default',
  shadow = 'md',
  bordered = false,
  hoverEffect = false,
  className = '',
  children,
  ...props
}: CardProps) => {
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
export const WebCardHeader = ({
  className = '',
  children,
  ...props
}: CardSectionProps) => {
  return (
    <div
      className={cn('p-4 border-b border-neutral-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// 카드 본문 컴포넌트
export const WebCardBody = ({
  className = '',
  children,
  ...props
}: CardSectionProps) => {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  );
};

// 카드 푸터 컴포넌트
export const WebCardFooter = ({
  className = '',
  children,
  ...props
}: CardSectionProps) => {
  return (
    <div
      className={cn('p-4 border-t border-neutral-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// 네이티브 환경에서 사용할 카드 컴포넌트
const NativeCard = ({
  variant = 'default',
  padding = 'default',
  shadow = 'md',
  bordered = false,
  children,
  ...props
}: CardProps) => {
  try {
    const { View } = require('react-native');
    
    const variantStyles = {
      default: { backgroundColor: '#ffffff' },
      primary: { backgroundColor: '#e9ecf5' }, // primary-50 색상
      secondary: { backgroundColor: '#fff8e9' } // secondary-50 색상
    };
    
    const paddingStyles = {
      none: { padding: 0 },
      xs: { padding: 8 },
      sm: { padding: 12 },
      default: { padding: 16 },
      lg: { padding: 24 },
      xl: { padding: 32 }
    };
    
    const shadowStyles = {
      none: {},
      sm: { 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4
      },
      xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 8
      }
    };
    
    const cardStyle = {
      borderRadius: 8,
      overflow: 'hidden',
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...shadowStyles[shadow],
      ...(bordered && { borderWidth: 1, borderColor: '#e2e8f0' })
    };
    
    return (
      <View style={cardStyle} {...props}>
        {children}
      </View>
    );
  } catch {
    return null;
  }
};

// 네이티브 환경에서 사용할 카드 섹션 컴포넌트들
const NativeCardHeader = ({ children, ...props }: CardSectionProps) => {
  try {
    const { View } = require('react-native');
    return (
      <View style={{ marginBottom: 12 }} {...props}>
        {children}
      </View>
    );
  } catch {
    return null;
  }
};

const NativeCardBody = ({ children, ...props }: CardSectionProps) => {
  try {
    const { View } = require('react-native');
    return (
      <View {...props}>
        {children}
      </View>
    );
  } catch {
    return null;
  }
};

const NativeCardFooter = ({ children, ...props }: CardSectionProps) => {
  try {
    const { View } = require('react-native');
    return (
      <View style={{ marginTop: 12 }} {...props}>
        {children}
      </View>
    );
  } catch {
    return null;
  }
};

export type CardProps = {
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
};

export type CardSectionProps = {
  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 자식 요소
   */
  children: React.ReactNode;
};

/**
 * 플랫폼에 따라 적절한 카드 컴포넌트를 내보냄
 */
const Card = isWeb ? WebCard : NativeCard;
export const CardHeader = isWeb ? WebCardHeader : NativeCardHeader;
export const CardBody = isWeb ? WebCardBody : NativeCardBody;
export const CardFooter = isWeb ? WebCardFooter : NativeCardFooter;

export default Card;
