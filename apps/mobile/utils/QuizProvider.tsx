import React, { createContext, useContext, useState, ReactNode } from 'react';

// 타입 정의
type AnswerType = Record<number, string | number>;
type AnswerContextType = {
  answer: AnswerType;
  setAnswer: (id: number, value: string | number) => void;
};
type QuizContextType = {
  step: number;
  setStep: (step: number) => void;
};
type QuestionContextType = {
  question: unknown | null;
  setQuestion: (question: unknown | null) => void;
};

const QuizContext = createContext<
  (QuizContextType & AnswerContextType & QuestionContextType) | undefined
>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [answer, _setAnswer] = useState<AnswerType>({});
  const [step, _setStep] = useState<number>(0);
  const [question, _setQuestion] = useState<unknown | null>(null);

  const setAnswer = (id: number, value: string | number) => {
    _setAnswer((prev) => {
      const newAnswer = { ...prev, [id]: value };
      return newAnswer;
    });
  };

  const setStep = (step: number) => {
    _setStep(step);
  };

  const setQuestion = (question: unknown | null) => {
    _setQuestion(question);
  };

  return (
    <QuizContext.Provider
      value={{ answer, setAnswer, step, setStep, question, setQuestion }}
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
