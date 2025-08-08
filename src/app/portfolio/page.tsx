import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicPortfolio from '@/components/DynamicPortfolio';

export const metadata = {
  title: 'Portfolio - Graphiq.art - Our Creative Projects',
  description: 'Explore our portfolio of creative projects, innovative designs, and digital solutions. Discover how we bring ideas to life through cutting-edge design and development.',
  keywords: 'portfolio, creative projects, design work, web development, digital solutions, case studies',
  openGraph: {
    title: 'Portfolio - Graphiq.art',
    description: 'Explore our portfolio of creative projects, innovative designs, and digital solutions.',
    url: '/portfolio',
    siteName: 'Graphiq.art',
    type: 'website',
  },
};

export default function Portfolio() {
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

        {/* Section - Projects Masonry & Headline #01 */}
        <div className="mxd-section mxd-section-inner-headline grid-headline padding-default">
          <div className="mxd-container grid-l-container">

            {/* Block - Projects Masonry #01 with Section Title */}
            <div className="mxd-block loading-wrap">
              <div className="mxd-projects-masonry loading__item">
                <div className="container-fluid p-0">
      
                  {/* Portfolio Gallery */}
                  <DynamicPortfolio />
                  {/* Portfolio Gallery End */}
      
                  {/* Portfolio Link */}
                  <div className="mxd-projects-masonry__btngroup anim-uni-in-up">
                  
                  </div>
                  {/* Portfolio Link End */}
                  
                </div>
              </div>
            </div>
            {/* Block - Projects Masonry #01 with Section Title End */}

          </div>
        </div>
        {/* Section - Projects Masonry & Headline #01 End */}



        {/* Section - Marquee Text One Line */}
        <div className="mxd-section padding-mtext">
          <div className="mxd-container fullwidth-container">

            {/* Block - Marquee Text One Line */}
            <div className="mxd-block">
              <div className="marquee marquee-right--gsap muted-extra">
                <div className="marquee__toright">
                  {/* single item */}
                  <div className="marquee__item one-line item-regular text">
                    <p className="marquee__text">Clients Approve</p>
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
                  {/* single item */}
                  <div className="marquee__item one-line item-regular text">
                    <p className="marquee__text">Clients Approve</p>
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
                  {/* single item */}
                  <div className="marquee__item one-line item-regular text">
                    <p className="marquee__text">Clients Approve</p>
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
                </div>
              </div>
            </div>
            {/* Block - Marquee Text One Line End */}

          </div>
        </div>
        {/* Section - Marquee Text One Line End */}

      
   
        {/* CTA Section */}
        <div className="mxd-section overflow-hidden">
          <div className="mxd-container">
            <div className="mxd-block">
              <div className="mxd-promo">
                <div className="mxd-promo__inner anim-zoom-out-container">
                  <div className="mxd-promo__content">
                    <p className="mxd-promo__title anim-uni-in-up">
                      {/* <span className="mxd-promo__icon">
                        <Image src="/emoji.png" alt="Icon" width={60} height={60} />
                      </span> */}
                      <span className="mxd-promo__caption reveal-type">Let&apos;s talk about your project!</span>
                    </p>
                    {/* <div className="mxd-promo__controls anim-uni-in-up">
                      <Link className="btn btn-anim btn-default btn-large btn-additional slide-right-up" href="/contact">
                        <span className="btn-caption">Contact Us</span>
                        <i className="ph-bold ph-arrow-up-right"></i>
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
      {/* Page Content End */}

      <Footer />

      {/* To Top Button */}
      <Link href="#0" id="to-top" className="btn btn-to-top slide-up anim-no-delay">
        <i className="ph ph-arrow-up"></i>
      </Link>
    </>
  );
} 