import connectDB from '@/lib/mongodb';
import ConsultationBooking from '@/models/ConsultationBooking';
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

  await connectDB();
  const booking = await ConsultationBooking.findById(consultationId);
  if (!booking) {
    return { ok: false, error: 'Booking not found' };
  }

  booking.status = 'paid';
  booking.stripeSessionId = sessionId;
  await booking.save();

  const previous = await ConsultationBooking.findOneAndUpdate(
    { _id: consultationId, emailsSent: false },
    { $set: { emailsSent: true } },
    { new: false }
  );

  if (previous) {
    try {
      await sendConsultationEmails(previous);
    } catch (e) {
      await ConsultationBooking.updateOne({ _id: consultationId }, { $set: { emailsSent: false } });
      console.error('Consultation email delivery failed:', e);
      throw e;
    }
  }

  const doc = await ConsultationBooking.findById(consultationId);
  if (!doc) {
    return { ok: false, error: 'Booking not found' };
  }
  const plain = doc.toObject();
  return {
    ok: true,
    booking: {
      service: plain.service,
      serviceLabel: serviceIdToLabel(plain.service),
      date: plain.date,
      time: plain.time,
      name: plain.name,
      company: plain.company,
      email: plain.email,
      phone: plain.phone,
      message: plain.message,
      budget: plain.budget,
    },
  };
}
