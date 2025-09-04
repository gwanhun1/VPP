import { useStore } from 'zustand';
import { appStore, selectors, type AppStore, type ChatMessage } from '@vpp/core-logic';

export { selectors };

export function useAuthUser() {
  return useStore(appStore, selectors.authUser);
}

export function useInputText() {
  return useStore(appStore, selectors.inputText);
}

export function useMessages() {
  return useStore(appStore, selectors.messages);
}

export function useAppActions() {
  return useStore(appStore, (s: AppStore) => ({
    setAuthUser: s.setAuthUser,
    setInputText: s.setInputText,
    addMessage: s.addMessage,
    clearMessages: s.clearMessages,
    reset: s.reset,
  }));
}

export type { AppStore, ChatMessage };
