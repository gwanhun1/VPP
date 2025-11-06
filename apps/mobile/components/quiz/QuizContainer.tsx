import { Badge, Card, Text } from '@vpp/shared-ui';
import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

import { QUIZ_MOCK } from '../../data/quizMock';
import { useQuiz } from '../../utils/QuizProvider';
import tw from '../../utils/tailwind';

import Description from './Description';
import MultipleChoiceQuestion from './MultipleChoiceQuestion/MultipleChoiceQuestion';
import OXQuestion from './OXQuestion/OXQuestion';
import PointBox from './PointBox';
import QuestionBox from './QuestionBox';
import QuizButtonGroup from './QuizButtonGroup';
import ShortAnswerQuestion from './ShortAnswerQuestion/ShortAnswerQuestion';

const QuizContainer = () => {
  const { setQuestions, currentQuestion, getAnswerState, checkAnswer, step } =
    useQuiz();

  const fade = useRef(new Animated.Value(1)).current;
  const translate = useRef(new Animated.Value(0)).current;
  const prevStepRef = useRef(step);

  useEffect(() => {
    setQuestions(QUIZ_MOCK);
  }, [setQuestions]);

  // 단계 변경 시 컨텐츠 전환 애니메이션
  useEffect(() => {
    const direction = step > prevStepRef.current ? 1 : -1;
    fade.setValue(0);
    translate.setValue(12 * direction);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    prevStepRef.current = step;
  }, [step, fade, translate]);

  return (
    <Card bordered>
      <View style={[tw`px-2 flex`, { rowGap: 16 }]}>
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

        <Animated.View
          style={{
            opacity: fade,
            transform: [{ translateX: translate }],
            rowGap: 12,
          }}
        >
          {currentQuestion && <QuestionBox quiz={currentQuestion} />}
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
        </Animated.View>

        {/* 버튼 그룹 */}
        <QuizButtonGroup />
      </View>
    </Card>
  );
};

export default QuizContainer;
