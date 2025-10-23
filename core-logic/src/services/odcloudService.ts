const DEFAULT_PER_PAGE = 1;

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

function getApiOrigin(): string | null {
  const expoOrigin = process.env.EXPO_PUBLIC_API_ORIGIN ?? null;
  if (expoOrigin && expoOrigin.trim().length > 0) return expoOrigin.trim();
  return null;
}

type fetchRecMarketOdcloudProps = {
  page?: number;
  perPage?: number;
  origin?: string;
};

export async function fetchRecMarketOdcloud({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  origin,
}: fetchRecMarketOdcloudProps = {}): Promise<OdcloudRecMarketRow[]> {
  const base = origin ?? getApiOrigin();
  const finalUrl = base ? `${base}/api/rec-market` : '/api/rec-market';

  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('perPage', String(perPage));

  const r = await fetch(`${finalUrl}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!r.ok) {
    throw new Error(`odcloud 프록시 요청 실패: ${r.status}`);
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
  origin,
}: {
  page?: number;
  perPage?: number;
  origin?: string;
} = {}): Promise<OdcloudSmpRow[]> {
  const base = origin ?? getApiOrigin();
  const finalUrl = base ? `${base}/api/smp-market` : '/api/smp-market';

  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('perPage', String(perPage));

  const r = await fetch(`${finalUrl}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!r.ok) {
    throw new Error(`odcloud 프록시 요청 실패: ${r.status}`);
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
