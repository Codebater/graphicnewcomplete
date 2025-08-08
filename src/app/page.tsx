import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Statistics from '@/components/Statistics';

export default function Home() {
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

      {/* Header */}
      <Header />

      {/* Page Content */}
      <main id="mxd-page-content" className="mxd-page-content">
        {/* Hero Section */}
        <div className="mxd-section">
          <div className="mxd-hero-02 mxd-pinned-fullscreen">
            <div className="mxd-pinned-fullscreen__static hero-02-fade-out-scroll loading-wrap">
              <div className="hero-02-static__tl-trigger"></div>
              {/* static top */}
              <div className="mxd-hero-02-static__top hero-02-static-anim-el">
                <div className="mxd-container fullwidth-container grid-container">
                  <div className="container-fluid p-0">
                    <div className="row g-0">
                      <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                        <div className="hero-02-static__caption loading__item">
                          <p className="t-large t-medium t-120 t-bright">Powering next gen projects.</p>
                          <p className="t-large t-medium t-120 t-muted">No creative limits.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mxd-hero-02-static__center">
                <div className="mxd-hero-02-marquee">
                  <div className="mxd-hero-02-marquee__image loading__item">
                    <Image className="mxd-move" src="/porthomeimages/smiley.png" alt="Hero Image" width={400} height={400} />
                  </div>
                  <div className="mxd-hero-02-marquee__line loading__item">
                    <div className="marquee marquee-left--gsap">
                      <div className="marquee__toleft">
                        {/* Marquee Items */}
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="marquee__item one-line item-regular text">
                            <p className="marquee__text">Graphiq.art — Visual. Digital. Remarkable</p>
                            <div className="marquee__image">
                              <svg className="mxd-pulse" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
                                <path fill="currentColor" d="M78.4,38.4c0,0-11.8,0-15.8,0c-1.6,0-4.8-0.2-7.1-0.8c-2.3-0.6-4.3-0.8-6.3-2.4c-2-1.2-3.5-3.2-4.7-4.8
                                  c-1.2-1.6-1.6-3.6-2-5.5c-0.3-1.5-0.7-4.3-0.8-5.9c-0.2-4.3,0-17.4,0-17.4C41.8,0.8,41,0,40.2,0s-1.6,0.8-1.6,1.6c0,0,0,13.1,0,17.4
                                  c0,1.6-0.6,4.3-0.8,5.9c-0.3,2-0.8,4-2,5.5c-1.2,2-2.8,3.6-4.7,4.8s-4,1.8-6.3,2.4c-1.9,0.5-4.7,0.6-6.7,0.8c-3.9,0.4-16.6,0-16.6,0
                                  C0.8,38.4,0,39.2,0,40c0,0.8,0.8,1.6,1.6,1.6c0,0,12.2,0,16.6,0c1.6,0,4.8,0.3,6.7,0.8c2.3,0.6,4.3,0.8,6.3,2.4
                                  c1.6,1.2,3.2,2.8,4.3,4.4c1.2,2,2.1,3.9,2.4,6.3c0.2,1.7,0.7,4.7,0.8,6.7c0.2,4,0,16.2,0,16.2c0,0.8,0.8,1.6,1.6,1.6
                                  s1.6-0.8,1.6-1.6c0,0,0-12.3,0-16.2c0-1.6,0.5-5.1,0.8-6.7c0.5-2.3,0.8-4.4,2.4-6.3c1.2-1.6,2.8-3.2,4.3-4.4c2-1.2,3.9-2,6.3-2.4
                                  c1.8-0.3,5.1-0.7,7.1-0.8c3.5-0.2,15.8,0,15.8,0c0.8,0,1.6-0.8,1.6-1.6C80,39.2,79.2,38.4,78.4,38.4C78.4,38.4,78.4,38.4,78.4,38.4z
                                  "/>
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mxd-hero-02-static__bottom hero-02-static-anim-el">
                <div className="mxd-container fullwidth-container grid-container">
                  <div className="container-fluid p-0">
                    <div className="row g-0">
                      <div className="col-12 col-md-6 col-xl-4 mxd-grid-item no-margin">
                        <div className="mxd-paragraph__lists loading__fade">
                          <div className="container-fluid p-0">
                            <div className="row g-0">
                              <div className="col-6 col-xl-5">
                                <ul>
                                  <li><p className="t-small anim-uni-in-up">Innovations</p></li>
                                  <li><p className="t-small anim-uni-in-up">Creativity</p></li>
                                  <li><p className="t-small anim-uni-in-up">Experience</p></li>
                                  <li><p className="t-small anim-uni-in-up">Competence</p></li>
                                  <li><p className="t-small anim-uni-in-up">Passion</p></li>
                                </ul>
                              </div>
                              <div className="col-6 col-xl-5">
                                <ul>
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
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mxd-hero-02-static__btn hero-02-static-anim-el loading__fade">
                <button className="btn-rotating btn-rotating-160">
                  <svg version="1.1" id="scrollDown" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 
                    viewBox="0 0 160 160" xmlSpace="preserve" 
                    className="btn-rotating__text mxd-rotate" data-value="360">
                    <defs>
                      <path id="textPath" d="M149.7,80c0,38.5-31.2,69.7-69.7,69.7S10.3,118.5,10.3,80S41.5,10.3,80,10.3S149.7,41.5,149.7,80z"/>
                    </defs>
                    <g>
                      <use xlinkHref="#textPath" fill="none"></use>
                      <text>
                        <textPath xlinkHref="#textPath">Scroll for More * Scroll for More * Scroll for More * </textPath>
                      </text>
                    </g>
                  </svg>
                  <svg className="btn-rotating__image" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="60px" height="60px" viewBox="0 0 60 60" xmlSpace="preserve">
                    <style type="text/css">
                      {`.icon-star-scroll { fill: var(--accent); }`}
                    </style>
                    <path className="icon-star-scroll" d="M58.9,28.9c0,0-9.1,0.1-12.1,0c-1.3,0-5.3-0.5-5.3-0.5c-1.7-0.2-3.4-0.7-4.8-1.7c-1.4-1-2.7-2.3-3.6-3.7
                      c-0.8-1.3-1.3-2.7-1.5-4.2c0,0-0.4-3.3-0.5-4.4c-0.2-3.3,0-13.1,0-13.1c0-0.6-0.5-1.1-1.1-1.1s-1.1,0.5-1.1,1.1
                      c0,0,0.2,9.8,0,13.1c0,1.1-0.5,4.4-0.5,4.4c-0.2,1.5-0.6,3-1.5,4.2c-0.9,1.5-2.2,2.7-3.6,3.7s-3,1.5-4.7,1.7c0,0-3.7,0.4-5,0.5
                      c-3.1,0.2-12.5,0-12.5,0C0.5,28.9,0,29.4,0,30s0.5,1.1,1.1,1.1c0,0,9.4-0.2,12.5,0c1.2,0,5,0.5,5,0.5c1.7,0.2,3.3,0.7,4.7,1.7
                      c1.3,0.9,2.4,2,3.3,3.3c1,1.4,1.5,3.1,1.7,4.8c0,0,0.4,3.9,0.5,5.2c0.1,3,0,12.2,0,12.2c0,0.6,0.5,1.1,1.1,1.1s1.1-0.5,1.1-1.1
                      c0,0-0.1-9.2,0-12.2c0-1.3,0.5-5.2,0.5-5.2c0.2-1.7,0.7-3.4,1.7-4.8c0.9-1.3,2-2.4,3.3-3.3c1.4-1,3.1-1.5,4.8-1.7
                      c0,0,3.9-0.4,5.3-0.5c3-0.1,12.1,0,12.1,0c0.6,0,1.1-0.5,1.1-1.1s-0.5-1.1-1.1-1.1l0,0L58.9,28.9z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mxd-pinned-fullscreen__scroll">
              <div className="mxd-hero-02-scroll__wrap">
                <div className="mxd-hero-02-scroll__images">
                  <div className="mxd-hero-02-images__row mxd-hero-02-images__row-01">
                    <Link className="mxd-hero-02-image__portrait portrait-01" href="/project-details/68953ea8b90958ab219c3ac5">
                      <div className="mxd-hero-02-image__inner type-01 anim-uni-in-up">
                        <Image src="/porthomeimages/port3.png" alt="Hero Image" width={300} height={400} />
                        <div className="mxd-preview-hover">
                          <i className="mxd-preview-hover__icon icon-small">
                            <Image src="/img/icons/icon-eye.svg" alt="Eye Icon" width={20} height={20} />
                          </i>
                        </div>
                      </div>
                    </Link>
                    <Link className="mxd-hero-02-image__landscape landscape-01" href="/project-details/68953ea8b90958ab219c3ac5">
                      <div className="mxd-hero-02-image__inner type-03 anim-uni-in-up">
                        <Image src="/porthomeimages/port1.png" alt="Hero Image" width={400} height={300} />
                        <div className="mxd-preview-hover">
                          <i className="mxd-preview-hover__icon icon-small">
                            <Image src="/img/icons/icon-eye.svg" alt="Eye Icon" width={20} height={20} />
                          </i>
                        </div>
                      </div>
                    </Link>
                    <Link className="mxd-hero-02-image__portrait portrait-02" href="/project-details/68953ea8b90958ab219c3ac5">
                      <div className="mxd-hero-02-image__inner type-01 anim-uni-in-up">
                        <Image src="/porthomeimages/port4.png" alt="Hero Image" width={300} height={400} />
                        <div className="mxd-preview-hover">
                          <i className="mxd-preview-hover__icon icon-small">
                            <Image src="/img/icons/icon-eye.svg" alt="Eye Icon" width={20} height={20} />
                          </i>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="mxd-hero-02-images__row mxd-hero-02-images__row-02">
                    <Link className="mxd-hero-02-image__landscape landscape-02" href="/project-details/689542c5b90958ab219c3b89">
                      <div className="mxd-hero-02-image__inner type-03 anim-uni-in-up">
                        <Image src="/uploads/1754612421476-i59vwkge9s.png" alt="Hero Image" width={400} height={300} />
                        <div className="mxd-preview-hover">
                          <i className="mxd-preview-hover__icon icon-small">
                            <Image src="/img/icons/icon-eye.svg" alt="Eye Icon" width={20} height={20} />
                          </i>
                        </div>
                      </div>
                    </Link>
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="mxd-pinned-fullscreen__tl-trigger"></div>
          </div>
        </div>

        {/* Services/Features Stacking Cards Section */}
        <div className="mxd-section padding-stacked-section">
          <div className="mxd-container grid-container">
            <div className="mxd-block mxd-grid-item no-margin">
              <div className="content__block">
                <div className="stack-wrapper mxd-hero-02-stack">
                  <div className="stack-offset"></div>
                  <div className="services-stack">
                    {/* Digital products */}
                    <div className="stack-item">
                      <div className="mxd-services-stack__inner showcase-inner bg-base-opp">
                        <div className="mxd-services-stack__container">
                          <div className="mxd-services-stack__title showcase-title">
                            <h3 className="opposite">Digital products</h3>
                            <span className="mxd-services-stack__number t-opp-muted">/01</span>
                          </div>
                          <div className="mxd-services-stack__info showcase-info">
                            <p className="t-opposite">We create visually compelling designs that enhance user experience. 
                              We make sure your brand&apos;s visuals resonate with your audience.</p>
                          </div>
                          <div className="mxd-services-stack__works">
                            <Link className="mxd-services-stack__work" href="/project-details">
                              <Image className="mxd-services" src="/porthomeimages/digitalproduct4.webp" alt="Work Preview" width={1200} height={960} priority quality={95} />
                              <div className="mxd-services-stack__tags tags-absolute">
                               
                              </div>
                              
                            </Link>
                            <Link className="mxd-services-stack__work" href="/project-details">
                              <Image className="mxd-services" src="/porthomeimages/digitalproduct3.webp" alt="Work Preview" width={1200} height={960} quality={95} />
                              <div className="mxd-services-stack__tags tags-absolute">
                             
                              </div>
                             
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Corporate websites */}
                    <div className="stack-item">
                      <div className="mxd-services-stack__inner showcase-inner bg-accent">
                        <div className="mxd-services-stack__title showcase-title">
                          <h3 className="opposite">Corporate websites</h3>
                          <span className="mxd-services-stack__number t-opp-brigth">/02</span>
                        </div>
                        <div className="mxd-services-stack__info showcase-info">
                          <p className="t-opposite">We create visually compelling designs that enhance user experience. 
                            We make sure your brand&apos;s visuals resonate with your audience.</p>
                        </div>
                        <div className="mxd-services-stack__works">
                          <Link className="mxd-services-stack__work" href="/project-details">
                            <Image className="mxd-services" src="/porthomeimages/corpweb1.webp" alt="Work Preview" width={1200} height={960} quality={95} />
                            <div className="mxd-services-stack__tags tags-absolute">
                              
                            </div>
                        
                          </Link>
                          <Link className="mxd-services-stack__work" href="/project-details">
                            <Image className="mxd-services" src="/porthomeimages/corpweb2.webp" alt="Work Preview" width={1200} height={960} quality={95} />
                            <div className="mxd-services-stack__tags tags-absolute">
                             
                            </div>
                       
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* eCommerce */}
                    <div className="stack-item">
                      <div className="mxd-services-stack__inner radius-dark showcase-inner bg-base-tint">
                        <div className="mxd-services-stack__title showcase-title">
                          <h3>eCommerce</h3>
                          <span className="mxd-services-stack__number t-muted-extra">/03</span>
                        </div>
                        <div className="mxd-services-stack__info showcase-info">
                          <p>We create visually compelling designs that enhance user experience. We make sure 
                            your brand&apos;s visuals resonate with your audience.</p>
                        </div>
                        <div className="mxd-services-stack__works">
                          <Link className="mxd-services-stack__work" href="/project-details">
                            <Image className="mxd-services" src="/porthomeimages/ecom1.png" alt="Work Preview" width={1200} height={960} quality={95} />
                            <div className="mxd-services-stack__tags tags-absolute">
                             
                            </div>
                          
                          </Link>
                          <Link className="mxd-services-stack__work" href="/project-details">
                            <Image className="mxd-services" src="/porthomeimages/ecom2.png" alt="Work Preview" width={1200} height={960} quality={95} />
                            <div className="mxd-services-stack__tags tags-absolute">
                             
                            </div>
                           
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Brand identity */}
                    <div className="stack-item">
                      <div className="mxd-services-stack__inner showcase-inner bg-base-opp">
                        <div className="mxd-services-stack__title showcase-title">
                          <h3 className="opposite">Brand identity</h3>
                          <span className="mxd-services-stack__number t-opp-muted">/04</span>
                        </div>
                        <div className="mxd-services-stack__info showcase-info">
                          <p className="t-opposite">We create visually compelling designs that enhance user experience. 
                            We make sure your brand&apos;s visuals resonate with your audience.</p>
                        </div>
                        <div className="mxd-services-stack__works">
                          <Link className="mxd-services-stack__work" href="/project-details">
                            <Image className="mxd-services" src="/porthomeimages/brand1.png" alt="Work Preview" width={1200} height={960} quality={95} />
                            <div className="mxd-services-stack__tags tags-absolute">
                        
                            </div>
                     
                          </Link>
                          <Link className="mxd-services-stack__work" href="/project-details">
                            <Image className="mxd-services" src="/porthomeimages/brand2.png" alt="Work Preview" width={1200} height={960} quality={95} />
                            <div className="mxd-services-stack__tags tags-absolute">
                  
                            </div>
                  
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Capabilities Section */}
        <div className="mxd-section overflow-hidden padding-grid-pre-mtext">
          <div className="mxd-container grid-container">
            {/* Section Title */}
            <div className="mxd-block">
              <div className="mxd-section-title">
                <div className="container-fluid p-0">
                  <div className="row g-0">
                    <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                      <div className="mxd-section-title__hrtitle">
                        <h2 className="reveal-type">Our capabilities</h2>
                      </div>
                    </div>
                    <div className="col-12 col-xl-3 mxd-grid-item no-margin">
                      <div className="mxd-section-title__hrdescr">
                        <p className="anim-uni-in-up">Design</p>
                        <p className="anim-uni-in-up">Development</p>
                        <p className="anim-uni-in-up">Mastership</p>
                      </div>
                    </div>
                    <div className="col-12 col-xl-3 mxd-grid-item no-margin">
                      <div className="mxd-section-title__hrcontrols anim-uni-in-up">
                        <Link className="btn btn-anim btn-default btn-outline slide-right-up" href="/works-masonry">
                          <span className="btn-caption">Works</span>
                          <i className="ph-bold ph-arrow-up-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Capabilities List */}
            <div className="mxd-block">
              <div className="container-fluid p-0">
                <div className="row g-0">
                  <div className="col-12 mxd-grid-item no-margin">
                    <div className="mxd-cpb-list">
                      {/* UI/UX design */}
                      <div className="mxd-cpb-list__item hover-reveal__item">
                        <div className="mxd-cpb-list__divider anim-uni-in-up"></div>
                        <div className="hover-reveal__content hover-reveal-280x340">
                          <Image className="hover-reveal__image" src="/porthomeimages/uiux.png" alt="Project Preview" width={280} height={340} />
                        </div>
                        <div className="mxd-cpb-list__content anim-uni-in-up">
                          <h6 className="mxd-cpb-list__title">UI/UX design</h6>
                          <div className="mxd-cpb-list__num">
                            <span>/ 01</span>
                          </div>
                        </div>
                        <div className="mxd-cpb-list__divider anim-uni-in-up"></div>
                      </div>

                      {/* Hi-end websites */}
                      <div className="mxd-cpb-list__item hover-reveal__item">
                        <div className="mxd-cpb-list__divider anim-uni-in-up"></div>
                        <div className="hover-reveal__content hover-reveal-280x340">
                          <Image className="hover-reveal__image" src="/porthomeimages/website.png" alt="Project Preview" width={280} height={340} />
                        </div>
                        <div className="mxd-cpb-list__content anim-uni-in-up">
                          <h6 className="mxd-cpb-list__title">Hi-end websites</h6>
                          <div className="mxd-cpb-list__num">
                            <span>/ 02</span>
                          </div>
                        </div>
                        <div className="mxd-cpb-list__divider anim-uni-in-up"></div>
                      </div>

                      {/* Product design */}
                      <div className="mxd-cpb-list__item hover-reveal__item">
                        <div className="mxd-cpb-list__divider anim-uni-in-up"></div>
                        <div className="hover-reveal__content hover-reveal-280x340">
                          <Image className="hover-reveal__image" src="/porthomeimages/deisngproduct.png" alt="Project Preview" width={280} height={340} />
                        </div>
                        <div className="mxd-cpb-list__content anim-uni-in-up">
                          <h6 className="mxd-cpb-list__title">Product design</h6>
                          <div className="mxd-cpb-list__num">
                            <span>/ 03</span>
                          </div>
                        </div>
                        <div className="mxd-cpb-list__divider anim-uni-in-up"></div>
                      </div>

                      {/* Web & mobile apps */}
                      <div className="mxd-cpb-list__item hover-reveal__item">
                        <div className="mxd-cpb-list__divider anim-uni-in-up"></div>
                        <div className="hover-reveal__content hover-reveal-280x340">
                          <Image className="hover-reveal__image" src="/porthomeimages/webmobile.png" alt="Project Preview" width={280} height={340} />
                        </div>
                        <div className="mxd-cpb-list__content anim-uni-in-up">
                          <h6 className="mxd-cpb-list__title">Web & mobile apps</h6>
                          <div className="mxd-cpb-list__num">
                            <span>/ 04</span>
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

        {/* Marquee Text Section */}
        <div className="mxd-section padding-mtext-pre-grid">
          <div className="mxd-container fullwidth-container">
            <div className="mxd-block">
              <div className="marquee marquee-right--gsap muted-extra">
                <div className="marquee__toright">
                  {['Design', 'Development', 'Branding', 'eCommerce', 'Mobile Apps'].map((text, index) => (
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
                            c1.8-0.3,5.1-0.7,7.1-0.8c3.5-0.2,15.8,0,15.8,0c0.8,0,1.6-0.8,1.6-1.6C80,39.2,79.2,38.4,78.4,38.4C78.4,38.4,78.4,38.4,78.4,38.4z
                            "/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <Statistics />

        {/* About Section */}
        <div className="mxd-section padding-pre-grid">
          <div className="mxd-container grid-container">
            <div className="mxd-block">
              <div className="container-fluid px-0">
                <div className="row gx-0">
                  <div className="col-12 col-xl-5 mxd-grid-item no-margin">
                    <div className="mxd-block__name">
                      <h2 className="reveal-type anim-uni-in-up">Company</h2>
                    </div>
                  </div>
                  <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                    <div className="mxd-block__content">
                      <div className="mxd-block__paragraph">
                        <p className="t-large t-bright anim-uni-in-up">We are a creative digital agency specializing in innovative design and cutting-edge 
                          development. We help businesses stand out and thrive in the modern landscape. 
                        </p>
                        <p className="anim-uni-in-up">From pixel-perfect designs to flawless code, every aspect of our projects is 
                          crafted with care to ensure the highest standards of quality. We are passionate about integrating the latest technologies and trends, including 
                          interactive animations and mobile-first strategies.</p>
                        <div className="mxd-paragraph__controls anim-uni-in-up">
                          <Link className="btn btn-anim btn-default btn-outline slide-right-up" href="/about-us">
                            <span className="btn-caption">More About Us</span>
                            <i className="ph-bold ph-arrow-up-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mxd-section padding-pre-title">
          <div className="mxd-container grid-container">
            <div className="mxd-block">
              <div className="mxd-partners-cards">
                <div className="container-fluid p-0">
                  <div className="row g-0">
                    {['mozilla', 'envato', 'behance', 'dribbble', 'codeninja', 'udemy', 'angular', 'ghostgaming'].map((brand, index) => (
                      <div key={brand} className="col-12 col-md-6 col-xl-3 mxd-partners-cards__item mxd-grid-item animate-card-4">
                        <a className="mxd-partners-cards__inner" href="#0">
                          <div className="mxd-partners-cards__logo">
                            <Image src={`/img/brands/${brand}.svg`} alt="Partner Logo" width={120} height={60} />
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

      {/* Footer */}
      <Footer />

      {/* To Top Button */}
      <Link href="#0" id="to-top" className="btn btn-round btn-to-top slide-up anim-no-delay">
        <i className="ph ph-arrow-up"></i>
      </Link>
    </>
  );
}