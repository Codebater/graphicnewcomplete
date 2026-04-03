'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StepForm from '@/components/StepForm';
import ConsultationPaymentSuccess from '@/components/ConsultationPaymentSuccess';

function ContactConsultationInner() {
  const searchParams = useSearchParams();
  const consultation = searchParams.get('consultation');
  const sessionId = searchParams.get('session_id');

  if (consultation === 'success' && sessionId) {
    return <ConsultationPaymentSuccess sessionId={sessionId} />;
  }

  return (
    <>
      {consultation === 'cancelled' && (
        <div
          className="mb-4 p-4"
          style={{
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)',
          }}
          role="status"
        >
          <p className="t-bright mb-0">
            Payment was cancelled. You can review your details and try again when you&apos;re ready.
          </p>
        </div>
      )}
      <StepForm />
    </>
  );
}

export default function ContactConsultationFlow() {
  return (
    <Suspense
      fallback={
        <div className="step-form-container text-center" style={{ padding: '3rem' }}>
          <p className="t-large">Loading…</p>
        </div>
      }
    >
      <ContactConsultationInner />
    </Suspense>
  );
}
