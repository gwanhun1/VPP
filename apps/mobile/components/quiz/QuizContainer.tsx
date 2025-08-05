import { Badge, Card, Text } from '@vpp/shared-ui';
import { useEffect } from 'react';
import { View, ScrollView } from 'react-native';

import { useQuiz, QuizQuestion } from '../../utils/QuizProvider';
import tw from '../../utils/tailwind';

import Description from './Description';
import MultipleChoiceQuestion from './MultipleChoiceQuestion/MultipleChoiceQuestion';
import OXQuestion from './OXQuestion/OXQuestion';
import PointBox from './PointBox';
import QuestionBox from './QuestionBox';
import QuizButtonGroup from './QuizButtonGroup';
import ShortAnswerQuestion from './ShortAnswerQuestion/ShortAnswerQuestion';

const QuizContainer = () => {
  const { setQuestions, currentQuestion, getAnswerState, checkAnswer } =
    useQuiz();

  useEffect(() => {
    setQuestions(MOCK_QUIZ);
  }, [setQuestions]);

  return (
    <Card bordered>
      <View style={tw`px-2 flex gap-4`}>
        <View style={tw`flex-row items-center gap-2`}>
          {/* 타입별 문제 */}
          <Badge variant="primary" rounded="full" size="lg">
            <Text variant="body2" weight="bold" color="primary">
              {currentQuestion?.type === 'multiple'
                ? '객관식'
                : currentQuestion?.type === 'ox'
                ? 'O/X문제'
                : '주관식'}
            </Text>
          </Badge>
          <PointBox />
        </View>

        {currentQuestion && <QuestionBox quiz={currentQuestion} />}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={tw`min-h-20 max-h-96 `}
        >
          {/* 문제 타입별 컴포넌트 렌더링 */}
          {currentQuestion?.type === 'multiple' ? (
            <MultipleChoiceQuestion quiz={currentQuestion} />
          ) : currentQuestion?.type === 'ox' ? (
            <OXQuestion quiz={currentQuestion} />
          ) : currentQuestion?.type === 'short' ? (
            <ShortAnswerQuestion quiz={currentQuestion} />
          ) : null}

          {/* 오답 시 설명 표시 */}
          {currentQuestion &&
            getAnswerState(currentQuestion.id) === 'incorrect' &&
            currentQuestion?.type !== 'short' && (
              <Description
                description={checkAnswer(currentQuestion.id)?.description}
              />
            )}
        </ScrollView>

        {/* 버튼 그룹 */}
        <QuizButtonGroup />
      </View>
    </Card>
  );
};

export default QuizContainer;

const MOCK_QUIZ: QuizQuestion[] = [
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
    description:
      'SMP는 System Marginal Price의 약자로, 전력시장에서 전력 거래의 기준이 되는 도매시장 가격입니다.SMP는 System Marginal Price의 약자로, 전력시장에서 전력 거래의 기준이 되는 도매시장 가격입니다.SMP는 System Marginal Price의 약자로, 전력시장에서 전력 거래의 기준이 되는 도매시장 가격입니다.',
    point: 10,
  },
  // ✅ O/X 문제
  {
    id: 2,
    type: 'ox',
    question: '신재생에너지는 탄소 배출량을 줄이는 데 도움이 된다.',
    options: ['O', 'X'],
    correctAnswer: 'O',
    description:
      '신재생에너지는 화석연료와 달리 발전 과정에서 탄소를 배출하지 않아 탄소 중립에 기여합니다.',
    point: 10,
  },
  // ✅ 주관식 문제
  {
    id: 3,
    type: 'short',
    question: 'REC는 무엇의 약자인가요?',
    correctAnswer: 'Renewable Energy Certificate',
    description:
      'REC(Renewable Energy Certificate)는 신재생에너지 공급인증서로, 신재생에너지 발전량을 증명하는 인증서입니다.',
    point: 15,
  },
];
