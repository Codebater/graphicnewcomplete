import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingClient from '@/components/PricingClient';

export const metadata = {
  title: 'Pricing - Graphiq.art - Creative Solutions Made Simple',
  description: 'Explore our pricing packages for creative digital solutions. From starter packages for small businesses to custom enterprise solutions, we have a package that fits your needs.',
  keywords: 'pricing, packages, web design pricing, digital agency pricing, creative solutions, starter package, professional package',
  openGraph: {
    title: 'Pricing - Graphiq.art',
    description: 'Explore our pricing packages for creative digital solutions. From starter packages to custom enterprise solutions.',
    url: '/pricing',
    siteName: 'Graphiq.art',
    type: 'website',
  },
};

export default function Pricing() {
  return (
    <>
      <PricingClient />
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
        <div className="mxd-section mxd-section-inner-headline padding-headline-pre-grid">
          <div className="mxd-container grid-container">
          
            {/* Block - Inner Page Headline */}
            <div className="mxd-block loading-wrap">
              <div className="container-fluid px-0">
                <div className="row gx-0">

                  {/* Inner Headline Name */}
                  <div className="col-12 col-xl-2 mxd-grid-item no-margin">
                    <div className="mxd-block__name name-inner-headline loading__item">
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
                        <span>Pricing</span>
                      </p>
                    </div>
                  </div>

                  {/* Inner Headline Content */}
                  <div className="col-12 col-xl-10 mxd-grid-item no-margin">
                    <div className="mxd-block__content">
                      <div className="mxd-block__inner-headline">
                        <h1 className="inner-headline__title headline-img-before headline-img-01 loading__item">
                          Creative solutions made simple
                        </h1>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section - Pricing Cards */}
        <div className="mxd-section padding-grid-pre-mtext">
          <div className="mxd-container grid-container">

            {/* Block - Pricing Cards */}
            <div className="mxd-block">
              <div className="mxd-pricing-table loading__fade">
                <div className="container-fluid p-0">
                  <div className="row g-0">
                    
                    {/* Starter Package */}
                    <div className="col-12 col-xl-4 mxd-pricing-table__item mxd-grid-item animate-card-3">
                      <div className="mxd-pricing-table__inner">
                        <div className="mxd-pricing-table__data">
                          <div className="pricing-data__header">
                            <h4 className="pricing-header__title anim-uni-in-up">Starter Package</h4>
                            <p className="pricing-header__descr anim-uni-in-up">Perfect for small businesses and startups</p>
                          </div>
                          <div className="pricing-data__info">
                            <div className="pricing-data__price">
                              <div className="pricing-data__num anim-uni-in-up">
                                <span className="pricing-data__currency">$</span>
                                <span className="pricing-data__amount">5K</span>
                                <span className="pricing-data__period">/month</span>
                              </div>
                            </div>
                            <div className="pricing-data__btnholder anim-uni-in-up">
                              <Link className="btn btn-anim btn-default btn-opposite btn-fullwidth slide-right-up" href="/contact">
                                <span className="btn-caption">GET STARTED</span>
                                <i className="ph-bold ph-arrow-up-right"></i>
                              </Link>
                            </div>
                            <div className="pricing-data__divider anim-uni-in-up"></div>
                          </div>
                        </div>
                        <div className="mxd-pricing-table__plan">
                          <div className="pricing-plan__list">
                            <ul className="mxd-check-list">
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Ongoing creative direction</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Monthly mood boards & creative briefs</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>High-end design support</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Website design updates / UI/UX refinement</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Content & campaign ideation</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Tagline and slogan development</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Brand guidelines maintenance</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Priority consulting access</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Weekly strategy calls / creative reviews</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Direct Slack/WhatsApp channel</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Performance & impact tracking</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Monthly analytics report</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Exclusive access to creative network</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Package */}
                    <div className="col-12 col-xl-4 mxd-pricing-table__item mxd-grid-item animate-card-3">
                      <div className="mxd-pricing-table__inner best-choice">
                        <div className="mxd-pricing-table__tag">
                          <span className="tag tag-default tag-additional">MOST POPULAR</span>
                        </div>
                        <div className="mxd-pricing-table__data">
                          <div className="pricing-data__header">
                            <h4 className="pricing-header__title anim-uni-in-up">Professional Package</h4>
                            <p className="pricing-header__descr anim-uni-in-up">Complete solution for growing businesses</p>
                          </div>
                          <div className="pricing-data__info">
                            <div className="pricing-data__price">
                              <div className="pricing-data__num anim-uni-in-up">
                                <span className="pricing-data__currency">$</span>
                                <span className="pricing-data__amount">10K</span>
                              </div>
                            </div>
                            <div className="pricing-data__btnholder anim-uni-in-up">
                              <Link className="btn btn-anim btn-default btn-opposite btn-fullwidth slide-right-up" href="/contact">
                                <span className="btn-caption">GET STARTED</span>
                                <i className="ph-bold ph-arrow-up-right"></i>
                              </Link>
                            </div>
                            <div className="pricing-data__divider anim-uni-in-up"></div>
                          </div>
                        </div>
                        <div className="mxd-pricing-table__plan">
                          <div className="pricing-plan__list">
                            <ul className="mxd-check-list">
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Custom Website Design</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Advanced Responsive Design</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Complete Brand Identity</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Advanced UI/UX Design System</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Interactive Prototyping</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Advanced SEO Optimization</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Performance Optimization</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Advanced CMS Features</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>3 Rounds of Revisions</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Priority Support</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Custom Quote */}
                    <div className="col-12 col-xl-4 mxd-pricing-table__item mxd-grid-item animate-card-3">
                      <div className="mxd-pricing-table__inner">
                        <div className="mxd-pricing-table__data">
                          <div className="pricing-data__header">
                            <h4 className="pricing-header__title anim-uni-in-up">Custom Quote</h4>
                            <p className="pricing-header__descr anim-uni-in-up">Let&apos;s Talk</p>
                          </div>
                          <div className="pricing-data__info">
                            <div className="pricing-data__btnholder anim-uni-in-up">
                              <Link className="btn btn-anim btn-default btn-opposite btn-fullwidth slide-right-up" href="/contact">
                                <span className="btn-caption">CONTACT US</span>
                                <i className="ph-bold ph-arrow-up-right"></i>
                              </Link>
                            </div>
                            <div className="pricing-data__divider anim-uni-in-up"></div>
                          </div>
                        </div>
                        <div className="mxd-pricing-table__plan">
                          <div className="pricing-plan__list">
                            <ul className="mxd-check-list">
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Enterprise Solutions</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Complex Web Applications</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>E-commerce Platforms</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Multi-language Sites</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Advanced Integrations</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Custom Development</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Ongoing Maintenance</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Dedicated Support</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Scalable Architecture</span>
                              </li>
                              <li className="anim-uni-in-up">
                                <i className="ph ph-check"></i>
                                <span>Premium Features</span>
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

        {/* Section - Marquee Text One Line */}
        <div className="mxd-section padding-mtext-pre-grid mobile-grid-s">
          <div className="mxd-container fullwidth-container">

            {/* Block - Marquee Text One Line */}
            <div className="mxd-block">
              <div className="marquee marquee-right--gsap muted-extra">
                <div className="marquee__toright">
                  
                  {/* Marquee Items */}
                  {Array(5).fill('Our Partners').map((text, index) => (
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

        {/* Section - Marquee Partners Two Lines */}
        <div className="mxd-section padding-pre-title">
          <div className="mxd-container fullwidth-container">

            {/* Block - Marquee Partners Two Lines */}
            <div className="mxd-block">
              <div className="marquee marquee--gsap">
                
                {/* Top Line */}
                <div className="marquee__top">
                  {[
                    { src: '/img/brands/envato.svg', alt: 'Envato' },
                    { src: '/img/brands/angular.svg', alt: 'Angular' },
                    { src: '/img/brands/deepseek.svg', alt: 'DeepSeek' },
                    { src: '/img/brands/dribbble.svg', alt: 'Dribbble' },
                    { src: '/img/brands/udemy.svg', alt: 'Udemy' },
                    { src: '/img/brands/behance.svg', alt: 'Behance' }
                  ].map((brand, index) => (
                    <a key={index} className="marquee__item item-partners" href="#0">
                      <Image src={brand.src} alt={brand.alt} width={120} height={60} />
                    </a>
                  ))}
                </div>

                {/* Bottom Line */}
                <div className="marquee__bottom">
                  {[
                    { src: '/img/brands/codeninja.svg', alt: 'CodeNinja' },
                    { src: '/img/brands/crewai.svg', alt: 'CrewAI' },
                    { src: '/img/brands/smartlook.svg', alt: 'Smartlook' },
                    { src: '/img/brands/ghostgaming.svg', alt: 'Ghost Gaming' },
                    { src: '/img/brands/logitech.svg', alt: 'Logitech' },
                    { src: '/img/brands/mozilla.svg', alt: 'Mozilla' }
                  ].map((brand, index) => (
                    <a key={index} className="marquee__item item-partners" href="#0">
                      <Image src={brand.src} alt={brand.alt} width={120} height={60} />
                    </a>
                  ))}
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
                      
                      <span className="mxd-promo__caption reveal-type">Lets talk about your project!</span>
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
      <Link href="#0" id="to-top" className="btn btn-round btn-to-top slide-up anim-no-delay">
        <i className="ph ph-arrow-up"></i>
      </Link>
    </>
  );
}