import { ScrollView, View } from 'react-native';

import Quiz from '../../components/quiz';
import QuizHeader from '../../components/quiz/QuizHeader';
import { QuizProvider } from '../../utils/QuizProvider';
import useResponsive from '../../utils/useResponsive';
import { useSettingsStore } from '../../components/hooks/useSettingsStore';

/**
 * 용어 퀴즈 화면
 * - 투자 관련 용어 퀴즈 게임
 * - 사용자의 투자 지식 향상을 위한 학습 도구
 * - VPP 디자인 시스템 적용
 */
export default function QuizScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  const darkMode = useSettingsStore((s) => s.darkMode);
  return (
    <QuizProvider>
      <View
        style={{ flex: 1, backgroundColor: darkMode ? '#17171B' : '#ffffff' }}
      >
        <QuizHeader />
        <ScrollView
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: 24,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              alignSelf: 'center',
              width: '100%',
              maxWidth: containerMaxWidth,
              paddingHorizontal: horizontalPadding,
              rowGap: 12,
            }}
          >
            <Quiz />
          </View>
        </ScrollView>
      </View>
    </QuizProvider>
  );
}
