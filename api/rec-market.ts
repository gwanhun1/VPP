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

  res.status(410).json({
    error:
      'This route is deprecated. The mobile app now calls ODCloud directly. Remove /api/rec-market usage.',
  });
}
