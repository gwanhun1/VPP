import React from 'react';
import { isWeb, cn } from '../../utils/platform';
import { useIsDarkMode } from '../../utils/theme';

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
    default:
      'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100',
    primary:
      'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100',
    point: 'bg-primary text-white dark:bg-primary-600 dark:text-white',
    secondary:
      'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-100',
    success: 'bg-success bg-opacity-15 text-success',
    warning: 'bg-warning bg-opacity-15 text-warning',
    error: 'bg-error bg-opacity-15 text-error',
    info: 'bg-info bg-opacity-15 text-info',
    outline:
      'bg-transparent border border-neutral-300 text-neutral-800 dark:border-neutral-600 dark:text-neutral-100',
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

const NativeBadge = ({
  variant = 'default',
  size = 'md',
  rounded = 'default',
  icon,
  children,
  ...props
}: BadgeProps) => {
  const isDark = useIsDarkMode();
  try {
    const { View, Text } = require('react-native');

    const variantStyles = {
      default: {
        backgroundColor: isDark ? '#0f1f64' : '#f1f5f9',
        color: isDark ? '#e5e7eb' : '#1e293b',
      },
      primary: {
        backgroundColor: isDark ? '#0f1f64' : '#e9ecf5',
        color: isDark ? '#8292d0' : '#14287f',
      },
      point: {
        backgroundColor: isDark ? '#1A3297' : '#14287f',
        color: '#ffffff',
      },
      secondary: {
        backgroundColor: isDark ? '#1f2937' : '#fff8e9',
        color: isDark ? '#fbbf24' : '#f6a20b',
      },
      success: {
        backgroundColor: isDark
          ? 'rgba(16, 185, 129, 0.18)'
          : 'rgba(16, 185, 129, 0.15)',
        color: '#10b981',
      },
      warning: {
        backgroundColor: isDark
          ? 'rgba(245, 158, 11, 0.2)'
          : 'rgba(245, 158, 11, 0.15)',
        color: '#f59e0b',
      },
      error: {
        backgroundColor: isDark
          ? 'rgba(239, 68, 68, 0.22)'
          : 'rgba(239, 68, 68, 0.15)',
        color: '#ef4444',
      },
      info: {
        backgroundColor: isDark
          ? 'rgba(59, 130, 246, 0.2)'
          : 'rgba(59, 130, 246, 0.15)',
        color: '#3b82f6',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDark ? '#4b5563' : '#cbd5e1',
        color: isDark ? '#e5e7eb' : '#1e293b',
      },
    };

    const sizeStyles = {
      xs: { paddingVertical: 2, paddingHorizontal: 8, fontSize: 10 },
      sm: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 10 },
      md: { paddingVertical: 4, paddingHorizontal: 12, fontSize: 12 },
      lg: { paddingVertical: 6, paddingHorizontal: 16, fontSize: 14 },
      base: { paddingVertical: 8, paddingHorizontal: 20, fontSize: 16 },
    };

    const roundedStyles = {
      none: { borderRadius: 0 },
      sm: { borderRadius: 2 },
      default: { borderRadius: 4 },
      md: { borderRadius: 6 },
      lg: { borderRadius: 8 },
      full: { borderRadius: 999 },
    };

    const badgeStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...roundedStyles[rounded],
    };

    const textStyle = {
      color: variantStyles[variant].color,
      fontSize: sizeStyles[size].fontSize,
      fontWeight: '500',
    };

    return (
      <View style={badgeStyle} {...props}>
        {icon && <View style={{ marginRight: 4 }}>{icon}</View>}
        <Text style={textStyle}>{children}</Text>
      </View>
    );
  } catch {
    return null;
  }
};

export type BadgeProps = {
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
};

/**
 * 플랫폼에 따라 적절한 뱃지 컴포넌트를 내보냄
 */
const Badge = isWeb ? WebBadge : NativeBadge;

export default Badge;
