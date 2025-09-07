import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 앱(기기) 단위로 유지할 설정 상태
export type AppLanguage = 'ko' | 'en' | 'fr' | 'ja';

export interface AlarmSettings {
  drNoticeEnabled: boolean;
  marketNoticeEnabled: boolean;
  bidNoticeEnabled: boolean;
}

export interface SettingsState {
  darkMode: boolean;
  language: AppLanguage;
  alarms: AlarmSettings;

  // actions
  setDarkMode: (value: boolean) => void;
  setLanguage: (lang: AppLanguage) => void;
  setAlarm: (key: keyof AlarmSettings, value: boolean) => void;
  reset: () => void;
}

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
      // 저장 크기 절감을 위해 필요한 키만 저장
      partialize: (state) => ({
        darkMode: state.darkMode,
        language: state.language,
        alarms: state.alarms,
      }),
      version: 2,
      // 마이그레이션이 필요할 때 사용 (타입 안전)
      migrate: (persisted: unknown, version: number) => {
        if (!persisted || typeof persisted !== 'object') {
          return { ...initialState } satisfies typeof initialState;
        }
        const data = persisted as Partial<SettingsState> & { version?: number };

        // v1 -> v2: language 타입 확장 ('fr', 'ja' 추가)
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
