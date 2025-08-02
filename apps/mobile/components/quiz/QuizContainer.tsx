import { Badge, Card, Text } from '@vpp/shared-ui';
import { useEffect } from 'react';
import { View } from 'react-native';

import { useQuiz } from '../../utils/QuizProvider';
import tw from '../../utils/tailwind';

import MultipleChoiceQuestion from './MultipleChoiceQuestion/MultipleChoiceQuestion';
import QuestionBox from './QuestionBox';
import QuizButtonGroup from './QuizButtonGroup';
import ShortAnswerQuestion from './ShortAnswerQuestion/ShortAnswerQuestion';

const QuizContainer = () => {
  const { step, setQuestion } = useQuiz();

  useEffect(() => {
    setQuestion(MOCK_QUIZ);
  }, [MOCK_QUIZ]);

  return (
    <Card bordered>
      <View style={tw`px-2 flex gap-4`}>
        {/* 타입별 문제 */}
        <Badge variant="primary" rounded="full" size="lg">
          <Text variant="body2" weight="bold" color="primary">
            {MOCK_QUIZ[step]?.type === 'multiple' ? '객관식' : '주관식'}
          </Text>
        </Badge>
        <QuestionBox quiz={MOCK_QUIZ[step]} />

        {/* 객관식: MultipleChoiceQuestion 
        주관식: ShortAnswerQuestion */}
        {MOCK_QUIZ[step]?.type === 'multiple' ? (
          <MultipleChoiceQuestion quiz={MOCK_QUIZ[step]} />
        ) : (
          <ShortAnswerQuestion quiz={MOCK_QUIZ[step]} />
        )}

        {/* 버튼 그룹 */}
        <QuizButtonGroup />
      </View>
    </Card>
  );
};

export default QuizContainer;

const MOCK_QUIZ = [
  // ✅ 객관식 문제
  {
    id: 1,
    type: 'multiple',
    question: 'SMP(계통한계가격)는 무엇을 의미하나요?',
    options: [
      '전력의 생산 단가',
      '전력의 도매시장 가격',
      '소비자의 전기요금',
      '한전의 수익률',
    ],
    correctAnswer: '전력의 도매시장 가격',
    description: '전력시장 가격의 기준이 되는 값입니다.',
  },
  {
    id: 2,
    type: 'multiple',
    question: '전력의 도매시장 가격은 무엇을 의미하나요?',
    options: ['도매시장의 가격', '소비자의 전기요금', '한전의 수익률'],
    correctAnswer: '도매시장의 가격',
    description: '전력시장 가격의 기준이 되는 값입니다.',
  },

  // ✅ 주관식 문제
  {
    id: 3,
    type: 'short',
    question: 'REC는 무엇의 약자인가요?',
    correctAnswer: 'Renewable Energy Certificate',
    description: '신재생에너지 공급 인증서에 대한 문제입니다.',
  },
];
