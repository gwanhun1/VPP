/**
 * 현재 실행 환경이 웹 브라우저인지 여부. SSR에서도 안전하게 동작하도록 globalThis 기반 체크를 사용합니다.
 */
export const isWeb =
  typeof globalThis !== 'undefined' && typeof (globalThis as { document?: unknown }).document !== 'undefined';

/**
 * React Native 환경 감지. navigator.product === 'ReactNative' 패턴을 사용합니다.
 */
export const isNative =
  typeof globalThis !== 'undefined' &&
  Boolean((globalThis as { navigator?: { product?: string } }).navigator?.product === 'ReactNative');

/**
 * 클래스 이름을 결합하는 유틸리티 함수
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
