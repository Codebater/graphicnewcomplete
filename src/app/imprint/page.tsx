import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Imprint - GRAPHIQ STUDIO LLC',
  description: 'Legal notice and company details for GRAPHIQ STUDIO LLC, operator of graphiq.art and its brands Clausign and Fregio.',
  openGraph: {
    title: 'Imprint - GRAPHIQ STUDIO LLC',
    description: 'Legal notice and company details for GRAPHIQ STUDIO LLC, operator of graphiq.art and its brands Clausign and Fregio.',
    url: '/imprint',
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

const LAST_UPDATED = 'July 11, 2026';

// The site's bare <h2> is a 7rem display headline — way too large for a
// sub-heading inside body copy, so override it down to article-heading size.
const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  lineHeight: 1.3,
  letterSpacing: 'normal',
  marginBottom: '1rem',
};

export default function Imprint() {
  return (
    <>
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
                          Imprint
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section - Imprint Body */}
        <div className="mxd-section padding-pre-footer">
          <div className="mxd-container grid-container">

            <div className="mxd-block" style={{ marginBottom: '2rem' }}>
              <div className="container-fluid p-0">
                <div className="row g-0">
                  <div className="col-12 col-xl-8 mxd-grid-item no-margin">
                    <p className="t-xsmall t-muted" style={{ marginBottom: '1rem' }}>Last updated: {LAST_UPDATED}</p>
                    <p className="t-bright t-large">
                      Legal notice and company details for this website, in the interest of transparency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mxd-block" style={{ marginBottom: '2.5rem' }}>
              <div className="container-fluid p-0">
                <div className="row g-0">
                  <div className="col-12 col-xl-8 mxd-grid-item no-margin">

                    <h2 style={sectionHeadingStyle}>Site operator</h2>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      <strong>GRAPHIQ STUDIO LLC</strong><br />
                      3833 Powerline Rd, Suite 201<br />
                      Fort Lauderdale, FL 33309<br />
                      United States
                    </p>

                    <h2 style={sectionHeadingStyle}>Contact</h2>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      Email: <a href="mailto:hello@graphiq.art">hello@graphiq.art</a><br />
                      Web: <a href="https://www.graphiq.art" target="_blank" rel="noopener noreferrer">graphiq.art</a>
                    </p>

                    <h2 style={sectionHeadingStyle}>Brands</h2>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      GRAPHIQ STUDIO LLC also operates, as doing-business-as (DBA) brands,{' '}
                      <a href="https://www.clausign.com/" target="_blank" rel="noopener noreferrer">Clausign</a>{' '}
                      (clausign.com) and{' '}
                      <a href="https://www.fregio.ai/" target="_blank" rel="noopener noreferrer">Fregio</a>{' '}
                      (fregio.ai). The company also builds software products including the mobile game
                      RoboPenguin.
                    </p>

                    <h2 style={sectionHeadingStyle}>Responsibility for content</h2>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      GRAPHIQ STUDIO LLC is responsible for the content of graphiq.art. We prepare this
                      content with care, but assume no liability for the accuracy, completeness or timeliness
                      of the information provided. Where this site links to external websites, we have no
                      influence over their content and accept no responsibility for it; the respective
                      operators are responsible for their own pages.
                    </p>

                    <h2 style={sectionHeadingStyle}>Intellectual property</h2>
                    <p className="t-bright" style={{ marginBottom: '1.5rem' }}>
                      All content, branding, designs and software on graphiq.art, clausign.com, fregio.ai and
                      in our apps — including the Clausign and Fregio products — is the intellectual property
                      of GRAPHIQ STUDIO LLC (including its DBA brands) unless stated otherwise, and may not be
                      reproduced or used without our permission.
                    </p>

                    <h2 style={sectionHeadingStyle}>Privacy</h2>
                    <p className="t-bright">
                      How we handle personal data is described in our{' '}
                      <Link href="/privacy">Privacy Policy</Link>.
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
