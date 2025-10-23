import { Client } from '@gradio/client';

// 테스트용: 여러 방식 시도
export const testHuggingFaceAPI = async (message: string) => {
  const client = await Client.connect('jungfgsds/vpp');

  console.log('=== 방법 1: 객체 형식 ===');
  try {
    const result1 = await Promise.race([
      client.predict('/generate', { message: message }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 10000)
      ),
    ]);
    console.log('방법 1 성공:', result1);
  } catch (e) {
    console.error('방법 1 실패:', e);
  }

  console.log('\n=== 방법 2: 배열 형식 ===');
  try {
    const result2 = await Promise.race([
      client.predict('/generate', [message]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 10000)
      ),
    ]);
    console.log('방법 2 성공:', result2);
  } catch (e) {
    console.error('방법 2 실패:', e);
  }
};

// 실제 사용할 함수 - 배열 형식으로 시도
export const callHuggingFaceAPI = async (message: string): Promise<string> => {
  try {
    console.log('[HF API] 연결 시작:', 'jungfgsds/vpp');
    const client = await Client.connect('jungfgsds/vpp');
    console.log('[HF API] 연결 성공');

    console.log('[HF API] 요청 전송 (배열):', [message]);

    // 10초 타임아웃 설정
    const result = await Promise.race([
      client.predict('/generate', [message]),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('API 호출 시간 초과 (10초)')), 10000)
      ),
    ]);

    console.log('[HF API] 응답 받음:', result);
    console.log('[HF API] 응답 data:', result.data);

    // Gradio는 보통 배열로 응답
    if (Array.isArray(result.data)) {
      return String(result.data[0] || '응답이 없습니다.');
    }

    return String(result.data || '응답이 없습니다.');
  } catch (error) {
    console.error('[HF API] 에러:', error);
    throw new Error(
      `API 호출 실패: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
