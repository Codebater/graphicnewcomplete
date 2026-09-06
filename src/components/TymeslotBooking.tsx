'use client';

// Public booking is handled by our self-hosted Tymeslot scheduler (runs on the
// GRAPHIQ NAS, exposed to the public internet via a Tailscale Funnel node at
// book.tailec23df.ts.net). Every booking it takes — availability, the calendar,
// Stripe payment for paid calls — is written straight into our Nextcloud master
// calendar, so this ONE embed keeps every appointment in sync in one place.
//
// It replaces the old custom step-form (which invented its own availability and
// never reached the real calendar). Tymeslot already whitelists graphiq.art in
// its CSP `frame-ancestors`, so it is allowed to be framed here.
//
// The fallback line always renders: if the NAS/Funnel node is ever unreachable,
// or a browser blocks the frame, visitors still get a working way to book.

const BOOKING_URL = 'https://book.tailec23df.ts.net/graphiq';

export default function TymeslotBooking() {
  return (
    <div className="tymeslot-embed">
      <iframe
        src={BOOKING_URL}
        title="Book an appointment with GRAPHIQ"
        className="tymeslot-embed__frame"
        loading="lazy"
        // Stripe (embedded payment for the paid call) needs the Payment Request API
        allow="payment"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          display: 'block',
          width: '100%',
          height: 'clamp(680px, 84vh, 1040px)',
          border: '1px solid rgba(128,128,128,0.18)',
          borderRadius: '1.5rem',
          background: 'var(--base-tint, #f0ebe0)',
          colorScheme: 'normal',
        }}
      />
      <p
        className="t-muted"
        style={{ marginTop: '1rem', fontSize: '1.3rem', textAlign: 'center' }}
      >
        Scheduler not loading?{' '}
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Open it in a new tab
        </a>{' '}
        or email{' '}
        <a href="mailto:hello@graphiq.art?subject=Booking%20request">hello@graphiq.art</a>.
      </p>
    </div>
  );
}
