import { getCurrentUser } from '@vpp/core-logic';
import { saveUserQuizResult } from '@vpp/core-logic/services/userService';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 단일 퀴즈 문제 타입
export type Quiz = {
  id: number;
  type: 'multiple' | 'ox' | 'short';
  question: string;
  options?: string[];
  correctAnswer: string;
  description: string;
  point: number;
};

// 일자별 퀴즈 데이터 타입
export type QuizQuestion = {
  day: number;
  quiz: Quiz[];
};

// 답변 결과 타입
export type AnswerResult = {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  description: string;
};

// 퀴즈 결과 타입
export type QuizResult = {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  wrongAnswers: AnswerResult[];
  totalScore: number;
};

type AnswerType = Record<number, string>;
type AnswerContextType = {
  answer: AnswerType;
  setAnswer: (id: number, value: string) => void;
  checkAnswer: (questionId: number) => AnswerResult | null;
  answerStates: Record<number, 'correct' | 'incorrect' | null>;
  getAnswerState: (questionId: number) => 'correct' | 'incorrect' | null;
};
type QuizContextType = {
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
};
type QuestionContextType = {
  allQuizData: QuizQuestion[];
  currentDay: number;
  setCurrentDay: (day: number) => void;
  questions: Quiz[];
  setQuestions: (questions: QuizQuestion[]) => void;
  currentQuestion: Quiz | null;
};
type ResultContextType = {
  results: AnswerResult[];
  addResult: (result: AnswerResult) => void;
  getQuizResult: () => QuizResult;
  resetQuiz: () => void;
  submitResults: (payload?: { quizId?: string; userId?: string }) => Promise<{
    ok: boolean;
    message?: string;
  }>;
};

const QuizContext = createContext<
  | (QuizContextType &
      AnswerContextType &
      QuestionContextType &
      ResultContextType)
  | undefined
>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [answer, _setAnswer] = useState<AnswerType>({});
  const [step, _setStep] = useState<number>(0);
  const [allQuizData, _setAllQuizData] = useState<QuizQuestion[]>([]);
  const [currentDay, _setCurrentDay] = useState<number>(1);
  const [questions, _setQuestions] = useState<Quiz[]>([]);
  const [results, _setResults] = useState<AnswerResult[]>([]);
  const [answerStates, _setAnswerStates] = useState<
    Record<number, 'correct' | 'incorrect' | null>
  >({});

  // 답변 설정 및 즉시 검증
  const setAnswer = (id: number, value: string) => {
    _setAnswer((prev) => ({ ...prev, [id]: value }));

    const question = questions.find((q) => q.id === id);
    if (!question) {
      return;
    }

    // 주관식은 입력 시에는 결과/상태를 초기화만 하고, 별도 확인 동작에서 채점
    if (question.type === 'short') {
      _setAnswerStates((prev) => ({
        ...prev,
        [id]: null,
      }));
      _setResults((prev) => prev.filter((r) => r.questionId !== id));
      return;
    }

    // 객관식/OX는 선택과 동시에 즉시 채점
    const normalizedValue = value.toLowerCase().trim();
    const normalizedCorrect = question.correctAnswer.toLowerCase().trim();
    const isCorrect = normalizedValue === normalizedCorrect;

    _setAnswerStates((prev) => ({
      ...prev,
      [id]: isCorrect ? 'correct' : 'incorrect',
    }));

    const result: AnswerResult = {
      questionId: id,
      userAnswer: value,
      correctAnswer: question.correctAnswer,
      isCorrect,
      description: question.description,
    };
    addResult(result);
  };

  // 답변 상태 조회
  const getAnswerState = (
    questionId: number
  ): 'correct' | 'incorrect' | null => {
    return answerStates[questionId] || null;
  };

  // 답변 검증 (기존 호환성을 위해 유지)
  const checkAnswer = (questionId: number): AnswerResult | null => {
    const existing = results.find((r) => r.questionId === questionId);
    if (existing) {
      return existing;
    }

    const question = questions.find((q) => q.id === questionId);
    if (!question) {
      return null;
    }

    const userValue = answer[questionId];
    if (typeof userValue !== 'string') {
      return null;
    }

    const normalizedValue = userValue.toLowerCase().trim();
    const normalizedCorrect = question.correctAnswer.toLowerCase().trim();
    const isCorrect = normalizedValue === normalizedCorrect;

    _setAnswerStates((prev) => ({
      ...prev,
      [questionId]: isCorrect ? 'correct' : 'incorrect',
    }));

    const result: AnswerResult = {
      questionId,
      userAnswer: userValue,
      correctAnswer: question.correctAnswer,
      isCorrect,
      description: question.description,
    };

    addResult(result);
    return result;
  };

  // 단계 관리
  const setStep = (step: number) => {
    _setStep(Math.max(0, Math.min(step, questions.length - 1)));
  };

  const nextStep = () => {
    if (step < questions.length - 1) {
      _setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      _setStep(step - 1);
    }
  };

  // 문제 관리
  const setQuestions = (quizData: QuizQuestion[]) => {
    _setAllQuizData(quizData);
    // 첫 번째 날의 퀴즈를 기본으로 설정
    if (quizData.length > 0 && quizData[0].quiz) {
      _setQuestions(quizData[0].quiz);
      _setCurrentDay(quizData[0].day);
    }
  };

  const setCurrentDay = (day: number) => {
    const dayData = allQuizData.find((data) => data.day === day);
    if (dayData) {
      _setCurrentDay(day);
      _setQuestions(dayData.quiz);
      _setStep(0); // 새로운 날을 선택하면 처음부터 시작
      _setAnswer({});
      _setAnswerStates({});
    }
  };

  const currentQuestion = questions[step] || null;

  // 결과 관리
  const addResult = (result: AnswerResult) => {
    _setResults((prev) => {
      const filtered = prev.filter((r) => r.questionId !== result.questionId);
      return [...filtered, result];
    });
  };

  const getQuizResult = (): QuizResult => {
    const totalQuestions = questions.length;
    const correctCount = results.filter((r) => r.isCorrect).length;
    const wrongCount = results.filter((r) => !r.isCorrect).length;
    const wrongAnswers = results.filter((r) => !r.isCorrect);
    const totalScore = correctCount * 10; // 문제당 10점

    return {
      totalQuestions,
      correctCount,
      wrongCount,
      wrongAnswers,
      totalScore,
    };
  };

  const resetQuiz = () => {
    _setAnswer({});
    _setStep(0);
    _setResults([]);
    _setAnswerStates({});
  };

  // Firebase에 퀴즈 결과 저장
  const submitResults: ResultContextType['submitResults'] = async (payload) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.providerId === 'anonymous') {
        return {
          ok: false,
          message: '로그인이 필요합니다.',
        };
      }

      const summary = getQuizResult();
      const quizType = payload?.quizId ?? '전력시장 용어 퀴즈';
      const score = Math.round(
        (summary.correctCount / summary.totalQuestions) * 100
      );
      const timeSpent = 0; // TODO: 실제 소요 시간 계산 추가

      await saveUserQuizResult(
        quizType,
        score,
        summary.totalQuestions,
        summary.correctCount,
        timeSpent
      );

      return {
        ok: true,
        message: `퀴즈 결과가 저장되었습니다. 점수: ${score}점`,
      };
    } catch (e) {
      console.error('퀴즈 결과 저장 실패:', e);
      return {
        ok: false,
        message:
          e instanceof Error ? e.message : '퀴즈 결과 저장에 실패했습니다.',
      };
    }
  };

  return (
    <QuizContext.Provider
      value={{
        // 답변 관련
        answer,
        setAnswer,
        checkAnswer,
        answerStates,
        getAnswerState,
        // 단계 관련
        step,
        setStep,
        nextStep,
        prevStep,
        // 문제 관련
        allQuizData,
        currentDay,
        setCurrentDay,
        questions,
        setQuestions,
        currentQuestion,
        // 결과 관련
        results,
        addResult,
        getQuizResult,
        resetQuiz,
        submitResults,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz는 QuizProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
};
