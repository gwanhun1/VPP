import { Client } from '@gradio/client';

export const callHuggingFaceAPI = async (message: string): Promise<string> => {
  try {
    console.log('[HF API] 연결 시작:', 'jungfgsds/vpp');
    const client = await Client.connect('jungfgsds/vpp');
    console.log('[HF API] 연결 성공');
    
    // API 구조 확인
    try {
      const apiInfo = await client.view_api();
      console.log('[HF API] API 정보:', JSON.stringify(apiInfo, null, 2));
    } catch (e) {
      console.log('[HF API] API 정보 조회 실패:', e);
    }
    
    console.log('[HF API] 요청 전송:', message);
    console.log('[HF API] ⏳ Space가 sleep 상태인 경우 첫 응답은 오래 걸릴 수 있습니다. 기다려주세요...');
    
    // 타임아웃 없이 실행
    const startTime = Date.now();
    const result = await client.predict('/generate', { message: message });
    
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[HF API] ✅ 응답 수신 완료 (소요 시간: ${elapsedTime}초)`);
    
    console.log('[HF API] 응답 받음:', result);
    console.log('[HF API] 응답 타입:', typeof result.data);
    console.log('[HF API] 응답 내용:', result.data);
    
    // 응답 데이터 처리
    if (Array.isArray(result.data)) {
      console.log('[HF API] 배열 응답, 첫 요소:', result.data[0]);
      return String(result.data[0] || '응답이 없습니다.');
    }
    
    return String(result.data || '응답이 없습니다.');
  } catch (error) {
    console.error('[HF API] 에러 발생:', error);
    if (error instanceof Error) {
      console.error('[HF API] 에러 메시지:', error.message);
      console.error('[HF API] 에러 스택:', error.stack);
    }
    throw new Error(`API 호출 실패: ${error instanceof Error ? error.message : String(error)}`);
  }
};
