import { Client } from '@gradio/client';

// 배열 형식으로 파라미터 전달 (Gradio의 일반적인 방식)
export const callHuggingFaceAPI = async (message: string): Promise<string> => {
  try {
    console.log('[HF API] 연결 시작:', 'jungfgsds/vpp');
    const client = await Client.connect('jungfgsds/vpp');
    console.log('[HF API] 연결 성공');
    
    console.log('[HF API] 요청 전송 (배열 형식):', [message]);
    const result = await client.predict('/generate', [message]);
    console.log('[HF API] 응답 받음:', result);
    
    // result.data가 배열일 수 있으므로 확인
    if (Array.isArray(result.data)) {
      console.log('[HF API] 배열 응답:', result.data);
      return String(result.data[0] || '');
    }
    
    console.log('[HF API] 문자열 응답:', result.data);
    return String(result.data || '');
  } catch (error) {
    console.error('[HF API] 에러 발생:', error);
    throw error;
  }
};
