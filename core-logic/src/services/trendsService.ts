const SMP_ENDPOINT = 'https://www.data.go.kr/data/15076302/openapi.do';
const REC_ENDPOINT = 'https://www.data.go.kr/data/15099762/openapi.do';

interface ApiResponse<T> {
  response?: {
    header?: {
      resultCode?: string;
      resultMsg?: string;
    };
    body?: {
      items?: {
        item?: T | T[];
      };
    };
  };
}

export interface SmpItem {
  areacd?: string;
  chgRt?: string;
  date?: string;
  smp?: string;
}

export interface RecItem {
  areacd?: string;
  chgRt?: string;
  date?: string;
  avgPrc?: string;
  trdCnt?: string;
}

type FetchOptions = {
  endpoint: string;
  query: Record<string, string>;
};

function getServiceKey(): string {
  const key =
    process.env.EXPO_PUBLIC_DATA_GO_KR_KEY ?? process.env.DATA_GO_KR_KEY;
  if (!key) {
    throw new Error('DATA.GO.KR 서비스 키가 설정되지 않았습니다.');
  }
  return key;
}

async function requestApi<T>({ endpoint, query }: FetchOptions): Promise<T[]> {
  const serviceKey = getServiceKey();
  const params = new URLSearchParams({
    serviceKey,
    pageNo: '1',
    numOfRows: '10',
    dataType: 'JSON',
    ...query,
  });

  const response = await fetch(`${endpoint}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  const resultCode = payload.response?.header?.resultCode ?? '00';
  if (resultCode !== '00') {
    const message = payload.response?.header?.resultMsg ?? '알 수 없는 오류';
    throw new Error(`API 오류 (${resultCode}): ${message}`);
  }

  const items = payload.response?.body?.items?.item;
  if (!items) {
    return [];
  }

  return Array.isArray(items) ? items : [items];
}

export async function fetchJejuSmpDaily(date: string): Promise<SmpItem[]> {
  return requestApi<SmpItem>({
    endpoint: SMP_ENDPOINT,
    query: {
      date,
      areacd: '3',
    },
  });
}

export async function fetchJejuRecDaily(date: string): Promise<RecItem[]> {
  return requestApi<RecItem>({
    endpoint: REC_ENDPOINT,
    query: {
      date,
      areacd: '3',
    },
  });
}
