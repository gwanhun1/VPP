type HuggingFaceResponse = {
  data: string[];
};

type HuggingFaceErrorResponse = {
  error?: string;
};

export const callHuggingFaceAPI = async (message: string): Promise<string> => {
  const apiUrl = import.meta.env.VITE_HF_API_URL;
  
  if (!apiUrl) {
    throw new Error('Hugging Face API URL이 설정되지 않았습니다.');
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [message],
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as HuggingFaceErrorResponse;
      throw new Error(
        errorData.error || `API 호출 실패: ${response.status}`
      );
    }

    const result = (await response.json()) as HuggingFaceResponse;
    
    if (!result.data || !result.data[0]) {
      throw new Error('응답 데이터가 올바르지 않습니다.');
    }

    return result.data[0];
  } catch (error) {
    console.error('[HuggingFace API] 호출 오류:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};
