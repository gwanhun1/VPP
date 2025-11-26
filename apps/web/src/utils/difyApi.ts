const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;
const DIFY_API_URL =
  import.meta.env.VITE_DIFY_API_URL || 'https://api.dify.ai/v1/chat-messages';

export interface DifyResponse {
  answer: string;
  conversation_id: string;
  message_id: string;
}

export const callDifyAPI = async (
  message: string,
  conversationId?: string,
  userId = 'web-user'
): Promise<{ answer: string; conversationId: string }> => {
  if (!DIFY_API_KEY) {
    throw new Error('Dify API Key가 설정되지 않았습니다.');
  }

  try {
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: conversationId || '',
        user: userId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Dify API] HTTP 에러:', response.status, errorText);

      // 에러 메시지 파싱
      let errorMessage = `API 호출 실패 (${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          if (
            errorData.message.includes('quota') ||
            errorData.message.includes('RESOURCE_EXHAUSTED')
          ) {
            errorMessage =
              'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
          } else {
            errorMessage = errorData.message;
          }
        }
      } catch {
        // JSON 파싱 실패 시 원본 텍스트 사용
      }

      throw new Error(errorMessage);
    }

    const data: DifyResponse = await response.json();

    return {
      answer: data.answer || '응답이 없습니다.',
      conversationId: data.conversation_id || '',
    };
  } catch (error) {
    console.error('[Dify API] 에러 발생:', error);
    if (error instanceof Error) {
      console.error('[Dify API] 에러 메시지:', error.message);
      throw error;
    }
    throw new Error(`Dify API 호출 실패: ${String(error)}`);
  }
};
