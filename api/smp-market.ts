const ODCLOUD_SMP_ENDPOINT =
  'https://api.odcloud.kr/api/15066755/v1/uddi:816c39cc-a4f7-47fe-a9c7-f4aa07a5e407';

type Req = {
  method?: string;
  query?: Record<string, unknown>;
};

type Res = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => Res;
  json: (body: unknown) => void;
  send: (body: string) => void;
  end: () => void;
};

export default async function handler(req: Req, res: Res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const SERVICE_KEY = process.env.ODCLOUD_SERVICE_KEY;
  if (!SERVICE_KEY) {
    res.status(500).json({ error: 'ODCLOUD_SERVICE_KEY is not configured' });
    return;
  }

  const page = String((req.query?.page as string | number | undefined) ?? '1').trim();
  const perPage = String((req.query?.perPage as string | number | undefined) ?? '1').trim();

  try {
    const url = new URL(ODCLOUD_SMP_ENDPOINT);
    url.searchParams.set('serviceKey', SERVICE_KEY);
    url.searchParams.set('page', page);
    url.searchParams.set('perPage', perPage);

    const r = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
    if (!r.ok) {
      const text = await r.text();
      res.status(r.status).send(text);
      return;
    }

    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}
