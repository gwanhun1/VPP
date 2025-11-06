import type { Timestamp } from 'firebase/firestore';

/**
 * Firebase Timestamp 타입 가드
 */
export function isFirebaseTimestamp(value: unknown): value is Timestamp {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.toDate === 'function' &&
    typeof candidate.seconds === 'number' &&
    typeof candidate.nanoseconds === 'number'
  );
}

/**
 * Firestore의 serverTimestamp()로부터 온 값을 Timestamp로 변환
 */
export function toFirebaseTimestamp(value: unknown): Timestamp | null {
  if (isFirebaseTimestamp(value)) {
    return value;
  }
  return null;
}

/**
 * 문자열 또는 숫자를 숫자로 변환
 */
export function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
}

/**
 * 안전한 배열 접근 (undefined 대신 null 반환)
 */
export function safeArrayAccess<T>(arr: T[] | undefined, index: number): T | null {
  if (!arr || index < 0 || index >= arr.length) {
    return null;
  }
  return arr[index] ?? null;
}

/**
 * 객체의 속성 안전하게 접근
 */
export function safePropertyAccess<T extends Record<string, unknown>, K extends string>(
  obj: T | undefined | null,
  key: K
): T[K] | null {
  if (!obj || typeof obj !== 'object') {
    return null;
  }
  const value = obj[key];
  return value === undefined ? null : value;
}

/**
 * Error 객체 타입 가드
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Error 메시지 추출 (안전)
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * Firebase Auth 에러 타입 가드
 */
export function isFirebaseAuthError(
  error: unknown
): error is { code: string; message: string } {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as Record<string, unknown>;
  return typeof candidate.code === 'string' && typeof candidate.message === 'string';
}
