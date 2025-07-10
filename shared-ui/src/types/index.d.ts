declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// NativeWind와 관련된 타입 정의
declare module 'nativewind' {
  import type { ComponentType } from 'react';
  
  export function styled<T extends ComponentType<any>>(
    component: T,
    options?: any
  ): T;
}
