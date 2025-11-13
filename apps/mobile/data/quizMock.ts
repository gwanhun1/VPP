import { QuizQuestion } from '../utils/QuizProvider';

export const QUIZ_MOCK: QuizQuestion[] = [
  {
    day: 1,
    quiz: [
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
      {
        id: 2,
        type: 'ox',
        question: '2019년 9월 기준 소규모 전력중개시장은 매우 활성화되어 있다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '2019년 9월 기준으로 실제 운영 중인 중개사업자 수는 5개, 거래되는 용량은 11.1MW 수준으로 활성화되지 못하고 있습니다.',
        point: 10,
      },
      {
        id: 3,
        type: 'short',
        question: 'VPP는 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Virtual Power Plant',
        description:
          'VPP는 Virtual Power Plant(가상발전소)의 약자로, 소규모 분산형 에너지 자원을 통합하여 하나의 발전소처럼 관리하는 시스템입니다.',
        point: 15,
      },
      {
        id: 4,
        type: 'multiple',
        question: '소규모 전력중개사업의 대상이 되는 전력자원의 용량 기준은?',
        options: ['500kW 이하', '1MW 이하', '5MW 이하', '10MW 이하'],
        correctAnswer: '1MW 이하',
        description:
          '소규모 전력중개사업은 1MW 이하의 소규모 전력자원(신재생에너지, ESS, 전기자동차)에서 생산·저장한 전기를 중개사업자가 모아 전력시장에서 거래하는 사업입니다.',
        point: 10,
      },
      {
        id: 5,
        type: 'ox',
        question:
          '1MW 이하 소규모 태양광 발전의 2012년 대비 2017년 용량은 약 22배 증가했다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '1MW 이하의 소규모 태양광 발전의 용량은 2012년 약 197MW에서 2017년 4,367MW로 약 22배 증가하여 연평균 증가율 85.8%를 기록했습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 2,
    quiz: [
      {
        id: 6,
        type: 'multiple',
        question: '공급형 VPP(가상발전소)의 주요 기능이 아닌 것은?',
        options: [
          '발전량 예측능력 강화',
          '전압제어',
          '예비력 제공',
          '소비자 전기요금 청구',
        ],
        correctAnswer: '소비자 전기요금 청구',
        description:
          '공급형 VPP는 소규모 태양광 발전소를 통합하여 발전량의 예측능력 강화, 전압제어, 예비력 제공 기능을 제공합니다.',
        point: 10,
      },
      {
        id: 7,
        type: 'multiple',
        question: 'VPP의 유형이 아닌 것은?',
        options: ['공급형 VPP', '수요형 VPP', '융합형 VPP', '분산형 VPP'],
        correctAnswer: '분산형 VPP',
        description:
          'VPP는 공급형, 수요형, 융합형의 세 가지 유형으로 구분됩니다. 융합형 VPP는 공급형과 수요형을 융합하여 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 8,
        type: 'ox',
        question: '수요형 VPP는 DR(수요반응) 제도가 발달한 나라에 적합하다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '수요형 VPP는 전력 피크 시 전력 사용을 줄이는 기능을 제공하므로, 소비자의 전기요금 절감 효과가 있어 DR 제도가 발달한 나라에 적합합니다.',
        point: 10,
      },
      {
        id: 9,
        type: 'short',
        question: 'DER은 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Distributed Energy Resources',
        description:
          'DER은 Distributed Energy Resources(분산형 에너지 자원)의 약자로, 소규모 신재생에너지 발전과 에너지저장장치 등을 의미합니다.',
        point: 15,
      },
      {
        id: 10,
        type: 'multiple',
        question: '독일에서 중개사업자를 지원하기 위해 제공하는 제도는?',
        options: [
          'Feed-in Tariff',
          'Management Premium',
          'SGA 제도',
          'DERP 제도',
        ],
        correctAnswer: 'Management Premium',
        description:
          '독일은 소규모 재생에너지 모집 및 중개시장 형성 촉진을 위해 계통운영자가 재생에너지 발전사업자에게 Management Premium을 제공합니다.',
        point: 15,
      },
    ],
  },
  {
    day: 3,
    quiz: [
      {
        id: 11,
        type: 'multiple',
        question: '호주의 소규모 전력중개사업자 제도의 명칭은?',
        options: ['DERP', 'SC', 'SGA', 'VPP'],
        correctAnswer: 'SGA',
        description:
          'SGA(Small Generation Aggregator)는 호주의 중개사업자가 30MW 미만의 소형발전기를 모집하여 전력도매시장에 판매하는 제도입니다.',
        point: 15,
      },
      {
        id: 12,
        type: 'ox',
        question: '한전 PPA 방식이 전력시장 판매방식보다 계량기 비용이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '전력거래소를 통한 전력시장 판매방법은 한전 PPA에 비해 계량기 비용이 높습니다. 이것이 소규모 전력중개시장 활성화의 주요 장애요인 중 하나입니다.',
        point: 10,
      },
      {
        id: 13,
        type: 'multiple',
        question:
          '소규모 태양광사업자가 전력판매방법을 변경할 때 가장 중요한 요인은?',
        options: [
          '전력대금 청구 간편성',
          'REC 장기고정계약 가능여부',
          '계량기 비용',
          '중개사업자 신용도',
        ],
        correctAnswer: 'REC 장기고정계약 가능여부',
        description:
          '설문조사 결과, 소규모 태양광사업자가 전력판매방법을 변경함에 있어서 가장 중요한 요인은 REC 장기고정계약 가능여부로 나타났습니다.',
        point: 15,
      },
      {
        id: 14,
        type: 'ox',
        question:
          '2019년 10월 기준 한전 PPA는 1MW 이하 태양광 발전기 용량의 약 85%를 차지한다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '한전 PPA는 2019년 10월 기준으로 전체 1MW 이하 기수 중 약 95%, 용량 기준으로는 약 85%로 절대 다수를 차지합니다.',
        point: 10,
      },
      {
        id: 15,
        type: 'multiple',
        question: '미국 캘리포니아의 분산에너지자원 제공자 제도의 약자는?',
        options: ['DERP', 'SGA', 'VPP', 'ESS'],
        correctAnswer: 'DERP',
        description:
          'DERP(Distributed Energy Resource Provider)는 캘리포니아에서 분산형 에너지 자원을 모집·계량·정산을 일원화하여 운영하는 제도입니다.',
        point: 15,
      },
    ],
  },
  {
    day: 4,
    quiz: [
      {
        id: 16,
        type: 'ox',
        question: 'FIP 제도는 고정가격으로 전력을 매입하는 제도이다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'FIP(Feed-in Premium) 제도는 시장가격에 일정 수준의 보조금을 가산해 지급하는 제도로, 고정가격 매입제도인 FIT와는 다릅니다.',
        point: 10,
      },
      {
        id: 17,
        type: 'multiple',
        question:
          '소규모 전력중개시장 고도화 방안의 최종 단계(3단계)의 주요 내용은?',
        options: [
          '중개시장 개설을 위한 규정 마련',
          '계량시스템 개선',
          '소규모자원의 출력예측',
          'IT 기술과 접목한 가상발전소 모델 구축',
        ],
        correctAnswer: 'IT 기술과 접목한 가상발전소 모델 구축',
        description:
          '3단계는 IT, 제어, 통신기술 등을 활용한 가상발전소 모델로 고도화하는 최종단계로, 에너지시장과 보조서비스 시장 참여를 통해 발전, ESS, DR 등을 IT 기술과 접목하여 활용가치를 증대시킵니다.',
        point: 15,
      },
      {
        id: 18,
        type: 'short',
        question:
          '호주의 소규모 전력중개사업자 제도 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'SGA',
        description: 'SGA는 Small Generation Aggregator의 약자입니다.',
        point: 15,
      },
      {
        id: 19,
        type: 'multiple',
        question: '독일에서 중개사업자를 지원하기 위해 제공하는 제도는?',
        options: [
          'Feed-in Tariff',
          'Management Premium',
          'SGA 제도',
          'DERP 제도',
        ],
        correctAnswer: 'Management Premium',
        description:
          '독일은 소규모 재생에너지 모집 및 중개시장 형성 촉진을 위해 계통운영자가 재생에너지 발전사업자에게 Management Premium을 제공합니다.',
        point: 15,
      },
      {
        id: 20,
        type: 'ox',
        question:
          '소규모 태양광 발전의 증가는 전력계통 운영에 부정적 영향을 줄 수 있다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '소규모 태양광 발전은 계통운영자가 정확한 발전량을 알 수 없어 급전계획에 차질을 발생시키고, 변동적인 발전 특성으로 인해 전압 및 주파수 유지에 부정적인 영향을 줄 수 있습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 5,
    quiz: [
      {
        id: 21,
        type: 'multiple',
        question: '예측정산금 제도의 목적은?',
        options: [
          '중개사업자의 수수료 인상',
          '계량기 비용 절감',
          '태양광 발전량 입찰 정확도 제고',
          'REC 거래 간편화',
        ],
        correctAnswer: '태양광 발전량 입찰 정확도 제고',
        description:
          '예측정산금은 하루전 시장에서 시간대별 태양광 발전량 입찰의 정확도를 높일 경우 추가 정산금을 지급하는 인센티브 제도입니다.',
        point: 15,
      },
      {
        id: 22,
        type: 'ox',
        question:
          '독일의 Management Premium은 모든 재생에너지 설비에 동일하게 지급된다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'Management Premium은 2015년부터 태양광 및 풍력발전 대상으로 원격조정이 가능한 설비에만 지급됩니다.',
        point: 10,
      },
      {
        id: 23,
        type: 'multiple',
        question: 'BAU(현행) 상태에서 중개사업자의 시장점유율은?',
        options: ['3.3%', '5.5%', '11.1%', '24.1%'],
        correctAnswer: '3.3%',
        description:
          '현행 상태의 중개사업자의 점유율은 3.3%에 그쳐 현행 제도에서 추가적인 인센티브 없이는 중개사업자 활성화가 매우 어려울 것으로 전망됩니다.',
        point: 15,
      },
      {
        id: 24,
        type: 'short',
        question:
          '미국 캘리포니아의 분산에너지자원 제공자 제도 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'DERP',
        description:
          'DERP는 Distributed Energy Resource Provider의 약자입니다.',
        point: 15,
      },
      {
        id: 25,
        type: 'multiple',
        question: '2012년 1MW 이하 소규모 태양광 발전 용량은?',
        options: ['약 97MW', '약 197MW', '약 297MW', '약 397MW'],
        correctAnswer: '약 197MW',
        description:
          '2012년 1MW 이하 소규모 태양광 발전 용량은 약 197MW였으며, 2017년에는 4,367MW로 약 22배 증가했습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 6,
    quiz: [
      {
        id: 26,
        type: 'ox',
        question: '융합형 VPP는 공급형과 수요형 VPP의 장점만을 결합한 것이다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '융합형 VPP는 공급형 VPP와 수요형 VPP를 융합하여 전력망에 분산형 에너지 자원을 통해 전기를 공급하고 수요자원을 효율적으로 운영하며, 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 27,
        type: 'multiple',
        question: '중개사업자가 제공하는 서비스가 아닌 것은?',
        options: [
          '전력 거래대행',
          'REC 거래대행',
          '설비 유지보수',
          '전기요금 청구서 발행',
        ],
        correctAnswer: '전기요금 청구서 발행',
        description:
          '중개사업자는 소규모 자원에서 생산 또는 저장된 전력을 모아서 거래하며 신재생에너지 공급인증서(REC)의 거래대행 및 설비 유지보수 등의 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 28,
        type: 'multiple',
        question: '2017년 1MW 이하 소규모 태양광 발전 용량은?',
        options: ['약 2,367MW', '약 3,367MW', '약 4,367MW', '약 5,367MW'],
        correctAnswer: '약 4,367MW',
        description:
          '2017년 1MW 이하 소규모 태양광 발전 용량은 약 4,367MW로, 2012년 약 197MW 대비 약 22배 증가했습니다.',
        point: 10,
      },
      {
        id: 29,
        type: 'ox',
        question:
          '전력거래소를 통한 판매는 한전 PPA보다 연간 20~30만원 정도 수입이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '전력시장 판매는 시간대별 SMP를 적용받아 한전 PPA 대비 연간 20~30만원 수입이 높지만, 계량기 비용이 높고 정산 절차가 복잡합니다.',
        point: 10,
      },
      {
        id: 30,
        type: 'short',
        question: '신재생에너지 공급인증서의 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'REC',
        description:
          'REC는 Renewable Energy Certificate의 약자로 신재생에너지 공급인증서를 의미합니다.',
        point: 15,
      },
    ],
  },
  {
    day: 7,
    quiz: [
      {
        id: 31,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
      {
        id: 6,
        type: 'multiple',
        question: '공급형 VPP(가상발전소)의 주요 기능이 아닌 것은?',
        options: [
          '발전량 예측능력 강화',
          '전압제어',
          '예비력 제공',
          '소비자 전기요금 청구',
        ],
        correctAnswer: '소비자 전기요금 청구',
        description:
          '공급형 VPP는 소규모 태양광 발전소를 통합하여 발전량의 예측능력 강화, 전압제어, 예비력 제공 기능을 제공합니다.',
        point: 10,
      },
      {
        id: 11,
        type: 'multiple',
        question: '호주의 소규모 전력중개사업자 제도의 명칭은?',
        options: ['DERP', 'SC', 'SGA', 'VPP'],
        correctAnswer: 'SGA',
        description:
          'SGA(Small Generation Aggregator)는 호주의 중개사업자가 30MW 미만의 소형발전기를 모집하여 전력도매시장에 판매하는 제도입니다.',
        point: 15,
      },
      {
        id: 16,
        type: 'ox',
        question: 'FIP 제도는 고정가격으로 전력을 매입하는 제도이다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'FIP(Feed-in Premium) 제도는 시장가격에 일정 수준의 보조금을 가산해 지급하는 제도로, 고정가격 매입제도인 FIT와는 다릅니다.',
        point: 10,
      },
      {
        id: 21,
        type: 'multiple',
        question: '예측정산금 제도의 목적은?',
        options: [
          '중개사업자의 수수료 인상',
          '계량기 비용 절감',
          '태양광 발전량 입찰 정확도 제고',
          'REC 거래 간편화',
        ],
        correctAnswer: '태양광 발전량 입찰 정확도 제고',
        description:
          '예측정산금은 하루전 시장에서 시간대별 태양광 발전량 입찰의 정확도를 높일 경우 추가 정산금을 지급하는 인센티브 제도입니다.',
        point: 15,
      },
    ],
  },
  {
    day: 8,
    quiz: [
      {
        id: 2,
        type: 'ox',
        question: '2019년 9월 기준 소규모 전력중개시장은 매우 활성화되어 있다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '2019년 9월 기준으로 실제 운영 중인 중개사업자 수는 5개, 거래되는 용량은 11.1MW 수준으로 활성화되지 못하고 있습니다.',
        point: 10,
      },
      {
        id: 7,
        type: 'multiple',
        question: 'VPP의 유형이 아닌 것은?',
        options: ['공급형 VPP', '수요형 VPP', '융합형 VPP', '분산형 VPP'],
        correctAnswer: '분산형 VPP',
        description:
          'VPP는 공급형, 수요형, 융합형의 세 가지 유형으로 구분됩니다. 융합형 VPP는 공급형과 수요형을 융합하여 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 12,
        type: 'ox',
        question: '한전 PPA 방식이 전력시장 판매방식보다 계량기 비용이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '전력거래소를 통한 전력시장 판매방법은 한전 PPA에 비해 계량기 비용이 높습니다. 이것이 소규모 전력중개시장 활성화의 주요 장애요인 중 하나입니다.',
        point: 10,
      },
      {
        id: 17,
        type: 'multiple',
        question:
          '소규모 전력중개시장 고도화 방안의 최종 단계(3단계)의 주요 내용은?',
        options: [
          '중개시장 개설을 위한 규정 마련',
          '계량시스템 개선',
          '소규모자원의 출력예측',
          'IT 기술과 접목한 가상발전소 모델 구축',
        ],
        correctAnswer: 'IT 기술과 접목한 가상발전소 모델 구축',
        description:
          '3단계는 IT, 제어, 통신기술 등을 활용한 가상발전소 모델로 고도화하는 최종단계로, 에너지시장과 보조서비스 시장 참여를 통해 발전, ESS, DR 등을 IT 기술과 접목하여 활용가치를 증대시킵니다.',
        point: 15,
      },
      {
        id: 22,
        type: 'ox',
        question:
          '독일의 Management Premium은 모든 재생에너지 설비에 동일하게 지급된다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'Management Premium은 2015년부터 태양광 및 풍력발전 대상으로 원격조정이 가능한 설비에만 지급됩니다.',
        point: 10,
      },
    ],
  },
  {
    day: 9,
    quiz: [
      {
        id: 3,
        type: 'short',
        question: 'VPP는 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Virtual Power Plant',
        description:
          'VPP는 Virtual Power Plant(가상발전소)의 약자로, 소규모 분산형 에너지 자원을 통합하여 하나의 발전소처럼 관리하는 시스템입니다.',
        point: 15,
      },
      {
        id: 8,
        type: 'ox',
        question: '수요형 VPP는 DR(수요반응) 제도가 발달한 나라에 적합하다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '수요형 VPP는 전력 피크 시 전력 사용을 줄이는 기능을 제공하므로, 소비자의 전기요금 절감 효과가 있어 DR 제도가 발달한 나라에 적합합니다.',
        point: 10,
      },
      {
        id: 13,
        type: 'multiple',
        question:
          '소규모 태양광사업자가 전력판매방법을 변경할 때 가장 중요한 요인은?',
        options: [
          '전력대금 청구 간편성',
          'REC 장기고정계약 가능여부',
          '계량기 비용',
          '중개사업자 신용도',
        ],
        correctAnswer: 'REC 장기고정계약 가능여부',
        description:
          '설문조사 결과, 소규모 태양광사업자가 전력판매방법을 변경함에 있어서 가장 중요한 요인은 REC 장기고정계약 가능여부로 나타났습니다.',
        point: 15,
      },
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
      {
        id: 19,
        type: 'multiple',
        question: 'BAU(현행) 상태에서 중개사업자의 시장점유율은?',
        options: ['3.3%', '5.5%', '11.1%', '24.1%'],
        correctAnswer: '3.3%',
        description:
          '현행 상태의 중개사업자의 점유율은 3.3%에 그쳐 현행 제도에서 추가적인 인센티브 없이는 중개사업자 활성화가 매우 어려울 것으로 전망됩니다.',
        point: 15,
      },
    ],
  },
  {
    day: 10,
    quiz: [
      {
        id: 4,
        type: 'multiple',
        question: '소규모 전력중개사업의 대상이 되는 전력자원의 용량 기준은?',
        options: ['500kW 이하', '1MW 이하', '5MW 이하', '10MW 이하'],
        correctAnswer: '1MW 이하',
        description:
          '소규모 전력중개사업은 1MW 이하의 소규모 전력자원(신재생에너지, ESS, 전기자동차)에서 생산·저장한 전기를 중개사업자가 모아 전력시장에서 거래하는 사업입니다.',
        point: 10,
      },
      {
        id: 9,
        type: 'short',
        question: 'DER은 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Distributed Energy Resources',
        description:
          'DER은 Distributed Energy Resources(분산형 에너지 자원)의 약자로, 소규모 신재생에너지 발전과 에너지저장장치 등을 의미합니다.',
        point: 15,
      },
      {
        id: 14,
        type: 'ox',
        question:
          '2019년 10월 기준 한전 PPA는 1MW 이하 태양광 발전기 용량의 약 85%를 차지한다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '한전 PPA는 2019년 10월 기준으로 전체 1MW 이하 기수 중 약 95%, 용량 기준으로는 약 85%로 절대 다수를 차지합니다.',
        point: 10,
      },
      {
        id: 20,
        type: 'ox',
        question:
          '소규모 태양광 발전의 증가는 전력계통 운영에 부정적 영향을 줄 수 있다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '소규모 태양광 발전은 계통운영자가 정확한 발전량을 알 수 없어 급전계획에 차질을 발생시키고, 변동적인 발전 특성으로 인해 전압 및 주파수 유지에 부정적인 영향을 줄 수 있습니다.',
        point: 10,
      },
      {
        id: 26,
        type: 'ox',
        question: '융합형 VPP는 공급형과 수요형 VPP의 장점만을 결합한 것이다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '융합형 VPP는 공급형 VPP와 수요형 VPP를 융합하여 전력망에 분산형 에너지 자원을 통해 전기를 공급하고 수요자원을 효율적으로 운영하며, 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
    ],
  },
  {
    day: 11,
    quiz: [
      {
        id: 5,
        type: 'ox',
        question:
          '1MW 이하 소규모 태양광 발전의 2012년 대비 2017년 용량은 약 22배 증가했다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '1MW 이하의 소규모 태양광 발전의 용량은 2012년 약 197MW에서 2017년 4,367MW로 약 22배 증가하여 연평균 증가율 85.8%를 기록했습니다.',
        point: 10,
      },
      {
        id: 10,
        type: 'multiple',
        question: '독일에서 중개사업자를 지원하기 위해 제공하는 제도는?',
        options: [
          'Feed-in Tariff',
          'Management Premium',
          'SGA 제도',
          'DERP 제도',
        ],
        correctAnswer: 'Management Premium',
        description:
          '독일은 소규모 재생에너지 모집 및 중개시장 형성 촉진을 위해 계통운영자가 재생에너지 발전사업자에게 Management Premium을 제공합니다.',
        point: 15,
      },
      {
        id: 15,
        type: 'multiple',
        question: '미국 캘리포니아의 분산에너지자원 제공자 제도의 약자는?',
        options: ['DERP', 'SGA', 'VPP', 'ESS'],
        correctAnswer: 'DERP',
        description:
          'DERP(Distributed Energy Resource Provider)는 캘리포니아에서 분산형 에너지 자원을 모집·계량·정산을 일원화하여 운영하는 제도입니다.',
        point: 15,
      },
      {
        id: 24,
        type: 'short',
        question:
          '미국 캘리포니아의 분산에너지자원 제공자 제도 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'DERP',
        description:
          'DERP는 Distributed Energy Resource Provider의 약자입니다.',
        point: 15,
      },
      {
        id: 27,
        type: 'multiple',
        question: '중개사업자가 제공하는 서비스가 아닌 것은?',
        options: [
          '전력 거래대행',
          'REC 거래대행',
          '설비 유지보수',
          '전기요금 청구서 발행',
        ],
        correctAnswer: '전기요금 청구서 발행',
        description:
          '중개사업자는 소규모 자원에서 생산 또는 저장된 전력을 모아서 거래하며 신재생에너지 공급인증서(REC)의 거래대행 및 설비 유지보수 등의 서비스를 제공합니다.',
        point: 10,
      },
    ],
  },
  {
    day: 12,
    quiz: [
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
      {
        id: 11,
        type: 'multiple',
        question: '호주의 소규모 전력중개사업자 제도의 명칭은?',
        options: ['DERP', 'SC', 'SGA', 'VPP'],
        correctAnswer: 'SGA',
        description:
          'SGA(Small Generation Aggregator)는 호주의 중개사업자가 30MW 미만의 소형발전기를 모집하여 전력도매시장에 판매하는 제도입니다.',
        point: 15,
      },
      {
        id: 18,
        type: 'short',
        question:
          '호주의 소규모 전력중개사업자 제도 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'SGA',
        description: 'SGA는 Small Generation Aggregator의 약자입니다.',
        point: 15,
      },
      {
        id: 25,
        type: 'multiple',
        question: '2012년 1MW 이하 소규모 태양광 발전 용량은?',
        options: ['약 97MW', '약 197MW', '약 297MW', '약 397MW'],
        correctAnswer: '약 197MW',
        description:
          '2012년 1MW 이하 소규모 태양광 발전 용량은 약 197MW였으며, 2017년에는 4,367MW로 약 22배 증가했습니다.',
        point: 10,
      },
      {
        id: 28,
        type: 'multiple',
        question: '2017년 1MW 이하 소규모 태양광 발전 용량은?',
        options: ['약 2,367MW', '약 3,367MW', '약 4,367MW', '약 5,367MW'],
        correctAnswer: '약 4,367MW',
        description:
          '2017년 1MW 이하 소규모 태양광 발전 용량은 약 4,367MW로, 2012년 약 197MW 대비 약 22배 증가했습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 13,
    quiz: [
      {
        id: 2,
        type: 'ox',
        question: '2019년 9월 기준 소규모 전력중개시장은 매우 활성화되어 있다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '2019년 9월 기준으로 실제 운영 중인 중개사업자 수는 5개, 거래되는 용량은 11.1MW 수준으로 활성화되지 못하고 있습니다.',
        point: 10,
      },
      {
        id: 6,
        type: 'multiple',
        question: '공급형 VPP(가상발전소)의 주요 기능이 아닌 것은?',
        options: [
          '발전량 예측능력 강화',
          '전압제어',
          '예비력 제공',
          '소비자 전기요금 청구',
        ],
        correctAnswer: '소비자 전기요금 청구',
        description:
          '공급형 VPP는 소규모 태양광 발전소를 통합하여 발전량의 예측능력 강화, 전압제어, 예비력 제공 기능을 제공합니다.',
        point: 10,
      },
      {
        id: 12,
        type: 'ox',
        question: '한전 PPA 방식이 전력시장 판매방식보다 계량기 비용이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '전력거래소를 통한 전력시장 판매방법은 한전 PPA에 비해 계량기 비용이 높습니다. 이것이 소규모 전력중개시장 활성화의 주요 장애요인 중 하나입니다.',
        point: 10,
      },
      {
        id: 21,
        type: 'multiple',
        question: '예측정산금 제도의 목적은?',
        options: [
          '중개사업자의 수수료 인상',
          '계량기 비용 절감',
          '태양광 발전량 입찰 정확도 제고',
          'REC 거래 간편화',
        ],
        correctAnswer: '태양광 발전량 입찰 정확도 제고',
        description:
          '예측정산금은 하루전 시장에서 시간대별 태양광 발전량 입찰의 정확도를 높일 경우 추가 정산금을 지급하는 인센티브 제도입니다.',
        point: 15,
      },
      {
        id: 29,
        type: 'ox',
        question:
          '전력거래소를 통한 판매는 한전 PPA보다 연간 20~30만원 정도 수입이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '전력시장 판매는 시간대별 SMP를 적용받아 한전 PPA 대비 연간 20~30만원 수입이 높지만, 계량기 비용이 높고 정산 절차가 복잡합니다.',
        point: 10,
      },
    ],
  },
  {
    day: 14,
    quiz: [
      {
        id: 7,
        type: 'multiple',
        question: 'VPP의 유형이 아닌 것은?',
        options: ['공급형 VPP', '수요형 VPP', '융합형 VPP', '분산형 VPP'],
        correctAnswer: '분산형 VPP',
        description:
          'VPP는 공급형, 수요형, 융합형의 세 가지 유형으로 구분됩니다. 융합형 VPP는 공급형과 수요형을 융합하여 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 16,
        type: 'ox',
        question: 'FIP 제도는 고정가격으로 전력을 매입하는 제도이다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'FIP(Feed-in Premium) 제도는 시장가격에 일정 수준의 보조금을 가산해 지급하는 제도로, 고정가격 매입제도인 FIT와는 다릅니다.',
        point: 10,
      },
      {
        id: 17,
        type: 'multiple',
        question:
          '소규모 전력중개시장 고도화 방안의 최종 단계(3단계)의 주요 내용은?',
        options: [
          '중개시장 개설을 위한 규정 마련',
          '계량시스템 개선',
          '소규모자원의 출력예측',
          'IT 기술과 접목한 가상발전소 모델 구축',
        ],
        correctAnswer: 'IT 기술과 접목한 가상발전소 모델 구축',
        description:
          '3단계는 IT, 제어, 통신기술 등을 활용한 가상발전소 모델로 고도화하는 최종단계로, 에너지시장과 보조서비스 시장 참여를 통해 발전, ESS, DR 등을 IT 기술과 접목하여 활용가치를 증대시킵니다.',
        point: 15,
      },
      {
        id: 22,
        type: 'ox',
        question:
          '독일의 Management Premium은 모든 재생에너지 설비에 동일하게 지급된다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'Management Premium은 2015년부터 태양광 및 풍력발전 대상으로 원격조정이 가능한 설비에만 지급됩니다.',
        point: 10,
      },
      {
        id: 30,
        type: 'short',
        question: '신재생에너지 공급인증서의 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'REC',
        description:
          'REC는 Renewable Energy Certificate의 약자로 신재생에너지 공급인증서를 의미합니다.',
        point: 15,
      },
    ],
  },
  {
    day: 15,
    quiz: [
      {
        id: 3,
        type: 'short',
        question: 'VPP는 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Virtual Power Plant',
        description:
          'VPP는 Virtual Power Plant(가상발전소)의 약자로, 소규모 분산형 에너지 자원을 통합하여 하나의 발전소처럼 관리하는 시스템입니다.',
        point: 15,
      },
      {
        id: 4,
        type: 'multiple',
        question: '소규모 전력중개사업의 대상이 되는 전력자원의 용량 기준은?',
        options: ['500kW 이하', '1MW 이하', '5MW 이하', '10MW 이하'],
        correctAnswer: '1MW 이하',
        description:
          '소규모 전력중개사업은 1MW 이하의 소규모 전력자원(신재생에너지, ESS, 전기자동차)에서 생산·저장한 전기를 중개사업자가 모아 전력시장에서 거래하는 사업입니다.',
        point: 10,
      },
      {
        id: 13,
        type: 'multiple',
        question:
          '소규모 태양광사업자가 전력판매방법을 변경할 때 가장 중요한 요인은?',
        options: [
          '전력대금 청구 간편성',
          'REC 장기고정계약 가능여부',
          '계량기 비용',
          '중개사업자 신용도',
        ],
        correctAnswer: 'REC 장기고정계약 가능여부',
        description:
          '설문조사 결과, 소규모 태양광사업자가 전력판매방법을 변경함에 있어서 가장 중요한 요인은 REC 장기고정계약 가능여부로 나타났습니다.',
        point: 15,
      },
      {
        id: 14,
        type: 'ox',
        question:
          '2019년 10월 기준 한전 PPA는 1MW 이하 태양광 발전기 용량의 약 85%를 차지한다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '한전 PPA는 2019년 10월 기준으로 전체 1MW 이하 기수 중 약 95%, 용량 기준으로는 약 85%로 절대 다수를 차지합니다.',
        point: 10,
      },
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 16,
    quiz: [
      {
        id: 5,
        type: 'ox',
        question:
          '1MW 이하 소규모 태양광 발전의 2012년 대비 2017년 용량은 약 22배 증가했다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '1MW 이하의 소규모 태양광 발전의 용량은 2012년 약 197MW에서 2017년 4,367MW로 약 22배 증가하여 연평균 증가율 85.8%를 기록했습니다.',
        point: 10,
      },
      {
        id: 8,
        type: 'ox',
        question: '수요형 VPP는 DR(수요반응) 제도가 발달한 나라에 적합하다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '수요형 VPP는 전력 피크 시 전력 사용을 줄이는 기능을 제공하므로, 소비자의 전기요금 절감 효과가 있어 DR 제도가 발달한 나라에 적합합니다.',
        point: 10,
      },
      {
        id: 9,
        type: 'short',
        question: 'DER은 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Distributed Energy Resources',
        description:
          'DER은 Distributed Energy Resources(분산형 에너지 자원)의 약자로, 소규모 신재생에너지 발전과 에너지저장장치 등을 의미합니다.',
        point: 15,
      },
      {
        id: 20,
        type: 'ox',
        question:
          '소규모 태양광 발전의 증가는 전력계통 운영에 부정적 영향을 줄 수 있다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '소규모 태양광 발전은 계통운영자가 정확한 발전량을 알 수 없어 급전계획에 차질을 발생시키고, 변동적인 발전 특성으로 인해 전압 및 주파수 유지에 부정적인 영향을 줄 수 있습니다.',
        point: 10,
      },
      {
        id: 23,
        type: 'multiple',
        question: 'BAU(현행) 상태에서 중개사업자의 시장점유율은?',
        options: ['3.3%', '5.5%', '11.1%', '24.1%'],
        correctAnswer: '3.3%',
        description:
          '현행 상태의 중개사업자의 점유율은 3.3%에 그쳐 현행 제도에서 추가적인 인센티브 없이는 중개사업자 활성화가 매우 어려울 것으로 전망됩니다.',
        point: 15,
      },
    ],
  },
  {
    day: 17,
    quiz: [
      {
        id: 10,
        type: 'multiple',
        question: '독일에서 중개사업자를 지원하기 위해 제공하는 제도는?',
        options: [
          'Feed-in Tariff',
          'Management Premium',
          'SGA 제도',
          'DERP 제도',
        ],
        correctAnswer: 'Management Premium',
        description:
          '독일은 소규모 재생에너지 모집 및 중개시장 형성 촉진을 위해 계통운영자가 재생에너지 발전사업자에게 Management Premium을 제공합니다.',
        point: 15,
      },
      {
        id: 11,
        type: 'multiple',
        question: '호주의 소규모 전력중개사업자 제도의 명칭은?',
        options: ['DERP', 'SC', 'SGA', 'VPP'],
        correctAnswer: 'SGA',
        description:
          'SGA(Small Generation Aggregator)는 호주의 중개사업자가 30MW 미만의 소형발전기를 모집하여 전력도매시장에 판매하는 제도입니다.',
        point: 15,
      },
      {
        id: 15,
        type: 'multiple',
        question: '미국 캘리포니아의 분산에너지자원 제공자 제도의 약자는?',
        options: ['DERP', 'SGA', 'VPP', 'ESS'],
        correctAnswer: 'DERP',
        description:
          'DERP(Distributed Energy Resource Provider)는 캘리포니아에서 분산형 에너지 자원을 모집·계량·정산을 일원화하여 운영하는 제도입니다.',
        point: 15,
      },
      {
        id: 26,
        type: 'ox',
        question: '융합형 VPP는 공급형과 수요형 VPP의 장점만을 결합한 것이다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '융합형 VPP는 공급형 VPP와 수요형 VPP를 융합하여 전력망에 분산형 에너지 자원을 통해 전기를 공급하고 수요자원을 효율적으로 운영하며, 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 27,
        type: 'multiple',
        question: '중개사업자가 제공하는 서비스가 아닌 것은?',
        options: [
          '전력 거래대행',
          'REC 거래대행',
          '설비 유지보수',
          '전기요금 청구서 발행',
        ],
        correctAnswer: '전기요금 청구서 발행',
        description:
          '중개사업자는 소규모 자원에서 생산 또는 저장된 전력을 모아서 거래하며 신재생에너지 공급인증서(REC)의 거래대행 및 설비 유지보수 등의 서비스를 제공합니다.',
        point: 10,
      },
    ],
  },
  {
    day: 18,
    quiz: [
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
      {
        id: 12,
        type: 'ox',
        question: '한전 PPA 방식이 전력시장 판매방식보다 계량기 비용이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '전력거래소를 통한 전력시장 판매방법은 한전 PPA에 비해 계량기 비용이 높습니다. 이것이 소규모 전력중개시장 활성화의 주요 장애요인 중 하나입니다.',
        point: 10,
      },
      {
        id: 16,
        type: 'ox',
        question: 'FIP 제도는 고정가격으로 전력을 매입하는 제도이다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'FIP(Feed-in Premium) 제도는 시장가격에 일정 수준의 보조금을 가산해 지급하는 제도로, 고정가격 매입제도인 FIT와는 다릅니다.',
        point: 10,
      },
      {
        id: 21,
        type: 'multiple',
        question: '예측정산금 제도의 목적은?',
        options: [
          '중개사업자의 수수료 인상',
          '계량기 비용 절감',
          '태양광 발전량 입찰 정확도 제고',
          'REC 거래 간편화',
        ],
        correctAnswer: '태양광 발전량 입찰 정확도 제고',
        description:
          '예측정산금은 하루전 시장에서 시간대별 태양광 발전량 입찰의 정확도를 높일 경우 추가 정산금을 지급하는 인센티브 제도입니다.',
        point: 15,
      },
      {
        id: 28,
        type: 'multiple',
        question: '2017년 1MW 이하 소규모 태양광 발전 용량은?',
        options: ['약 2,367MW', '약 3,367MW', '약 4,367MW', '약 5,367MW'],
        correctAnswer: '약 4,367MW',
        description:
          '2017년 1MW 이하 소규모 태양광 발전 용량은 약 4,367MW로, 2012년 약 197MW 대비 약 22배 증가했습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 19,
    quiz: [
      {
        id: 2,
        type: 'ox',
        question: '2019년 9월 기준 소규모 전력중개시장은 매우 활성화되어 있다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '2019년 9월 기준으로 실제 운영 중인 중개사업자 수는 5개, 거래되는 용량은 11.1MW 수준으로 활성화되지 못하고 있습니다.',
        point: 10,
      },
      {
        id: 6,
        type: 'multiple',
        question: '공급형 VPP(가상발전소)의 주요 기능이 아닌 것은?',
        options: [
          '발전량 예측능력 강화',
          '전압제어',
          '예비력 제공',
          '소비자 전기요금 청구',
        ],
        correctAnswer: '소비자 전기요금 청구',
        description:
          '공급형 VPP는 소규모 태양광 발전소를 통합하여 발전량의 예측능력 강화, 전압제어, 예비력 제공 기능을 제공합니다.',
        point: 10,
      },
      {
        id: 17,
        type: 'multiple',
        question:
          '소규모 전력중개시장 고도화 방안의 최종 단계(3단계)의 주요 내용은?',
        options: [
          '중개시장 개설을 위한 규정 마련',
          '계량시스템 개선',
          '소규모자원의 출력예측',
          'IT 기술과 접목한 가상발전소 모델 구축',
        ],
        correctAnswer: 'IT 기술과 접목한 가상발전소 모델 구축',
        description:
          '3단계는 IT, 제어, 통신기술 등을 활용한 가상발전소 모델로 고도화하는 최종단계로, 에너지시장과 보조서비스 시장 참여를 통해 발전, ESS, DR 등을 IT 기술과 접목하여 활용가치를 증대시킵니다.',
        point: 15,
      },
      {
        id: 22,
        type: 'ox',
        question:
          '독일의 Management Premium은 모든 재생에너지 설비에 동일하게 지급된다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'Management Premium은 2015년부터 태양광 및 풍력발전 대상으로 원격조정이 가능한 설비에만 지급됩니다.',
        point: 10,
      },
      {
        id: 29,
        type: 'ox',
        question:
          '전력거래소를 통한 판매는 한전 PPA보다 연간 20~30만원 정도 수입이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '전력시장 판매는 시간대별 SMP를 적용받아 한전 PPA 대비 연간 20~30만원 수입이 높지만, 계량기 비용이 높고 정산 절차가 복잡합니다.',
        point: 10,
      },
    ],
  },
  {
    day: 20,
    quiz: [
      {
        id: 3,
        type: 'short',
        question: 'VPP는 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Virtual Power Plant',
        description:
          'VPP는 Virtual Power Plant(가상발전소)의 약자로, 소규모 분산형 에너지 자원을 통합하여 하나의 발전소처럼 관리하는 시스템입니다.',
        point: 15,
      },
      {
        id: 7,
        type: 'multiple',
        question: 'VPP의 유형이 아닌 것은?',
        options: ['공급형 VPP', '수요형 VPP', '융합형 VPP', '분산형 VPP'],
        correctAnswer: '분산형 VPP',
        description:
          'VPP는 공급형, 수요형, 융합형의 세 가지 유형으로 구분됩니다. 융합형 VPP는 공급형과 수요형을 융합하여 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 13,
        type: 'multiple',
        question:
          '소규모 태양광사업자가 전력판매방법을 변경할 때 가장 중요한 요인은?',
        options: [
          '전력대금 청구 간편성',
          'REC 장기고정계약 가능여부',
          '계량기 비용',
          '중개사업자 신용도',
        ],
        correctAnswer: 'REC 장기고정계약 가능여부',
        description:
          '설문조사 결과, 소규모 태양광사업자가 전력판매방법을 변경함에 있어서 가장 중요한 요인은 REC 장기고정계약 가능여부로 나타났습니다.',
        point: 15,
      },
      {
        id: 18,
        type: 'short',
        question:
          '호주의 소규모 전력중개사업자 제도 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'SGA',
        description: 'SGA는 Small Generation Aggregator의 약자입니다.',
        point: 15,
      },
      {
        id: 30,
        type: 'short',
        question: '신재생에너지 공급인증서의 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'REC',
        description:
          'REC는 Renewable Energy Certificate의 약자로 신재생에너지 공급인증서를 의미합니다.',
        point: 15,
      },
    ],
  },
  {
    day: 21,
    quiz: [
      {
        id: 4,
        type: 'multiple',
        question: '소규모 전력중개사업의 대상이 되는 전력자원의 용량 기준은?',
        options: ['500kW 이하', '1MW 이하', '5MW 이하', '10MW 이하'],
        correctAnswer: '1MW 이하',
        description:
          '소규모 전력중개사업은 1MW 이하의 소규모 전력자원(신재생에너지, ESS, 전기자동차)에서 생산·저장한 전기를 중개사업자가 모아 전력시장에서 거래하는 사업입니다.',
        point: 10,
      },
      {
        id: 8,
        type: 'ox',
        question: '수요형 VPP는 DR(수요반응) 제도가 발달한 나라에 적합하다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '수요형 VPP는 전력 피크 시 전력 사용을 줄이는 기능을 제공하므로, 소비자의 전기요금 절감 효과가 있어 DR 제도가 발달한 나라에 적합합니다.',
        point: 10,
      },
      {
        id: 14,
        type: 'ox',
        question:
          '2019년 10월 기준 한전 PPA는 1MW 이하 태양광 발전기 용량의 약 85%를 차지한다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '한전 PPA는 2019년 10월 기준으로 전체 1MW 이하 기수 중 약 95%, 용량 기준으로는 약 85%로 절대 다수를 차지합니다.',
        point: 10,
      },
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
      {
        id: 19,
        type: 'multiple',
        question: '2012년 1MW 이하 소규모 태양광 발전 용량은?',
        options: ['약 97MW', '약 197MW', '약 297MW', '약 397MW'],
        correctAnswer: '약 197MW',
        description:
          '2012년 1MW 이하 소규모 태양광 발전 용량은 약 197MW였으며, 2017년에는 4,367MW로 약 22배 증가했습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 22,
    quiz: [
      {
        id: 5,
        type: 'ox',
        question:
          '1MW 이하 소규모 태양광 발전의 2012년 대비 2017년 용량은 약 22배 증가했다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '1MW 이하의 소규모 태양광 발전의 용량은 2012년 약 197MW에서 2017년 4,367MW로 약 22배 증가하여 연평균 증가율 85.8%를 기록했습니다.',
        point: 10,
      },
      {
        id: 9,
        type: 'short',
        question: 'DER은 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Distributed Energy Resources',
        description:
          'DER은 Distributed Energy Resources(분산형 에너지 자원)의 약자로, 소규모 신재생에너지 발전과 에너지저장장치 등을 의미합니다.',
        point: 15,
      },
      {
        id: 20,
        type: 'ox',
        question:
          '소규모 태양광 발전의 증가는 전력계통 운영에 부정적 영향을 줄 수 있다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '소규모 태양광 발전은 계통운영자가 정확한 발전량을 알 수 없어 급전계획에 차질을 발생시키고, 변동적인 발전 특성으로 인해 전압 및 주파수 유지에 부정적인 영향을 줄 수 있습니다.',
        point: 10,
      },
      {
        id: 23,
        type: 'multiple',
        question: 'BAU(현행) 상태에서 중개사업자의 시장점유율은?',
        options: ['3.3%', '5.5%', '11.1%', '24.1%'],
        correctAnswer: '3.3%',
        description:
          '현행 상태의 중개사업자의 점유율은 3.3%에 그쳐 현행 제도에서 추가적인 인센티브 없이는 중개사업자 활성화가 매우 어려울 것으로 전망됩니다.',
        point: 15,
      },
      {
        id: 24,
        type: 'short',
        question:
          '미국 캘리포니아의 분산에너지자원 제공자 제도 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'DERP',
        description:
          'DERP는 Distributed Energy Resource Provider의 약자입니다.',
        point: 15,
      },
    ],
  },
  {
    day: 23,
    quiz: [
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
      {
        id: 10,
        type: 'multiple',
        question: '독일에서 중개사업자를 지원하기 위해 제공하는 제도는?',
        options: [
          'Feed-in Tariff',
          'Management Premium',
          'SGA 제도',
          'DERP 제도',
        ],
        correctAnswer: 'Management Premium',
        description:
          '독일은 소규모 재생에너지 모집 및 중개시장 형성 촉진을 위해 계통운영자가 재생에너지 발전사업자에게 Management Premium을 제공합니다.',
        point: 15,
      },
      {
        id: 11,
        type: 'multiple',
        question: '호주의 소규모 전력중개사업자 제도의 명칭은?',
        options: ['DERP', 'SC', 'SGA', 'VPP'],
        correctAnswer: 'SGA',
        description:
          'SGA(Small Generation Aggregator)는 호주의 중개사업자가 30MW 미만의 소형발전기를 모집하여 전력도매시장에 판매하는 제도입니다.',
        point: 15,
      },
      {
        id: 26,
        type: 'ox',
        question: '융합형 VPP는 공급형과 수요형 VPP의 장점만을 결합한 것이다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '융합형 VPP는 공급형 VPP와 수요형 VPP를 융합하여 전력망에 분산형 에너지 자원을 통해 전기를 공급하고 수요자원을 효율적으로 운영하며, 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 27,
        type: 'multiple',
        question: '중개사업자가 제공하는 서비스가 아닌 것은?',
        options: [
          '전력 거래대행',
          'REC 거래대행',
          '설비 유지보수',
          '전기요금 청구서 발행',
        ],
        correctAnswer: '전기요금 청구서 발행',
        description:
          '중개사업자는 소규모 자원에서 생산 또는 저장된 전력을 모아서 거래하며 신재생에너지 공급인증서(REC)의 거래대행 및 설비 유지보수 등의 서비스를 제공합니다.',
        point: 10,
      },
    ],
  },
  {
    day: 24,
    quiz: [
      {
        id: 2,
        type: 'ox',
        question: '2019년 9월 기준 소규모 전력중개시장은 매우 활성화되어 있다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '2019년 9월 기준으로 실제 운영 중인 중개사업자 수는 5개, 거래되는 용량은 11.1MW 수준으로 활성화되지 못하고 있습니다.',
        point: 10,
      },
      {
        id: 6,
        type: 'multiple',
        question: '공급형 VPP(가상발전소)의 주요 기능이 아닌 것은?',
        options: [
          '발전량 예측능력 강화',
          '전압제어',
          '예비력 제공',
          '소비자 전기요금 청구',
        ],
        correctAnswer: '소비자 전기요금 청구',
        description:
          '공급형 VPP는 소규모 태양광 발전소를 통합하여 발전량의 예측능력 강화, 전압제어, 예비력 제공 기능을 제공합니다.',
        point: 10,
      },
      {
        id: 12,
        type: 'ox',
        question: '한전 PPA 방식이 전력시장 판매방식보다 계량기 비용이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '전력거래소를 통한 전력시장 판매방법은 한전 PPA에 비해 계량기 비용이 높습니다. 이것이 소규모 전력중개시장 활성화의 주요 장애요인 중 하나입니다.',
        point: 10,
      },
      {
        id: 15,
        type: 'multiple',
        question: '미국 캘리포니아의 분산에너지자원 제공자 제도의 약자는?',
        options: ['DERP', 'SGA', 'VPP', 'ESS'],
        correctAnswer: 'DERP',
        description:
          'DERP(Distributed Energy Resource Provider)는 캘리포니아에서 분산형 에너지 자원을 모집·계량·정산을 일원화하여 운영하는 제도입니다.',
        point: 15,
      },
      {
        id: 28,
        type: 'multiple',
        question: '2017년 1MW 이하 소규모 태양광 발전 용량은?',
        options: ['약 2,367MW', '약 3,367MW', '약 4,367MW', '약 5,367MW'],
        correctAnswer: '약 4,367MW',
        description:
          '2017년 1MW 이하 소규모 태양광 발전 용량은 약 4,367MW로, 2012년 약 197MW 대비 약 22배 증가했습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 25,
    quiz: [
      {
        id: 3,
        type: 'short',
        question: 'VPP는 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Virtual Power Plant',
        description:
          'VPP는 Virtual Power Plant(가상발전소)의 약자로, 소규모 분산형 에너지 자원을 통합하여 하나의 발전소처럼 관리하는 시스템입니다.',
        point: 15,
      },
      {
        id: 7,
        type: 'multiple',
        question: 'VPP의 유형이 아닌 것은?',
        options: ['공급형 VPP', '수요형 VPP', '융합형 VPP', '분산형 VPP'],
        correctAnswer: '분산형 VPP',
        description:
          'VPP는 공급형, 수요형, 융합형의 세 가지 유형으로 구분됩니다. 융합형 VPP는 공급형과 수요형을 융합하여 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 16,
        type: 'ox',
        question: 'FIP 제도는 고정가격으로 전력을 매입하는 제도이다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'FIP(Feed-in Premium) 제도는 시장가격에 일정 수준의 보조금을 가산해 지급하는 제도로, 고정가격 매입제도인 FIT와는 다릅니다.',
        point: 10,
      },
      {
        id: 17,
        type: 'multiple',
        question:
          '소규모 전력중개시장 고도화 방안의 최종 단계(3단계)의 주요 내용은?',
        options: [
          '중개시장 개설을 위한 규정 마련',
          '계량시스템 개선',
          '소규모자원의 출력예측',
          'IT 기술과 접목한 가상발전소 모델 구축',
        ],
        correctAnswer: 'IT 기술과 접목한 가상발전소 모델 구축',
        description:
          '3단계는 IT, 제어, 통신기술 등을 활용한 가상발전소 모델로 고도화하는 최종단계로, 에너지시장과 보조서비스 시장 참여를 통해 발전, ESS, DR 등을 IT 기술과 접목하여 활용가치를 증대시킵니다.',
        point: 15,
      },
      {
        id: 29,
        type: 'ox',
        question:
          '전력거래소를 통한 판매는 한전 PPA보다 연간 20~30만원 정도 수입이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '전력시장 판매는 시간대별 SMP를 적용받아 한전 PPA 대비 연간 20~30만원 수입이 높지만, 계량기 비용이 높고 정산 절차가 복잡합니다.',
        point: 10,
      },
    ],
  },
  {
    day: 26,
    quiz: [
      {
        id: 4,
        type: 'multiple',
        question: '소규모 전력중개사업의 대상이 되는 전력자원의 용량 기준은?',
        options: ['500kW 이하', '1MW 이하', '5MW 이하', '10MW 이하'],
        correctAnswer: '1MW 이하',
        description:
          '소규모 전력중개사업은 1MW 이하의 소규모 전력자원(신재생에너지, ESS, 전기자동차)에서 생산·저장한 전기를 중개사업자가 모아 전력시장에서 거래하는 사업입니다.',
        point: 10,
      },
      {
        id: 8,
        type: 'ox',
        question: '수요형 VPP는 DR(수요반응) 제도가 발달한 나라에 적합하다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '수요형 VPP는 전력 피크 시 전력 사용을 줄이는 기능을 제공하므로, 소비자의 전기요금 절감 효과가 있어 DR 제도가 발달한 나라에 적합합니다.',
        point: 10,
      },
      {
        id: 13,
        type: 'multiple',
        question:
          '소규모 태양광사업자가 전력판매방법을 변경할 때 가장 중요한 요인은?',
        options: [
          '전력대금 청구 간편성',
          'REC 장기고정계약 가능여부',
          '계량기 비용',
          '중개사업자 신용도',
        ],
        correctAnswer: 'REC 장기고정계약 가능여부',
        description:
          '설문조사 결과, 소규모 태양광사업자가 전력판매방법을 변경함에 있어서 가장 중요한 요인은 REC 장기고정계약 가능여부로 나타났습니다.',
        point: 15,
      },
      {
        id: 21,
        type: 'multiple',
        question: '예측정산금 제도의 목적은?',
        options: [
          '중개사업자의 수수료 인상',
          '계량기 비용 절감',
          '태양광 발전량 입찰 정확도 제고',
          'REC 거래 간편화',
        ],
        correctAnswer: '태양광 발전량 입찰 정확도 제고',
        description:
          '예측정산금은 하루전 시장에서 시간대별 태양광 발전량 입찰의 정확도를 높일 경우 추가 정산금을 지급하는 인센티브 제도입니다.',
        point: 15,
      },
      {
        id: 22,
        type: 'ox',
        question:
          '독일의 Management Premium은 모든 재생에너지 설비에 동일하게 지급된다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          'Management Premium은 2015년부터 태양광 및 풍력발전 대상으로 원격조정이 가능한 설비에만 지급됩니다.',
        point: 10,
      },
    ],
  },
  {
    day: 27,
    quiz: [
      {
        id: 5,
        type: 'ox',
        question:
          '1MW 이하 소규모 태양광 발전의 2012년 대비 2017년 용량은 약 22배 증가했다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '1MW 이하의 소규모 태양광 발전의 용량은 2012년 약 197MW에서 2017년 4,367MW로 약 22배 증가하여 연평균 증가율 85.8%를 기록했습니다.',
        point: 10,
      },
      {
        id: 9,
        type: 'short',
        question: 'DER은 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Distributed Energy Resources',
        description:
          'DER은 Distributed Energy Resources(분산형 에너지 자원)의 약자로, 소규모 신재생에너지 발전과 에너지저장장치 등을 의미합니다.',
        point: 15,
      },
      {
        id: 14,
        type: 'ox',
        question:
          '2019년 10월 기준 한전 PPA는 1MW 이하 태양광 발전기 용량의 약 85%를 차지한다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '한전 PPA는 2019년 10월 기준으로 전체 1MW 이하 기수 중 약 95%, 용량 기준으로는 약 85%로 절대 다수를 차지합니다.',
        point: 10,
      },
      {
        id: 18,
        type: 'short',
        question:
          '호주의 소규모 전력중개사업자 제도 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'SGA',
        description: 'SGA는 Small Generation Aggregator의 약자입니다.',
        point: 15,
      },
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 28,
    quiz: [
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
      {
        id: 10,
        type: 'multiple',
        question: '독일에서 중개사업자를 지원하기 위해 제공하는 제도는?',
        options: [
          'Feed-in Tariff',
          'Management Premium',
          'SGA 제도',
          'DERP 제도',
        ],
        correctAnswer: 'Management Premium',
        description:
          '독일은 소규모 재생에너지 모집 및 중개시장 형성 촉진을 위해 계통운영자가 재생에너지 발전사업자에게 Management Premium을 제공합니다.',
        point: 15,
      },
      {
        id: 20,
        type: 'ox',
        question:
          '소규모 태양광 발전의 증가는 전력계통 운영에 부정적 영향을 줄 수 있다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '소규모 태양광 발전은 계통운영자가 정확한 발전량을 알 수 없어 급전계획에 차질을 발생시키고, 변동적인 발전 특성으로 인해 전압 및 주파수 유지에 부정적인 영향을 줄 수 있습니다.',
        point: 10,
      },
      {
        id: 23,
        type: 'multiple',
        question: 'BAU(현행) 상태에서 중개사업자의 시장점유율은?',
        options: ['3.3%', '5.5%', '11.1%', '24.1%'],
        correctAnswer: '3.3%',
        description:
          '현행 상태의 중개사업자의 점유율은 3.3%에 그쳐 현행 제도에서 추가적인 인센티브 없이는 중개사업자 활성화가 매우 어려울 것으로 전망됩니다.',
        point: 15,
      },
      {
        id: 25,
        type: 'multiple',
        question: '2012년 1MW 이하 소규모 태양광 발전 용량은?',
        options: ['약 97MW', '약 197MW', '약 297MW', '약 397MW'],
        correctAnswer: '약 197MW',
        description:
          '2012년 1MW 이하 소규모 태양광 발전 용량은 약 197MW였으며, 2017년에는 4,367MW로 약 22배 증가했습니다.',
        point: 10,
      },
    ],
  },
  {
    day: 29,
    quiz: [
      {
        id: 2,
        type: 'ox',
        question: '2019년 9월 기준 소규모 전력중개시장은 매우 활성화되어 있다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '2019년 9월 기준으로 실제 운영 중인 중개사업자 수는 5개, 거래되는 용량은 11.1MW 수준으로 활성화되지 못하고 있습니다.',
        point: 10,
      },
      {
        id: 6,
        type: 'multiple',
        question: '공급형 VPP(가상발전소)의 주요 기능이 아닌 것은?',
        options: [
          '발전량 예측능력 강화',
          '전압제어',
          '예비력 제공',
          '소비자 전기요금 청구',
        ],
        correctAnswer: '소비자 전기요금 청구',
        description:
          '공급형 VPP는 소규모 태양광 발전소를 통합하여 발전량의 예측능력 강화, 전압제어, 예비력 제공 기능을 제공합니다.',
        point: 10,
      },
      {
        id: 11,
        type: 'multiple',
        question: '호주의 소규모 전력중개사업자 제도의 명칭은?',
        options: ['DERP', 'SC', 'SGA', 'VPP'],
        correctAnswer: 'SGA',
        description:
          'SGA(Small Generation Aggregator)는 호주의 중개사업자가 30MW 미만의 소형발전기를 모집하여 전력도매시장에 판매하는 제도입니다.',
        point: 15,
      },
      {
        id: 24,
        type: 'short',
        question:
          '미국 캘리포니아의 분산에너지자원 제공자 제도 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'DERP',
        description:
          'DERP는 Distributed Energy Resource Provider의 약자입니다.',
        point: 15,
      },
      {
        id: 26,
        type: 'ox',
        question: '융합형 VPP는 공급형과 수요형 VPP의 장점만을 결합한 것이다.',
        options: ['O', 'X'],
        correctAnswer: 'O',
        description:
          '융합형 VPP는 공급형 VPP와 수요형 VPP를 융합하여 전력망에 분산형 에너지 자원을 통해 전기를 공급하고 수요자원을 효율적으로 운영하며, 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
    ],
  },
  {
    day: 30,
    quiz: [
      {
        id: 12,
        type: 'ox',
        question: '한전 PPA 방식이 전력시장 판매방식보다 계량기 비용이 높다.',
        options: ['O', 'X'],
        correctAnswer: 'X',
        description:
          '전력거래소를 통한 전력시장 판매방법은 한전 PPA에 비해 계량기 비용이 높습니다. 이것이 소규모 전력중개시장 활성화의 주요 장애요인 중 하나입니다.',
        point: 10,
      },
      {
        id: 15,
        type: 'multiple',
        question: '미국 캘리포니아의 분산에너지자원 제공자 제도의 약자는?',
        options: ['DERP', 'SGA', 'VPP', 'ESS'],
        correctAnswer: 'DERP',
        description:
          'DERP(Distributed Energy Resource Provider)는 캘리포니아에서 분산형 에너지 자원을 모집·계량·정산을 일원화하여 운영하는 제도입니다.',
        point: 15,
      },
      {
        id: 27,
        type: 'multiple',
        question: '중개사업자가 제공하는 서비스가 아닌 것은?',
        options: [
          '전력 거래대행',
          'REC 거래대행',
          '설비 유지보수',
          '전기요금 청구서 발행',
        ],
        correctAnswer: '전기요금 청구서 발행',
        description:
          '중개사업자는 소규모 자원에서 생산 또는 저장된 전력을 모아서 거래하며 신재생에너지 공급인증서(REC)의 거래대행 및 설비 유지보수 등의 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 28,
        type: 'multiple',
        question: '2017년 1MW 이하 소규모 태양광 발전 용량은?',
        options: ['약 2,367MW', '약 3,367MW', '약 4,367MW', '약 5,367MW'],
        correctAnswer: '약 4,367MW',
        description:
          '2017년 1MW 이하 소규모 태양광 발전 용량은 약 4,367MW로, 2012년 약 197MW 대비 약 22배 증가했습니다.',
        point: 10,
      },
      {
        id: 30,
        type: 'short',
        question: '신재생에너지 공급인증서의 약자는? (영문 대문자로 답하세요)',
        correctAnswer: 'REC',
        description:
          'REC는 Renewable Energy Certificate의 약자로 신재생에너지 공급인증서를 의미합니다.',
        point: 15,
      },
    ],
  },
  {
    day: 31,
    quiz: [
      {
        id: 3,
        type: 'short',
        question: 'VPP는 무엇의 약자인가요? (영문으로 답하세요)',
        correctAnswer: 'Virtual Power Plant',
        description:
          'VPP는 Virtual Power Plant(가상발전소)의 약자로, 소규모 분산형 에너지 자원을 통합하여 하나의 발전소처럼 관리하는 시스템입니다.',
        point: 15,
      },
      {
        id: 7,
        type: 'multiple',
        question: 'VPP의 유형이 아닌 것은?',
        options: ['공급형 VPP', '수요형 VPP', '융합형 VPP', '분산형 VPP'],
        correctAnswer: '분산형 VPP',
        description:
          'VPP는 공급형, 수요형, 융합형의 세 가지 유형으로 구분됩니다. 융합형 VPP는 공급형과 수요형을 융합하여 전력 수급 균형 서비스를 제공합니다.',
        point: 10,
      },
      {
        id: 13,
        type: 'multiple',
        question:
          '소규모 태양광사업자가 전력판매방법을 변경할 때 가장 중요한 요인은?',
        options: [
          '전력대금 청구 간편성',
          'REC 장기고정계약 가능여부',
          '계량기 비용',
          '중개사업자 신용도',
        ],
        correctAnswer: 'REC 장기고정계약 가능여부',
        description:
          '설문조사 결과, 소규모 태양광사업자가 전력판매방법을 변경함에 있어서 가장 중요한 요인은 REC 장기고정계약 가능여부로 나타났습니다.',
        point: 15,
      },
      {
        id: 17,
        type: 'multiple',
        question:
          '소규모 전력중개시장 고도화 방안의 최종 단계(3단계)의 주요 내용은?',
        options: [
          '중개시장 개설을 위한 규정 마련',
          '계량시스템 개선',
          '소규모자원의 출력예측',
          'IT 기술과 접목한 가상발전소 모델 구축',
        ],
        correctAnswer: 'IT 기술과 접목한 가상발전소 모델 구축',
        description:
          '3단계는 IT, 제어, 통신기술 등을 활용한 가상발전소 모델로 고도화하는 최종단계로, 에너지시장과 보조서비스 시장 참여를 통해 발전, ESS, DR 등을 IT 기술과 접목하여 활용가치를 증대시킵니다.',
        point: 15,
      },
      {
        id: 1,
        type: 'multiple',
        question: '소규모 전력중개시장 제도가 운영을 시작한 시기는?',
        options: ['2018년 2월', '2019년 2월', '2019년 9월', '2020년 2월'],
        correctAnswer: '2019년 2월',
        description:
          '정부는 2018년 12월에 전기사업법 및 시행령 개정을 완료하고, 소규모 전력중개사업 제도를 도입하였으며 2019년 2월부터 본격적으로 운영을 시작했습니다.',
        point: 10,
      },
    ],
  },
];
