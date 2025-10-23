const DEFAULT_PER_PAGE = 1;
const ODCLOUD_SMP_ENDPOINT =
  'https://api.odcloud.kr/api/15066755/v1/uddi:816c39cc-a4f7-47fe-a9c7-f4aa07a5e407';
const ODCLOUD_REC_ENDPOINT =
  'https://api.odcloud.kr/api/15090556/v1/uddi:2d25d87e-19d5-456d-9cae-bbe52219cc0d';

export type OdcloudRecMarketRow = {
  거래일: string;
  '육지 거래량(REC)'?: number;
  '육지 평균가(원)'?: number;
  '육지 최고가(원)'?: number;
  '육지 최저가(원)'?: number;
  '제주 거래량(REC)'?: number;
  '제주 평균가(원)'?: number;
  '제주 최고가(원)'?: number;
  '제주 최저가(원)'?: number;
  '종가(원)'?: number;
  [key: string]: string | number | undefined;
};

export type OdcloudRecMarketResponse = {
  currentCount?: number;
  data?: OdcloudRecMarketRow[];
  matchCount?: number;
  page?: number;
  perPage?: number;
  totalCount?: number;
};

function getOdcloudServiceKey(): string {
  const key = process.env.EXPO_PUBLIC_ODCLOUD_SERVICE_KEY ?? '';
  if (!key || key.trim().length === 0) {
    throw new Error('EXPO_PUBLIC_ODCLOUD_SERVICE_KEY is not set');
  }
  return key.trim();
}

type fetchRecMarketOdcloudProps = {
  page?: number;
  perPage?: number;
};

export async function fetchRecMarketOdcloud({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
}: fetchRecMarketOdcloudProps = {}): Promise<OdcloudRecMarketRow[]> {
  const params = new URLSearchParams();
  params.set('serviceKey', getOdcloudServiceKey());
  params.set('page', String(page));
  params.set('perPage', String(perPage));

  const r = await fetch(`${ODCLOUD_REC_ENDPOINT}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!r.ok) {
    throw new Error(`odcloud 요청 실패: ${r.status}`);
  }
  const data = (await r.json()) as
    | OdcloudRecMarketResponse
    | OdcloudRecMarketRow[];

  let rows: OdcloudRecMarketRow[] = [];
  if (Array.isArray(data)) {
    rows = data;
  } else if (data && Array.isArray(data.data)) {
    rows = data.data;
  }

  // 문자열로 온 숫자 필드들을 숫자로 변환
  return rows.map((row) => {
    const converted: OdcloudRecMarketRow = { ...row };
    const numericFields = [
      '육지 거래량(REC)',
      '육지 평균가(원)',
      '육지 최고가(원)',
      '육지 최저가(원)',
      '제주 거래량(REC)',
      '제주 평균가(원)',
      '제주 최고가(원)',
      '제주 최저가(원)',
      '종가(원)',
    ];

    for (const field of numericFields) {
      const value = row[field];
      if (typeof value === 'string') {
        converted[field] = parseFloat(value);
      }
    }

    return converted;
  });
}

export type OdcloudSmpRow = {
  거래일자: string;
  SMP?: number;
  [key: string]: string | number | undefined;
};

export type OdcloudSmpResponse = {
  currentCount?: number;
  data?: OdcloudSmpRow[];
  matchCount?: number;
  page?: number;
  perPage?: number;
  totalCount?: number;
};

export async function fetchSmpMarketOdcloud({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
}: {
  page?: number;
  perPage?: number;
} = {}): Promise<OdcloudSmpRow[]> {
  const params = new URLSearchParams();
  params.set('serviceKey', getOdcloudServiceKey());
  params.set('page', String(page));
  params.set('perPage', String(perPage));

  const r = await fetch(`${ODCLOUD_SMP_ENDPOINT}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!r.ok) {
    throw new Error(`odcloud 요청 실패: ${r.status}`);
  }
  const data = (await r.json()) as OdcloudSmpResponse | OdcloudSmpRow[];

  let rows: OdcloudSmpRow[] = [];
  if (Array.isArray(data)) {
    rows = data;
  } else if (data && Array.isArray(data.data)) {
    rows = data.data;
  }

  // API 응답 필드명을 표준 필드명으로 변환
  return rows.map((row) => {
    const smpValue = row.SMP ?? row['에스엠피(SMP) 가중평균'];
    return {
      ...row,
      거래일자: row.거래일자,
      SMP: typeof smpValue === 'string' ? parseFloat(smpValue) : smpValue,
    };
  });
}
