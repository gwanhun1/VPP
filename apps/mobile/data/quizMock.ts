import { QuizQuestion } from '../utils/QuizProvider';

export const QUIZ_MOCK: QuizQuestion[] = [
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
      'SMP는 System Marginal Price의 약자로, 전력시장에서 전력 거래의 기준이 되는 도매시장 가격입니다.',
    point: 10,
  },
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
