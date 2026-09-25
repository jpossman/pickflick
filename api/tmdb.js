// Server-side proxy to TMDB. Keeps your API key hidden from the browser.
// Set ONE environment variable in Vercel: TMDB_KEY
// It accepts either the long "API Read Access Token" (recommended) or the short 32-character "API Key".

const ALLOWED_PATHS = [
  /^\/discover\/(movie|tv)$/,
  /^\/(movie|tv)\/\d+$/,
  /^\/(movie|tv)\/\d+\/watch\/providers$/,
];

const ALLOWED_PARAMS = new Set([
  'page', 'sort_by', 'with_genres', 'with_original_language', 'language',
  'primary_release_date.gte', 'primary_release_date.lte',
  'first_air_date.gte', 'first_air_date.lte',
  'with_runtime.gte', 'with_runtime.lte',
  'vote_average.gte', 'vote_count.gte',
]);

export default async function handler(req, res) {
  const key = (process.env.TMDB_KEY || process.env.TMDB_TOKEN || process.env.TMDB_API_KEY || '').trim();
  if (!key) {
    res.status(500).json({
      error: 'The server has no TMDB key yet. In Vercel, open Settings → Environment Variables, add TMDB_KEY, then redeploy.',
    });
    return;
  }

  const { path, ...rest } = req.query || {};
  if (typeof path !== 'string' || !ALLOWED_PATHS.some((re) => re.test(path))) {
    res.status(400).json({ error: 'That request is not allowed.' });
    return;
  }

  const url = new URL('https://api.themoviedb.org/3' + path);
  for (const [k, v] of Object.entries(rest)) {
    if (ALLOWED_PARAMS.has(k) && typeof v === 'string') url.searchParams.set(k, v);
  }
  if (path.startsWith('/discover/')) url.searchParams.set('include_adult', 'false');

  const headers = { accept: 'application/json' };
  if (/^[a-f0-9]{32}$/i.test(key)) url.searchParams.set('api_key', key);
  else headers.Authorization = `Bearer ${key}`;

  try {
    const upstream = await fetch(url, { headers });
    const data = await upstream.json();
    if (upstream.ok) {
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    } else if (upstream.status === 401) {
      data.error = 'TMDB rejected the key. Double-check the TMDB_KEY value in Vercel, then redeploy.';
    }
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Could not reach TMDB. Try again in a moment.' });
  }
}
