import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AppLanguage = 'ko' | 'en' | 'fr' | 'ja';

export type AlarmSettings = {
  drNoticeEnabled: boolean;
  marketNoticeEnabled: boolean;
  bidNoticeEnabled: boolean;
};

export type SettingsState = {
  darkMode: boolean;
  language: AppLanguage;
  alarms: AlarmSettings;

  setDarkMode: (value: boolean) => void;
  setLanguage: (lang: AppLanguage) => void;
  setAlarm: (key: keyof AlarmSettings, value: boolean) => void;
  reset: () => void;
};

const initialState: Pick<SettingsState, 'darkMode' | 'language' | 'alarms'> = {
  darkMode: false,
  language: 'ko',
  alarms: {
    drNoticeEnabled: false,
    marketNoticeEnabled: false,
    bidNoticeEnabled: false,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setDarkMode: (value) => set({ darkMode: value }),
      setLanguage: (lang) => set({ language: lang }),
      setAlarm: (key, value) =>
        set((state) => ({ alarms: { ...state.alarms, [key]: value } })),
      reset: () => set({ ...initialState }),
    }),
    {
      name: 'vpp-mobile:settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        darkMode: state.darkMode,
        language: state.language,
        alarms: state.alarms,
      }),
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        if (!persisted || typeof persisted !== 'object') {
          return { ...initialState } satisfies typeof initialState;
        }
        const data = persisted as Partial<SettingsState> & { version?: number };

        const isValidLang = (lng: unknown): lng is AppLanguage =>
          lng === 'ko' || lng === 'en' || lng === 'fr' || lng === 'ja';

        return {
          darkMode:
            typeof data.darkMode === 'boolean'
              ? data.darkMode
              : initialState.darkMode,
          language: isValidLang(data.language)
            ? data.language
            : initialState.language,
          alarms: {
            drNoticeEnabled:
              typeof data.alarms?.drNoticeEnabled === 'boolean'
                ? data.alarms.drNoticeEnabled
                : initialState.alarms.drNoticeEnabled,
            marketNoticeEnabled:
              typeof data.alarms?.marketNoticeEnabled === 'boolean'
                ? data.alarms.marketNoticeEnabled
                : initialState.alarms.marketNoticeEnabled,
            bidNoticeEnabled:
              typeof data.alarms?.bidNoticeEnabled === 'boolean'
                ? data.alarms.bidNoticeEnabled
                : initialState.alarms.bidNoticeEnabled,
          },
        } satisfies Pick<SettingsState, 'darkMode' | 'language' | 'alarms'>;
      },
    }
  )
);
