import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/** Trim and strip accidental wrapping quotes (common when pasting into Vercel env UI). */
function normalizeMongoUri(raw: string): string {
  let u = raw.trim();
  if (
    (u.startsWith('"') && u.endsWith('"')) ||
    (u.startsWith("'") && u.endsWith("'"))
  ) {
    u = u.slice(1, -1).trim();
  }
  return u;
}

async function connectDB() {
  const raw = process.env.MONGODB_URI;
  if (!raw) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  const MONGODB_URI = normalizeMongoUri(raw);
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is empty after trimming');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Match Atlas “Connect → Driver” snippet: Stable API + sensible defaults for serverless.
    const opts = {
      bufferCommands: false,
      serverApi: {
        version: '1' as const,
        strict: true,
        deprecationErrors: true,
      },
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
