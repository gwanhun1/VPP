declare const document: Document;
/**
 * 현재 플랫폼이 웹인지 네이티브인지 확인하는 유틸리티
 */
export const isWeb = typeof document !== 'undefined';
export const isNative = !isWeb;

/**
 * 클래스 이름을 결합하는 유틸리티 함수
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
