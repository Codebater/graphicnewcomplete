import { supabase } from '@/lib/supabase';
import { getStripe } from '@/lib/stripe';
import { sendConsultationEmails } from '@/lib/consultation-emails';

export type ConsultationBookingPublic = {
  service: string;
  serviceLabel: string;
  date: string;
  time: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  budget: string;
};

const SERVICE_LABELS: Record<string, string> = {
  consultation: 'Design Consultation',
  'web-design': 'Web Design',
  branding: 'Brand Identity',
  'ui-ux': 'UI/UX Design',
};

export function serviceIdToLabel(id: string): string {
  return SERVICE_LABELS[id] || id;
}

/**
 * After Stripe marks the Checkout session paid: persist status and send Resend emails once.
 */
export async function finalizeConsultationFromSessionId(
  sessionId: string
): Promise<{ ok: true; booking: ConsultationBookingPublic } | { ok: false; error: string }> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    return { ok: false, error: 'Payment not completed' };
  }

  const consultationId = session.metadata?.consultationId;
  if (!consultationId) {
    return { ok: false, error: 'Missing booking reference' };
  }

  // Mark the booking paid.
  const { data: booking, error } = await supabase
    .from('consultation_bookings')
    .update({ status: 'paid', stripe_session_id: sessionId })
    .eq('id', consultationId)
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('consultation finalize update failed:', error);
    return { ok: false, error: 'Booking update failed' };
  }
  if (!booking) {
    return { ok: false, error: 'Booking not found' };
  }

  // Send emails exactly once: atomically flip emails_sent false -> true.
  // If no row matches (already true), we are not the one who flipped it -> skip.
  const { data: flipped } = await supabase
    .from('consultation_bookings')
    .update({ emails_sent: true })
    .eq('id', consultationId)
    .eq('emails_sent', false)
    .select('*')
    .maybeSingle();

  if (flipped) {
    try {
      await sendConsultationEmails(flipped);
    } catch (e) {
      await supabase
        .from('consultation_bookings')
        .update({ emails_sent: false })
        .eq('id', consultationId);
      console.error('Consultation email delivery failed:', e);
      throw e;
    }
  }

  return {
    ok: true,
    booking: {
      service: booking.service,
      serviceLabel: serviceIdToLabel(booking.service),
      date: booking.date,
      time: booking.time,
      name: booking.name,
      company: booking.company,
      email: booking.email,
      phone: booking.phone,
      message: booking.message,
      budget: booking.budget,
    },
  };
}
