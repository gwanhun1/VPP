import { createStore } from 'zustand/vanilla';
import type { AuthUser } from '../firebase/types';

// 공용 메시지 타입 (웹/모바일 공통)
export type ChatMessage = {
  id: number;
  text: string;
  isUser: boolean;
  // Date 직렬화 안전성을 위해 string으로 저장 (플랫폼 간 전송 고려)
  timestamp: string;
};

export type AppState = {
  authUser: AuthUser | null;
  inputText: string;
  messages: ChatMessage[];
};

export type AppActions = {
  setAuthUser: (user: AuthUser | null) => void;
  setInputText: (text: string) => void;
  addMessage: (text: string, isUser: boolean) => void;
  clearMessages: () => void;
  reset: () => void;
};

export type AppStore = AppState & AppActions;

const initialState: AppState = {
  authUser: null,
  inputText: '',
  messages: [],
};

export const appStore = createStore<AppStore>()((set) => ({
  ...initialState,
  setAuthUser: (user) => set({ authUser: user }),
  setInputText: (text) => set({ inputText: text }),
  addMessage: (text, isUser) =>
    set((s) => ({
      messages: [
        ...s.messages,
        {
          id: Date.now(),
          text,
          isUser,
          timestamp: new Date().toISOString(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
  reset: () => set({ ...initialState }),
}));

// 선택자 유틸 (선택적 사용)
export const selectors = {
  authUser: (s: AppStore) => s.authUser,
  inputText: (s: AppStore) => s.inputText,
  messages: (s: AppStore) => s.messages,
};
