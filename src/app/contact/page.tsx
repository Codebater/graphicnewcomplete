import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StepForm from '@/components/StepForm';
import '@/styles/step-form.css';

export const metadata = {
  title: 'Contact - Graphiq.art - Let\'s Talk About Your Project',
  description: 'Get in touch with Graphiq.art for your next creative project. We\'re here to answer your questions and bring your ideas to life. Contact us today!',
  keywords: 'contact, get in touch, creative agency contact, project inquiry, design consultation, web development contact',
  openGraph: {
    title: 'Contact - Graphiq.art',
    description: 'Get in touch with Graphiq.art for your next creative project. We\'re here to answer your questions and bring your ideas to life.',
    url: '/contact',
    siteName: 'Graphiq.art',
    type: 'website',
  },
};

export default function Contact() {
  return (
    <>
      
      {/* Loader */}
      <div id="loader" className="loader">
        <div className="loader__wrapper">
          <div className="loader__content">
            <div className="loader__count">
              <span className="count__text">0</span>
              <span className="count__percent">%</span>
            </div>
          </div>
        </div>
      </div>

      <Header />

      {/* Page Content */}
      <main id="mxd-page-content" className="mxd-page-content inner-page-content">
        
        {/* Section - Inner Page Headline */}
        <div className="mxd-section mxd-section-inner-headline padding-s-text-pre-form overflow-hidden">
          <div className="mxd-container grid-container">
          
            {/* Block - Inner Page Headline */}
            <div className="mxd-block loading-wrap">
              <div className="container-fluid px-0">
                <div className="row gx-0">

                  {/* Inner Headline Name */}
                  <div className="col-12 col-xl-2 mxd-grid-item no-margin">
                    <div className="mxd-block__name name-inner-headline">
                      <p className="mxd-point-subtitle">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor">
                          <path fill="currentColor" d="M19.6,9.6c0,0-3,0-4,0c-0.4,0-1.8-0.2-1.8-0.2c-0.6-0.1-1.1-0.2-1.6-0.6c-0.5-0.3-0.9-0.8-1.2-1.2
                            c-0.3-0.4-0.4-0.9-0.5-1.4c0,0-0.1-1.1-0.2-1.5c-0.1-1.1,0-4.4,0-4.4C10.4,0.2,10.2,0,10,0S9.6,0.2,9.6,0.4c0,0,0.1,3.3,0,4.4
                            c0,0.4-0.2,1.5-0.2,1.5C9.4,6.7,9.2,7.2,9,7.6C8.7,8.1,8.2,8.5,7.8,8.9c-0.5,0.3-1,0.5-1.6,0.6c0,0-1.2,0.1-1.7,0.2
                            c-1,0.1-4.2,0-4.2,0C0.2,9.6,0,9.8,0,10c0,0.2,0.2,0.4,0.4,0.4c0,0,3.1-0.1,4.2,0c0.4,0,1.7,0.2,1.7,0.2c0.6,0.1,1.1,0.2,1.6,0.6
                            c0.4,0.3,0.8,0.7,1.1,1.1c0.3,0.5,0.5,1,0.6,1.6c0,0,0.1,1.3,0.2,1.7c0,1,0,4.1,0,4.1c0,0.2,0.2,0.4,0.4,0.4s0.4-0.2,0.4-0.4
                            c0,0,0-3.1,0-4.1c0-0.4,0.2-1.7,0.2-1.7c0.1-0.6,0.2-1.1,0.6-1.6c0.3-0.4,0.7-0.8,1.1-1.1c0.5-0.3,1-0.5,1.6-0.6
                            c0,0,1.3-0.1,1.8-0.2c1,0,4,0,4,0c0.2,0,0.4-0.2,0.4-0.4C20,9.8,19.8,9.6,19.6,9.6L19.6,9.6z"/>
                        </svg>
                        <span>Contact</span>
                      </p>
                    </div>
                  </div>

                  {/* Inner Headline Content */}
                  <div className="col-12 col-xl-8 mxd-grid-item no-margin">
                    <div className="mxd-block__content">
                      <div className="mxd-block__inner-headline loading__item">
                        <h1 className="inner-headline__title">
                          Let&apos;s schedule<br/>a consultation!
                        </h1>
                        <Link className="btn btn-line-headline slide-right-up anim-no-delay" href="mailto:hello@graphiq.art?subject=Message%20from%20your%20site">
                          <span className="btn-caption">hello@graphiq.art</span>
                          <i className="ph-bold ph-arrow-up-right"></i>
                        </Link>
                        <p className="inner-headline__text t-large t-bright loading__item">
                          Ready to bring your vision to life? Book a consultation with our expert team. Choose your preferred service, date, and time in just a few simple steps.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section - Step Form */}
        <div className="mxd-section mxd-section-inner-form padding-default">
          <div className="mxd-container grid-container">
            <div className="mxd-block">
              <div className="container-fluid px-0">
                <div className="row gx-0">
                  <div className="col-12 col-xl-1 mxd-grid-item no-margin"></div>
                  <div className="col-12 col-xl-10">
                    <div className="mxd-block__content contact">
                      <div className="mxd-block__inner-form loading__fade">
                        <StepForm />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-xl-1 mxd-grid-item no-margin"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section - Marquee Text One Line */}
        <div className="mxd-section padding-mtext">
          <div className="mxd-container fullwidth-container">

            {/* Block - Marquee Text One Line */}
            <div className="mxd-block">
              <div className="marquee marquee-right--gsap muted-extra">
                <div className="marquee__toright">
                  
                  {/* Marquee Items */}
                  {Array(4).fill('Connect').map((text, index) => (
                    <div key={index} className="marquee__item one-line item-regular text">
                      <p className="marquee__text">{text}</p>
                      <div className="marquee__image">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
                          <path fill="currentColor" d="M78.4,38.4c0,0-11.8,0-15.8,0c-1.6,0-4.8-0.2-7.1-0.8c-2.3-0.6-4.3-0.8-6.3-2.4c-2-1.2-3.5-3.2-4.7-4.8
                            c-1.2-1.6-1.6-3.6-2-5.5c-0.3-1.5-0.7-4.3-0.8-5.9c-0.2-4.3,0-17.4,0-17.4C41.8,0.8,41,0,40.2,0s-1.6,0.8-1.6,1.6c0,0,0,13.1,0,17.4
                            c0,1.6-0.6,4.3-0.8,5.9c-0.3,2-0.8,4-2,5.5c-1.2,2-2.8,3.6-4.7,4.8s-4,1.8-6.3,2.4c-1.9,0.5-4.7,0.6-6.7,0.8c-3.9,0.4-16.6,0-16.6,0
                            C0.8,38.4,0,39.2,0,40c0,0.8,0.8,1.6,1.6,1.6c0,0,12.2,0,16.6,0c1.6,0,4.8,0.3,6.7,0.8c2.3,0.6,4.3,0.8,6.3,2.4
                            c1.6,1.2,3.2,2.8,4.3,4.4c1.2,2,2.1,3.9,2.4,6.3c0.2,1.7,0.7,4.7,0.8,6.7c0.2,4,0,16.2,0,16.2c0,0.8,0.8,1.6,1.6,1.6
                            s1.6-0.8,1.6-1.6c0,0,0-12.3,0-16.2c0-1.6,0.5-5.1,0.8-6.7c0.5-2.3,0.8-4.4,2.4-6.3c1.2-1.6,2.8-3.2,4.3-4.4c2-1.2,3.9-2,6.3-2.4
                            c1.8-0.3,5.1-0.7,7.1-0.8c3.5-0.2,15.8,0,15.8,0c0.8,0,1.6-0.8,1.6-1.6C80,39.2,79.2,38.4,78.4,38.4C78.4,38.4,78.4,38.4,78.4,38.4z"/>
                        </svg>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section - Socials List */}
        <div className="mxd-section padding-pre-title">
          <div className="mxd-container">

            {/* Block - Socials List */}
            <div className="mxd-block">
              <div className="mxd-links-lines">
                
                {/* Social Links */}
                {[
                  { name: 'Dribbble', url: 'https://dribbble.com/' },
                  { name: 'Behance', url: 'https://www.behance.net/' },
                  { name: 'Instagram', url: 'https://www.instagram.com/' },
                  { name: 'Github', url: 'https://github.com/' },
                  { name: 'Codepen', url: 'https://codepen.io/' },
                  { name: 'Figma community', url: 'https://www.figma.com/community' }
                ].map((social, index) => (
                  <div key={index} className="mxd-links-lines__item">
                    <div className="mxd-links-lines__divider anim-uni-in-up"></div>
                    <a className="mxd-links-lines__link anim-uni-in-up" href={social.url} target="_blank" rel="noopener noreferrer">
                      <h6 className="mxd-links-lines__title">{social.name}</h6>
                      <div className="mxd-links-lines__icon">
                        <i className="ph ph-arrow-up-right"></i>
                      </div>
                    </a>
                    <div className="mxd-links-lines__divider anim-uni-in-up"></div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>

        {/* Section - About Our Team */}
        <div className="mxd-section padding-default">
          <div className="mxd-container grid-container">
          
            {/* Block - About Our Team */}
            <div className="mxd-block">
              <div className="container-fluid px-0">
                <div className="row gx-0">
                  <div className="col-12 col-xl-5 mxd-grid-item no-margin">
                    <div className="mxd-block__name">
                      <h2 className="reveal-type anim-uni-in-up">Our Work</h2>
                    </div>
                  </div>
                  <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                    <div className="mxd-block__content">
                      <div className="mxd-block__paragraph">
                        <p className="t-large t-bright anim-uni-in-up">
                          We are a roaming team of designers and consultants, blending creativity, strategy, and technology to craft meaningful digital experiences. Whether we&apos;re working from a seaside café in Portugal or a mountain lodge in Japan, we bring fresh perspectives and global inspiration to every project.
                        </p>
                        <p className="anim-uni-in-up">
                          From brand identities and user-focused websites to consulting that streamlines your digital presence, we help ambitious businesses grow — no matter where they are.
                        </p>
                        <div className="mxd-paragraph__lists">
                          <div className="container-fluid p-0">
                            <div className="row g-0">
                              
                              {/* Contact Information */}
                              <div className="col-12 col-md-8 col-xl-10 mxd-paragraph__lists-item">
                                <div className="mxd-paragraph__lists-title">
                                  <p className="t-large t-bright t-caption anim-uni-in-up">Reach Us Anywhere</p>
                                </div>
                                <ul>
                                  <li className="anim-uni-in-up">
                                    <strong>Email:</strong> <a href="mailto:hello@graphiq.art?subject=Message%20from%20your%20site">hello@graphiq.art</a>
                                  </li>
                                  <li className="anim-uni-in-up">
                                    <strong>Phone:</strong> to come
                                  </li>
                                  <li className="anim-uni-in-up">
                                    <strong>Where we are today:</strong> Somewhere inspiring 🌍
                                  </li>
                                </ul>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section - CTA */}
        <div className="mxd-section overflow-hidden">
          <div className="mxd-container">

            {/* Block - CTA */}
            <div className="mxd-block">
              <div className="mxd-promo">
                <div className="mxd-promo__inner anim-zoom-out-container">
                  {/* caption */}
                  <div className="mxd-promo__content">
                    <p className="mxd-promo__title anim-uni-in-up">
                   
                      <span className="mxd-promo__caption reveal-type">Ready to get started? Book your consultation!</span>
                    </p>
                    <div className="mxd-promo__controls anim-uni-in-up">
                   
                    </div>
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