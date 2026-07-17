import { NextResponse } from 'next/server';
import { LAUNCH_SLOT_ID, getSlotStatus } from '@/lib/pricing-slot';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Public availability of the one-slot "Launch My Business in 72h" card.
// Returns only the effective status — nothing sensitive.
export async function GET() {
  const status = await getSlotStatus(LAUNCH_SLOT_ID);
  return NextResponse.json(
    { slot: LAUNCH_SLOT_ID, status },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
