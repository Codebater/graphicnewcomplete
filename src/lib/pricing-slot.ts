import { supabase, supabaseConfigured } from './supabase';

// One-slot products on the pricing page (currently just the "Launch My
// Business in 72 hours" card). The slot lives in public.pricing_slots and
// moves through: available → reserved (someone is in Stripe checkout)
// → booked (they paid) — or back to available when a reservation expires.
export const LAUNCH_SLOT_ID = 'launch-72h';

// How long a Stripe checkout reservation holds the slot before it silently
// frees up again (checkout abandoned / tab closed).
const RESERVATION_MINUTES = 40;

export type SlotStatus = 'available' | 'reserved' | 'booked';

type SlotRow = {
  id: string;
  status: SlotStatus;
  reserved_until: string | null;
};

// Effective status with expired reservations collapsed back to 'available'.
export async function getSlotStatus(id: string = LAUNCH_SLOT_ID): Promise<SlotStatus> {
  // Without Supabase we fail OPEN (available): a broken env var must never
  // make the flagship card unbuyable. The verify step still gates the mark.
  if (!supabaseConfigured()) return 'available';

  const { data, error } = await supabase
    .from('pricing_slots')
    .select('id, status, reserved_until')
    .eq('id', id)
    .maybeSingle<SlotRow>();

  if (error || !data) return 'available';
  if (data.status === 'booked') return 'booked';
  if (data.status === 'reserved') {
    const until = data.reserved_until ? Date.parse(data.reserved_until) : 0;
    if (until > Date.now()) return 'reserved';
    return 'available'; // reservation expired
  }
  return 'available';
}

// Hold the slot while a Stripe checkout session is open. Atomic on the DB
// side (SECURITY DEFINER function): succeeds only when the slot is available
// or the previous reservation expired — a live reservation or a booking can
// never be stolen. Returns whether the hold was won.
export async function reserveSlot(sessionId: string, id: string = LAUNCH_SLOT_ID): Promise<boolean> {
  if (!supabaseConfigured()) return true;
  const { data, error } = await supabase.rpc('reserve_pricing_slot', {
    p_id: id,
    p_session: sessionId,
    p_minutes: RESERVATION_MINUTES,
  });
  if (error) {
    console.error('reserve_pricing_slot:', error.message);
    return true; // fail open — availability was already checked
  }
  return data === true;
}

// Permanently mark the slot booked (called ONLY after the server verified the
// payment with Stripe). Idempotent for the same session.
export async function bookSlot(sessionId: string, id: string = LAUNCH_SLOT_ID): Promise<void> {
  if (!supabaseConfigured()) return;
  const { error } = await supabase.rpc('book_pricing_slot', {
    p_id: id,
    p_session: sessionId,
  });
  if (error) console.error('book_pricing_slot:', error.message);
}
