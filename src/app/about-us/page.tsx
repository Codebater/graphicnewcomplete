import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutUsClient from '@/components/AboutUsClient';

export const metadata = {
  title: 'About Us - Graphiq.art - Digital Agency & Creative Studio',
  description: 'Learn about Graphiq.art - a creative digital agency specializing in innovative design and cutting-edge development. Meet our team of creative leaders and discover our values.',
  keywords: 'about us, creative agency, digital design, web development, team, values, innovation',
  openGraph: {
    title: 'About Us - Graphiq.art',
    description: 'Learn about Graphiq.art - a creative digital agency specializing in innovative design and cutting-edge development.',
    url: '/about-us',
    siteName: 'Graphiq.art',
    type: 'website',
  },
};

export default function AboutUs() {
  return (
    <>
      <AboutUsClient />
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
        <div className="mxd-section mxd-section-inner-headline padding-headline-pre-block">
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
                        <span>Studio</span>
                      </p>
                    </div>
                  </div>

                  {/* Inner Headline Content */}
                  <div className="col-12 col-xl-10 mxd-grid-item no-margin">
                    <div className="mxd-block__content">
                      <div className="mxd-block__inner-headline">
                        <h1 className="inner-headline__title headline-img-before headline-img-06 loading__item">
                          Driven by ideas and innovation
                        </h1>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section - Team Leaders */}
        <div className="mxd-section padding-pre-grid">
          <div className="mxd-container grid-container">

            {/* Block - Team Leaders */}
            <div className="mxd-block">
              <div className="mxd-team-cards">
                <div className="container-fluid p-0">
                  <div className="row g-0 flex-column-reverse flex-xl-row">
      
                    {/* Team Cards */}
                    <div className="col-12 col-xl-8">
                      <div className="container-fluid p-0">
                        <div className="row g-0">
                          
                          {/* Roberto Card */}
                          <div className="col-12 col-md-6 mxd-team-cards__item mxd-grid-item no-margin-desktop animate-card-3">
                            <div className="mxd-team-cards__media anim-uni-in-up">
                              <div className="mxd-team-cards__photo">
                                <Image 
                                  src="/porthomeimages/robert.jpg" 
                                  alt="Roberto Aka Mike - Founder, SEO"
                                  width={400}
                                  height={500}
                                  className="object-cover"
                                />
                              </div>
                              <div className="mxd-team-cards__socials">
                                <a className="btn btn-anim tag tag-default tag-permanent" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                                  <span className="btn-caption">Linkedin</span>
                                </a>
                                <a className="btn btn-anim tag tag-default tag-permanent" href="https://www.behance.net/" target="_blank" rel="noopener noreferrer">
                                  <span className="btn-caption">Behance</span>
                                </a>
                              </div>
                            </div>
                            <div className="mxd-team-cards__info">
                              <p className="mxd-team-cards__name t-large t-bright t-caption">Roberto Aka Mike</p>
                              <p className="mxd-team-cards__position t-small t-medium t-140">Founder, SEO</p>
                            </div>
                          </div>

                          {/* Asad Card */}
                          <div className="col-12 col-md-6 mxd-team-cards__item mxd-grid-item no-margin-desktop animate-card-3">
                            <div className="mxd-team-cards__media anim-uni-in-up">
                              <div className="mxd-team-cards__photo">
                                <Image 
                                  src="/porthomeimages/asadllah.jpg" 
                                  alt="Asad Aka Pharoah - Developer"
                                  width={400}
                                  height={500}
                                  className="object-cover"
                                />
                              </div>
                              <div className="mxd-team-cards__socials">
                                <a className="btn btn-anim tag tag-default tag-permanent" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                                  <span className="btn-caption">Linkedin</span>
                                </a>
                                <a className="btn btn-anim tag tag-default tag-permanent" href="https://www.figma.com/community" target="_blank" rel="noopener noreferrer">
                                  <span className="btn-caption">Figma Community</span>
                                </a>
                              </div>
                            </div>
                            <div className="mxd-team-cards__info">
                              <p className="mxd-team-cards__name t-large t-bright t-caption">Asad Aka Pharoah</p>
                              <p className="mxd-team-cards__position t-small t-medium t-140">Developer</p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Section Title */}
                    <div className="col-12 col-xl-4 mxd-team-cards__item mxd-grid-item no-margin animate-card-3">
                      <div className="mxd-team-cards__h2-block right-block">
                        <div className="mxd-section-title pre-grid">
                          <div className="container-fluid p-0">
                            <div className="row g-0">
                              <div className="col-12">
                                <div className="mxd-section-title__title">
                                  <h2 className="reveal-type">Creative leaders</h2>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mxd-section-title__descr">
                                  <p className="anim-uni-in-up">
                                    graphiq.art began as a passion project between two friends, a couple of random gigs, and one simple belief—that work should never feel like a chore. What started as &apos;just some ticks&apos; on a to-do list quickly grew into a dedicated crew of creators who put their heart, style, and soul into everything they do.
                                  </p>
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
        </div>

        {/* Section - Culture & Values */}
        <div className="mxd-section padding-grid-pre-mtext">
          <div className="mxd-container grid-container">
            
            {/* Block - Culture & Values */}
            <div className="mxd-block">
              <div className="mxd-values loading__fade">
                <div className="container-fluid p-0">
                  <div className="row g-0 d-flex">
                    
                    <div className="col-12 col-xl-2 mxd-values__item order-2 order-xl-1 mxd-grid-item no-margin animate-card-2">
                      <div className="mxd-values__lists fullheight-xl">
                        <div className="container-fluid p-0 fullheight-xl">
                          <div className="row g-0 fullheight-xl d-xl-flex flex-xl-column justify-content-xl-between">
                            
                            <div className="col-12 col-sm-6 col-xl-12 mxd-values__lists-item">
                              <ul>
                                <li><p className="t-small anim-uni-in-up">Innovations</p></li>
                                <li><p className="t-small anim-uni-in-up">Excellence</p></li>
                                <li><p className="t-small anim-uni-in-up">Creativity</p></li>
                                <li><p className="t-small anim-uni-in-up">Experience</p></li>
                                <li><p className="t-small anim-uni-in-up">Competence</p></li>
                                <li><p className="t-small anim-uni-in-up">Passion</p></li>
                              </ul>
                            </div>
                            
                            <div className="col-12 col-sm-6 col-xl-12 mxd-values__lists-item">
                              <ul>
                                <li><p className="t-small anim-uni-in-up">Web design</p></li>
                                <li><p className="t-small anim-uni-in-up">UI/UX</p></li>
                                <li><p className="t-small anim-uni-in-up">App design</p></li>
                                <li><p className="t-small anim-uni-in-up">Development</p></li>
                                <li><p className="t-small anim-uni-in-up">Branding</p></li>
                                <li><p className="t-small anim-uni-in-up">Motion</p></li>
                              </ul>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-xl-4 mxd-values__item order-1 order-xl-2 mxd-grid-item no-margin animate-card-2">
                      <div className="mxd-values__image image-large-desktop image-values-1 parallax-img-small"></div>
                    </div>

                    <div className="col-12 col-xl-6 mxd-values__item order-3 order-xl-3 mobile-reverse mxd-grid-item no-margin animate-card-2">
                      <div className="mxd-values__image image-small-desktop image-values-2 parallax-img-small"></div>
                      <div className="mxd-values__descr has-top-list anim-uni-in-up">
                        <p className="t-bright t-large reveal-type">
                          We are a creative digital agency specializing in innovative design and cutting-edge development. We help businesses stand out and thrive in the modern landscape.
                        </p>
                      </div>
                    </div>

                  </div>
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
                  {['Design', 'Development', 'Branding', 'eCommerce', 'Mobile Apps'].map((item, index) => (
                    <div key={index} className="marquee__item one-line item-regular text">
                      <p className="marquee__text">{item}</p>
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

        {/* Section - Awards & Publications List */}
        <div className="mxd-section overflow-hidden padding-pre-grid mobile-grid-s">
          <div className="mxd-container grid-container">

            {/* Block - Section Title */}
            <div className="mxd-block">
              <div className="mxd-section-title">
                <div className="container-fluid p-0">
                  <div className="row g-0">
                    <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                      <div className="mxd-section-title__hrtitle">
                        <h2 className="reveal-type">Awards &<br/>publications</h2>
                      </div>
                    </div>
                    <div className="col-12 col-xl-3 mxd-grid-item no-margin"></div>
                    <div className="col-12 col-xl-3 mxd-grid-item no-margin">
                      <div className="mxd-section-title__hrcontrols pre-title anim-uni-in-up">
                        <Link className="btn btn-anim btn-default btn-outline slide-right-up" href="/blog">
                          <span className="btn-caption">View More</span>
                          <i className="ph-bold ph-arrow-up-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Block - Awards List */}
            <div className="mxd-block">
              <div className="mxd-awards-list hover-reveal">
                
                {/* Award Items */}
                {[
                  {
                    title: "Some article on Medium",
                    link: "https://medium.com/",
                    tags: ["UI/UX design", "Development"],
                    year: "2025"
                  },
                  {
                    title: "Awwwards nomination",
                    link: "https://www.awwwards.com/",
                    tags: ["UI/UX", "Frontend"],
                    year: "2024"
                  },
                  {
                    title: "Behance curated work",
                    link: "https://www.behance.net/",
                    tags: ["Illustrations", "Graphic design"],
                    year: "2024"
                  },
                  {
                    title: "Article on Medium",
                    link: "https://medium.com/",
                    tags: ["UI/UX", "Frontend"],
                    year: "2024"
                  }
                ].map((award, index) => (
                  <a key={index} className="mxd-awards-list__item hover-reveal__item" href={award.link} target="_blank" rel="noopener noreferrer">
                    <div className="mxd-awards-list__border anim-uni-in-up"></div>
                    <div className="hover-reveal__content overflow-visible hover-reveal-260x260">
                      <Image 
                        className="hover-reveal__image" 
                        src="/porthomeimages/taker.png" 
                        alt="Project Preview"
                        width={260}
                        height={260}
                      />
                    </div>
                    <div className="mxd-awards-list__inner">
                      <div className="container-fluid px-0">
                        <div className="row gx-0">
                          <div className="col-12 col-xl-8 mxd-grid-item no-margin">
                            <div className="mxd-awards-list__title anim-uni-in-up">
                              <div className="mxd-awards-list__icon">
                                <i className="ph ph-arrow-right"></i>
                              </div>
                              <p>{award.title}</p>
                            </div>
                          </div>
                          <div className="col-6 col-md-6 col-xl-2 mxd-grid-item no-margin">
                            <div className="mxd-awards-list__tagslist">
                              <ul>
                                {award.tags.map((tag, tagIndex) => (
                                  <li key={tagIndex} className="anim-uni-in-up">
                                    <p className="t-small">{tag}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="col-6 col-md-6 col-xl-2 mxd-grid-item no-margin">
                            <div className="mxd-awards-list__date anim-uni-in-up">
                              <p className="t-small">{award.year}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mxd-awards-list__border anim-uni-in-up"></div>
                  </a>
                ))}

              </div>
            </div>

          </div>
        </div>

        {/* Section - Marquee Images Two Lines */}
        <div className="mxd-section padding-default mobile-title">
          <div className="mxd-container fullwidth-container">

            {/* Block - Marquee Images Two Lines */}
            <div className="mxd-block">
              <div className="marquee marquee--gsap">
                
                {/* Top Line */}
                <div className="marquee__top">
                  <div className="marquee__item image">
                    <Link className="marquee__link" href="/portfolio">
                      <Image src="/porthomeimages/digitalproduct1.webp" alt="Portfolio Image" width={400} height={300} />
                    </Link>
                  </div>
                  <div className="marquee__item has-caption padding-4">
                    <p>Inspiring<br/>ideas</p>
                  </div>
                  <div className="marquee__item">
                    <Link className="marquee__link" href="/portfolio">
                      <Image src="/porthomeimages/digitalproduct2.webp" alt="Portfolio Image" width={400} height={300} />
                    </Link>
                  </div>
                  <div className="marquee__item">
                    <Link className="marquee__link" href="/portfolio">
                      <Image src="/porthomeimages/digitalproduct3.webp" alt="Portfolio Image" width={400} height={300} />
                    </Link>
                  </div>
                  <div className="marquee__item has-caption padding-4">
                    <p>Creative<br/>minds</p>
                  </div>
                  <div className="marquee__item">
                    <Link className="marquee__link" href="/portfolio">
                      <Image src="/porthomeimages/digitalproduct4.webp" alt="Portfolio Image" width={400} height={300} />
                    </Link>
                  </div>
                </div>

                {/* Bottom Line */}
                <div className="marquee__bottom">
                  <div className="marquee__item has-caption padding-4">
                    <p>Inspiring<br/>ideas</p>
                  </div>
                  <div className="marquee__item">
                    <Link className="marquee__link" href="/portfolio">
                      <Image src="/porthomeimages/slider4app.png" alt="Portfolio Image" width={400} height={300} />
                    </Link>
                  </div>
                  <div className="marquee__item">
                    <Link className="marquee__link" href="/portfolio">
                      <Image src="/porthomeimages/slider3app.png" alt="Portfolio Image" width={400} height={300} />
                    </Link>
                  </div>
                  <div className="marquee__item has-caption padding-4">
                    <p>Creative<br/>minds</p>
                  </div>
                  <div className="marquee__item">
                    <Link className="marquee__link" href="/portfolio">
                      <Image src="/porthomeimages/slider2app.png" alt="Portfolio Image" width={400} height={300} />
                    </Link>
                  </div>
                  <div className="marquee__item">
                    <Link className="marquee__link" href="/portfolio">
                      <Image src="/porthomeimages/slider1.png" alt="Portfolio Image" width={400} height={300} />
                    </Link>
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