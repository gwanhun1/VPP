import React from 'react';
import { isWeb } from '../../utils/platform';

export type SkeletonProps = {
  /**
   * 너비와 높이 (명시적 스켈레톤일 경우)
   */
  width?: string | number;
  height?: string | number;
  /**
   * 둥글기 여부
   */
  rounded?: boolean;
  /**
   * 클래스
   */
  className?: string;
  /**
   * Wrapper 방식으로 children 위를 덮을지 여부
   */
  isOverlay?: boolean;
  /**
   * 로딩 중 여부
   */
  isLoading?: boolean;
  /**
   * 실제 콘텐츠
   */
  children?: React.ReactNode;
};

/**
 * 웹 전용 Skeleton
 */
const WebSkeleton = ({
  width,
  height,
  rounded,
  className = '',
  isOverlay = false,
  isLoading = false,
  children,
}: SkeletonProps) => {
  const baseClass = isLoading
    ? 'bg-neutral-400 dark:bg-neutral-600 animate-pulse border border-neutral-300 dark:border-neutral-500'
    : '';
  const roundedClass =
    typeof rounded === 'boolean'
      ? rounded
        ? 'rounded-md'
        : 'rounded-none'
      : '';
  const skeletonClass = `${baseClass} ${className} ${roundedClass}`.trim();

  if (!isLoading) {
    return children as React.ReactElement | null;
  }

  if (isOverlay && children) {
    return (
      <div className="overflow-hidden relative">
        {children}
        <div className={`absolute inset-0 w-full h-full bg-white`} />
        <div className={`absolute inset-0 w-full h-full ${skeletonClass}`} />
      </div>
    );
  }

  const style: React.CSSProperties | undefined =
    width !== undefined || height !== undefined ? { width, height } : undefined;

  return <div className={skeletonClass} style={style} />;
};

/**
 * Native 스켈레톤
 */
const NativeSkeleton = ({
  width = '100%',
  height = 20,
  rounded = true,
  isOverlay = false,
  isLoading = true,
  children,
}: SkeletonProps) => {
  try {
    const { View } = require('react-native');

    if (!isLoading) {
      return children;
    }

    const skeletonStyle = {
      width: typeof width === 'string' ? width : width,
      height: typeof height === 'string' ? height : height,
      backgroundColor: '#e2e8f0',
      borderRadius: rounded ? 6 : 0,
      opacity: 0.7,
    };

    if (isOverlay && children) {
      return (
        <View style={{ position: 'relative' }}>
          {children}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              ...skeletonStyle,
            }}
          />
        </View>
      );
    }

    return <View style={skeletonStyle} />;
  } catch {
    return null;
  }
};

/**
 * 플랫폼 분기
 */
const Skeleton = isWeb ? WebSkeleton : NativeSkeleton;

export default Skeleton;
