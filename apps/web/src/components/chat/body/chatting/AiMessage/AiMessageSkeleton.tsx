import { Skeleton } from '@vpp/shared-ui';
import type { PropsWithChildren } from 'react';

type AiMessageSkeletonProps = {
  isLoading: boolean;
};

const AiMessageSkeleton = ({ isLoading, children }: PropsWithChildren<AiMessageSkeletonProps>) => {
  return (
    <Skeleton
      isOverlay
      rounded
      isLoading={isLoading}
      className="rounded-tl-sm transition-opacity duration-300 rounded-4xl"
    >
      {children}
    </Skeleton>
  );
};

export default AiMessageSkeleton;
