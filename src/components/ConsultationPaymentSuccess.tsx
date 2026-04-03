'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Booking = {
  serviceLabel: string;
  date: string;
  time: string;
  name: string;
  email: string;
};

export default function ConsultationPaymentSuccess({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/consultation/verify?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error || 'Could not confirm payment');
          return;
        }
        if (!cancelled && data.booking) {
          setBooking({
            serviceLabel: data.booking.serviceLabel,
            date: data.booking.date,
            time: data.booking.time,
            name: data.booking.name,
            email: data.booking.email,
          });
        }
      } catch {
        if (!cancelled) setError('Something went wrong. If you were charged, we will follow up by email.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const formatDate = (isoDate: string) => {
    try {
      return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  if (error) {
    return (
      <div className="step-form-success text-center">
        <p className="t-large" style={{ color: '#b91c1c' }}>
          {error}
        </p>
        <button className="btn btn-default btn-large" type="button" onClick={() => router.push('/contact')}>
          Back to contact
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="step-form-container text-center" style={{ padding: '3rem' }}>
        <p className="t-large">Confirming your payment…</p>
        <p className="t-muted t-small">This usually takes a few seconds.</p>
      </div>
    );
  }

  return (
    <div className="step-form-success text-center">
      <div className="success-icon">
        <i className="ph-fill ph-check-circle" style={{ fontSize: '4rem', color: '#22c55e' }} />
      </div>
      <h3 className="success-title">Payment received</h3>
      <p className="success-message">
        Thank you, {booking.name}. We&apos;ve charged <strong>$300</strong> for your consultation request.
        <br />
        A confirmation was sent to <strong>{booking.email}</strong> from{' '}
        <strong>updates@graphiq.art</strong>.
      </p>
      <div className="booking-details">
        <div className="detail-item">
          <strong>Service:</strong> {booking.serviceLabel}
        </div>
        <div className="detail-item">
          <strong>Preferred date:</strong> {formatDate(booking.date)}
        </div>
        <div className="detail-item">
          <strong>Preferred time:</strong> {booking.time}
        </div>
      </div>
      <button className="btn btn-default btn-large" type="button" onClick={() => router.push('/contact')}>
        Book another meeting
      </button>
    </div>
  );
}
