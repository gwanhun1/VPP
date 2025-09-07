import { api } from '@vpp/core-logic';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 퀴즈 문제 타입 정의
export type QuizQuestion = {
  id: number;
  type: 'multiple' | 'ox' | 'short';
  question: string;
  options?: string[]; // 객관식에서만 사용
  correctAnswer: string;
  description: string;
  point?: number; // 문제별 점수
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
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
  currentQuestion: QuizQuestion | null;
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
  const [questions, _setQuestions] = useState<QuizQuestion[]>([]);
  const [results, _setResults] = useState<AnswerResult[]>([]);
  const [answerStates, _setAnswerStates] = useState<
    Record<number, 'correct' | 'incorrect' | null>
  >({});

  // 답변 설정 및 즉시 검증
  const setAnswer = (id: number, value: string) => {
    _setAnswer((prev) => ({ ...prev, [id]: value }));

    // 즉시 답변 검증
    const question = questions.find((q) => q.id === id);
    if (question) {
      const isCorrect =
        value.toLowerCase().trim() ===
        question.correctAnswer.toLowerCase().trim();
      _setAnswerStates((prev) => ({
        ...prev,
        [id]: isCorrect ? 'correct' : 'incorrect',
      }));

      // 결과 저장
      const result: AnswerResult = {
        questionId: id,
        userAnswer: value,
        correctAnswer: question.correctAnswer,
        isCorrect,
        description: question.description,
      };
      addResult(result);
    }
  };

  // 답변 상태 조회
  const getAnswerState = (
    questionId: number
  ): 'correct' | 'incorrect' | null => {
    return answerStates[questionId] || null;
  };

  // 답변 검증 (기존 호환성을 위해 유지)
  const checkAnswer = (questionId: number): AnswerResult | null => {
    return results.find((r) => r.questionId === questionId) || null;
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
  const setQuestions = (questions: QuizQuestion[]) => {
    _setQuestions(questions);
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

  // 서버 제출: 함수 호출은 실패해도 UI를 막지 않도록 결과만 반환
  const submitResults: ResultContextType['submitResults'] = async (payload) => {
    try {
      const summary = getQuizResult();
      const resp = await api.quiz.submit({
        quizId: payload?.quizId ?? 'default',
        userId: payload?.userId,
        totalQuestions: summary.totalQuestions,
        correctCount: summary.correctCount,
        wrongCount: summary.wrongCount,
        totalScore: summary.totalScore,
        // 서버에서 학습에 유용하도록 오답 상세 포함
        wrongAnswers: summary.wrongAnswers.map((w) => ({
          questionId: w.questionId,
          userAnswer: w.userAnswer,
          correctAnswer: w.correctAnswer,
          description: w.description,
        })),
      });
      const ok = resp.ok ?? true; // 서버가 ok를 주지 않는 경우(레거시) 성공으로 간주
      return { ok, message: resp.message };
    } catch (e) {
      return {
        ok: false,
        message: e instanceof Error ? e.message : 'submit failed',
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
