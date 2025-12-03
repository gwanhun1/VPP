// 간단한 비속어 필터 유틸
// 금칙어 목록에 포함된 단어를 *** 로 마스킹합니다.

const KOREAN_BAD_WORDS = [
  '씨발',
  '씨팔',
  '씨바',
  '씨빨',
  '십알',
  '병신',
  '븅신',
  '지랄',
  '지랄마',
  '좆',
  '좇',
  '좆같',
  'ㅈ같',
  '개새끼',
  '개새키',
  '개색기',
  '개년',
  '개같',
  '씹년',
  '씹새',
  '썅',
  '꺼져',
  '닥쳐',
  '미친년',
  '미친놈',
  '또라이',
  '정신병자',
  '죽일놈',
  '골빈',
  '멍청이',
];

const ENGLISH_BAD_WORDS = [
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'bastard',
  'son of a bitch',
  'motherfucker',
];

const BAD_WORDS = [...KOREAN_BAD_WORDS, ...ENGLISH_BAD_WORDS];

export const sanitizeProfanity = (input: string): string => {
  if (!input) return input;

  let result = input;

  for (const word of BAD_WORDS) {
    const pattern = new RegExp(
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'gi'
    );
    result = result.replace(pattern, '***');
  }

  return result;
};

export const containsProfanity = (input: string): boolean => {
  if (!input) return false;
  const lowered = input.toLowerCase();
  return BAD_WORDS.some((w) => lowered.includes(w.toLowerCase()));
};
