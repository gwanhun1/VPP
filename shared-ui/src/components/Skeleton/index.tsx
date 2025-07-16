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
  width = '100%',
  height = '100%',
  rounded = true,
  className = '',
  isOverlay = false,
  isLoading = false,
  children,
}: SkeletonProps) => {
  const skeletonClass = ` bg-gray-200 rounded-full dark:bg-gray-700 ${
    rounded ? 'rounded-md' : ''
  } ${className}`;

  if (!isLoading) {
    // 로딩 끝난 상태면 children만 보여줌
    return <>{children}</>;
  }

  if (isOverlay && children) {
    // 로딩 중이고, 오버레이 방식이면 children 위에 덮기
    return (
      <div className="relative overflow-hidden">
        {children}
        <div className={`absolute inset-0 w-full h-full bg-white`} />
        <div className={`absolute inset-0 w-full h-full ${skeletonClass}`} />
      </div>
    );
  }

  // 로딩 중이고, 오버레이 아니면 그냥 스켈레톤 박스만 보여줌
  return (
    <div
      className={skeletonClass}
      style={{
        width,
        height,
      }}
    />
  );
};

/**
 * Native 스켈레톤 (아직 미지원)
 */
const NativeSkeleton = (_: SkeletonProps) => null;

/**
 * 플랫폼 분기
 */
const Skeleton = isWeb ? WebSkeleton : NativeSkeleton;

export default Skeleton;
