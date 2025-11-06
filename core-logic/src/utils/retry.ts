/**
 * Retry 옵션
 */
export type RetryOptions = {
  maxAttempts?: number;
  delayMs?: number;
  exponentialBackoff?: boolean;
};

/**
 * 지정된 횟수만큼 비동기 함수를 재시도하는 유틸리티
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 200,
    exponentialBackoff = true,
  } = options;

  let attempt = 0;
  let lastError: unknown;

  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt += 1;
      
      if (attempt >= maxAttempts) {
        break;
      }

      const delay = exponentialBackoff
        ? delayMs * attempt
        : delayMs;
      
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError ?? new Error('Operation failed after retries');
}
