// Dify API 호출 함수
const DIFY_API_KEY = 'app-jSwMKNtI1NmPU9EujLxrSdYy';
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

export interface DifyResponse {
  answer: string;
  conversation_id: string;
  message_id: string;
}

export const callDifyAPI = async (
  message: string,
  conversationId?: string
): Promise<string> => {
  try {
    console.log('[Dify API] 요청 전송:', message);

    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: conversationId || '',
        user: 'web-user',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Dify API] HTTP 에러:', response.status, errorText);
      throw new Error(`Dify API 호출 실패: ${response.status} ${errorText}`);
    }

    const data: DifyResponse = await response.json();
    console.log('[Dify API] 응답 수신:', data);

    return data.answer || '응답이 없습니다.';
  } catch (error) {
    console.error('[Dify API] 에러 발생:', error);
    if (error instanceof Error) {
      console.error('[Dify API] 에러 메시지:', error.message);
    }
    throw new Error(
      `Dify API 호출 실패: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
