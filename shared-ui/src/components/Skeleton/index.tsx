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
  rounded = true,
  className = '',
  isOverlay = false,
  isLoading = false,
  children,
}: SkeletonProps) => {
  const baseClass = isLoading
    ? 'bg-neutral-400 dark:bg-neutral-600 animate-pulse border border-neutral-300 dark:border-neutral-500'
    : '';
  const skeletonClass = `${baseClass} ${
    rounded ? 'rounded-md' : 'rounded-none'
  } ${className}`.trim();

  if (!isLoading) {
    // 로딩 끝난 상태면 children만 보여줌
    return <>{children}</>;
  }

  if (isOverlay && children) {
    // 로딩 중이고, 오버레이 방식이면 children 위에 덮기
    return (
      <div className="overflow-hidden relative">
        {children}
        <div className={`absolute inset-0 w-full h-full bg-white`} />
        <div className={`absolute inset-0 w-full h-full ${skeletonClass}`} />
      </div>
    );
  }

  // 로딩 중이고, 오버레이 아니면 그냥 스켈레톤 박스만 보여줌
  // width/height가 명시된 경우에만 인라인 스타일 적용
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
