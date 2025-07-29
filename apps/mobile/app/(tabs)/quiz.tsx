import { Text } from 'react-native';

import AppHeader from '../../components/common/AppHeader';

/**
 * 용어 퀴즈 화면
 * - 투자 관련 용어 퀴즈 게임
 * - 사용자의 투자 지식 향상을 위한 학습 도구
 * - VPP 디자인 시스템 적용
 */
export default function QuizScreen() {
  return (
    <>
      <AppHeader
        title="용어 퀴즈"
        subtitle="투자 용어를 재미있게 학습해보세요"
      />
      <Text>용어 퀴즈</Text>
    </>
  );
}
