import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';

export const metadata = {
  title: 'Privacy Policy - GRAPHIQ STUDIO LLC',
  description: 'Privacy policy for graphiq.art and GRAPHIQ STUDIO LLC\'s mobile apps, including RoboPenguin.',
  openGraph: {
    title: 'Privacy Policy - GRAPHIQ STUDIO LLC',
    description: 'Privacy policy for graphiq.art and GRAPHIQ STUDIO LLC\'s mobile apps, including RoboPenguin.',
    url: '/privacy',
    siteName: 'GRAPHIQ STUDIO LLC',
    type: 'website',
  },
};

const HEADLINE_ICON = (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor">
    <path fill="currentColor" d="M19.6,9.6c0,0-3,0-4,0c-0.4,0-1.8-0.2-1.8-0.2c-0.6-0.1-1.1-0.2-1.6-0.6c-0.5-0.3-0.9-0.8-1.2-1.2
      c-0.3-0.4-0.4-0.9-0.5-1.4c0,0-0.1-1.1-0.2-1.5c-0.1-1.1,0-4.4,0-4.4C10.4,0.2,10.2,0,10,0S9.6,0.2,9.6,0.4c0,0,0.1,3.3,0,4.4
      c0,0.4-0.2,1.5-0.2,1.5C9.4,6.7,9.2,7.2,9,7.6C8.7,8.1,8.2,8.5,7.8,8.9c-0.5,0.3-1,0.5-1.6,0.6c0,0-1.2,0.1-1.7,0.2
      c-1,0.1-4.2,0-4.2,0C0.2,9.6,0,9.8,0,10c0,0.2,0.2,0.4,0.4,0.4c0,0,3.1-0.1,4.2,0c0.4,0,1.7,0.2,1.7,0.2c0.6,0.1,1.1,0.2,1.6,0.6
      c0.4,0.3,0.8,0.7,1.1,1.1c0.3,0.5,0.5,1,0.6,1.6c0,0,0.1,1.3,0.2,1.7c0,1,0,4.1,0,4.1c0,0.2,0.2,0.4,0.4,0.4s0.4-0.2,0.4-0.4
      c0,0,0-3.1,0-4.1c0-0.4,0.2-1.7,0.2-1.7c0.1-0.6,0.2-1.1,0.6-1.6c0.3-0.4,0.7-0.8,1.1-1.1c0.5-0.3,1-0.5,1.6-0.6
      c0,0,1.3-0.1,1.8-0.2c1,0,4,0,4,0c0.2,0,0.4-0.2,0.4-0.4C20,9.8,19.8,9.6,19.6,9.6L19.6,9.6z"/>
  </svg>
);

const LAST_UPDATED = 'July 7, 2026';

// The site's bare <h2> is a 7rem display headline — way too large for a
// sub-heading inside body copy, so override it down to article-heading size.
const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  lineHeight: 1.3,
  letterSpacing: 'normal',
  marginBottom: '1rem',
};

export default function Privacy() {
  return (
    <>
      <Loader />
      <Header />

      <main id="mxd-page-content" className="mxd-page-content inner-page-content">

        {/* Section - Inner Page Headline */}
        <div className="mxd-section mxd-section-inner-headline padding-headline-pre-block">
          <div className="mxd-container grid-container">
            <div className="mxd-block loading-wrap">
              <div className="container-fluid px-0">
                <div className="row gx-0">
                  <div className="col-12 col-xl-2 mxd-grid-item no-margin">
                    <div className="mxd-block__name name-inner-headline loading__item">
                      <p className="mxd-point-subtitle">
                        {HEADLINE_ICON}
                        <span>Legal</span>
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-xl-10 mxd-grid-item no-margin">
                    <div className="mxd-block__content">
                      <div className="mxd-block__inner-headline">
                        <h1 className="inner-headline__title loading__item">
                          Privacy Policy
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section - Policy Body */}
        <div className="mxd-section padding-pre-footer">
          <div className="mxd-container grid-container">

            <div className="mxd-block" style={{ marginBottom: '2rem' }}>
              <div className="container-fluid p-0">
                <div className="row g-0">
                  <div className="col-12 col-xl-8 mxd-grid-item no-margin">
                    <p className="t-xsmall t-muted" style={{ marginBottom: '1rem' }}>Last updated: {LAST_UPDATED}</p>
                    <p className="t-bright t-large">
                      GRAPHIQ STUDIO LLC (&quot;Graphiq,&quot; &quot;we,&quot; &quot;us&quot;) operates graphiq.art
                      and builds software products, including the mobile game RoboPenguin. This policy explains
                      what we collect, why, and the choices you have. It covers both this website and our apps
                      unless a section says otherwise.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mxd-block" style={{ marginBottom: '2.5rem' }}>
              <div className="container-fluid p-0">
                <div className="row g-0">
                  <div className="col-12 col-xl-8 mxd-grid-item no-margin">
                    <h2 style={sectionHeadingStyle}>Website (graphiq.art)</h2>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      If you contact us through this site (e.g. by email), we receive whatever you send us —
                      your email address and the content of your message — and use it only to respond to you.
                      We don&apos;t sell this information or share it with third parties for their own marketing.
                    </p>

                    <h2 style={sectionHeadingStyle}>Mobile apps (e.g. RoboPenguin)</h2>
                    <p className="t-bright" style={{ marginBottom: '1rem' }}>
                      RoboPenguin does not require an account, a name, an email address, or any other personal
                      identity to play. What the app does collect:
                    </p>
                    <ul className="t-bright" style={{ marginBottom: '1.5rem', paddingLeft: '1.2rem', listStyleType: 'disc' }}>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <strong>Advertising data.</strong>{' '}
                        RoboPenguin shows ads via Google AdMob (rewarded and
                        interstitial formats). Google and its advertising partners may collect device
                        identifiers (such as the Android Advertising ID) and other data to serve and measure
                        ads, and — where you have consented, as described below — to personalize them. See{' '}
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                          Google&apos;s Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                          Ads Settings
                        </a>{' '}
                        for details on how Google handles this data.
                      </li>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <strong>Consent (EEA/UK).</strong>{' '}
                        If you&apos;re in the EEA, UK, or Switzerland,
                        RoboPenguin shows a consent form (via Google&apos;s User Messaging Platform) before any
                        ad is requested, so you can choose whether ads are personalized.
                      </li>
                      <li style={{ marginBottom: '0.75rem' }}>
                        <strong>Leaderboard.</strong>{' '}
                        If you submit a run to the &quot;who flew the
                        farthest&quot; leaderboard, we store the nickname you chose, the distance for that run,
                        and an anonymous, random per-install identifier (not tied to your name, email, or device
                        hardware ID). This is public — anyone can see the leaderboard. Don&apos;t use your real
                        name as your nickname if you don&apos;t want it shown publicly.
                      </li>
                      <li>
                        <strong>Gameplay/save data.</strong>{' '}
                        Progress, currency, and settings are stored locally
                        on your device. We don&apos;t receive this data ourselves.
                      </li>
                    </ul>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      We use Supabase to host the leaderboard database. Supabase processes that data on our
                      behalf under its own security practices; we don&apos;t share it with anyone else.
                    </p>

                    <h2 style={sectionHeadingStyle}>Children</h2>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      RoboPenguin is not directed at children under 13, and we don&apos;t knowingly collect
                      personal information from them. Ad personalization is disabled for any audience marked as
                      child-directed in accordance with Google&apos;s policies.
                    </p>

                    <h2 style={sectionHeadingStyle}>Your choices</h2>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      You can reset or withdraw ad consent at any time from the app&apos;s settings where
                      offered by the platform, opt out of interest-based advertising through your device&apos;s
                      ad settings, or contact us to ask what data we hold about a leaderboard entry and have it
                      removed.
                    </p>

                    <h2 style={sectionHeadingStyle}>Changes to this policy</h2>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      We&apos;ll update this page if what we collect or how we use it changes, and update the
                      date at the top.
                    </p>

                    <h2 style={sectionHeadingStyle}>Contact</h2>
                    <p className="t-bright">
                      Questions about this policy or a data request:{' '}
                      <a href="mailto:hello@graphiq.art">hello@graphiq.art</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />

      {/* To Top Button */}
      <Link href="#0" id="to-top" className="btn btn-to-top slide-up anim-no-delay">
        <i className="ph ph-arrow-up"></i>
      </Link>
    </>
  );
}
