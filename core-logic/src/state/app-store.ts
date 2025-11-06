import { createStore } from 'zustand/vanilla';
import type { AuthUser } from '../firebase/types';

export type AppChatMessage = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
};

export type AppState = {
  authUser: AuthUser | null;
  inputText: string;
  messages: AppChatMessage[];
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

export const selectors = {
  authUser: (s: AppStore) => s.authUser,
  inputText: (s: AppStore) => s.inputText,
  messages: (s: AppStore) => s.messages,
};
