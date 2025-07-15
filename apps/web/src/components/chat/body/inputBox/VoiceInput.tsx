import { useState, useCallback, useEffect } from 'react';

declare global {
  type Window = {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  };
}

type SpeechRecognitionEvent = {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
  error?: string;
};

type SpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: { error: string }) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
};

const getSpeechRecognition = (): (new () => SpeechRecognition) | null => {
  if (typeof window !== 'undefined') {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }
  return null;
};

export const useSpeechToText = (onTextReceived?: (text: string) => void) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<
    'granted' | 'denied' | 'prompt'
  >('prompt');

  // 마이크 권한 확인
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then((result) => {
          setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');

          result.onchange = () => {
            setPermissionStatus(
              result.state as 'granted' | 'denied' | 'prompt'
            );
          };
        });
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setIsSupported(false);
      alert('이 브라우저는 음성 인식을 지원하지 않아요.');
      return;
    }

    // 이미 듣고 있다면 중복 실행 방지
    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR'; // 한국어 인식
    recognition.continuous = false; // 한 문장만 인식
    recognition.interimResults = false; // 중간 결과 제외

    recognition.onstart = () => {
      setIsListening(true);
      console.log('🎤 음성 인식 시작');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log('📝 인식된 텍스트:', transcript);
      setText(transcript);

      // 콜백 함수가 제공되었다면 호출
      if (onTextReceived) {
        onTextReceived(transcript);
      }
    };

    recognition.onerror = (event: { error: string }) => {
      console.error('❌ 인식 오류:', event.error);
      setIsListening(false);

      if (event.error === 'not-allowed') {
        setPermissionStatus('denied');
        alert('마이크 권한이 필요합니다.');
      }
    };

    recognition.onend = () => {
      console.log('🛑 음성 인식 종료');
      setIsListening(false);
    };

    try {
      recognition.start(); // 인식 시작
    } catch (error) {
      console.error('음성 인식 시작 실패:', error);
      setIsListening(false);
    }
  }, [isListening, onTextReceived]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    // isListening 상태를 변경하고 인식은 자연스럽게 종료
  }, []);

  return {
    text,
    isListening,
    isSupported,
    permissionStatus,
    startListening,
    stopListening,
  };
};
