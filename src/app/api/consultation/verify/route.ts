import { NextResponse } from 'next/server';
import { finalizeConsultationFromSessionId } from '@/lib/consultation-payment';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get('session_id');
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }

  try {
    const result = await finalizeConsultationFromSessionId(sessionId);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ booking: result.booking });
  } catch (e) {
    console.error('consultation verify:', e);
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
  }
}
