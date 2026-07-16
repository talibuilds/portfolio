import { Redis } from '@upstash/redis';

const VIEW_KEY = 'portfolio:views';
const BASE_OFFSET = 100;

// Initialize Redis client from environment variables
// You'll need UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// in your Vercel environment variables
function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Prevent caching so every visit gets fresh count
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const redis = getRedis();

    if (req.method === 'POST') {
      // Increment and return new count
      const count = await redis.incr(VIEW_KEY);
      return res.status(200).json({ views: count + BASE_OFFSET });
    }

    if (req.method === 'GET') {
      // Just fetch current count
      const count = (await redis.get(VIEW_KEY)) || 0;
      return res.status(200).json({ views: count + BASE_OFFSET });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('View counter error:', error);
    // Fallback: return base offset so UI never breaks
    return res.status(200).json({ views: BASE_OFFSET, fallback: true });
  }
}
