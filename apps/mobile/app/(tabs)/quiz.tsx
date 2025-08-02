import { View } from 'react-native';

import Quiz from '../../components/quiz';
import QuizHeader from '../../components/quiz/QuizHeader';
import { QuizProvider } from '../../utils/QuizProvider';

/**
 * 용어 퀴즈 화면
 * - 투자 관련 용어 퀴즈 게임
 * - 사용자의 투자 지식 향상을 위한 학습 도구
 * - VPP 디자인 시스템 적용
 */
export default function QuizScreen() {
  return (
    <View>
      <QuizProvider>
        <QuizHeader />
        <Quiz />
      </QuizProvider>
    </View>
  );
}
