'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Statistics = () => {
  const counter1Ref = useRef<HTMLParagraphElement>(null);
  const counter2Ref = useRef<HTMLParagraphElement>(null);
  const counter3Ref = useRef<HTMLParagraphElement>(null);
  const counter4Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Counter animation logic can be added here
    // For now, we'll just set the final values
    if (counter1Ref.current) counter1Ref.current.textContent = '50+';
    if (counter2Ref.current) counter2Ref.current.textContent = '80%';
    if (counter3Ref.current) counter3Ref.current.textContent = '5+';
    if (counter4Ref.current) counter4Ref.current.textContent = '70+';
  }, []);

  return (
    <div className="mxd-section overflow-hidden padding-pre-title">
      <div className="mxd-container grid-container">
        {/* Block - Statistics Cards Start */}
        <div className="mxd-block">
          <div className="mxd-stats-cards">
            <div className="container-fluid px-0">
              <div className="row gx-0">
                {/* item */}
                <div className="col-12 col-xl-5 mxd-stats-cards__item mxd-grid-item anim-uni-scale-in-right">
                  <div className="mxd-stats-cards__inner align-end bg-accent radius-m padding-4">
                    <div className="mxd-counter align-end">
                      <p ref={counter1Ref} className="mxd-counter__number mxd-stats-number opposite">0</p>
                      <p className="mxd-counter__descr t-140 t-bright opposite">Happy clients who<br/>trust our work</p>
                    </div>
                    <div className="mxd-stats-cards__btngroup">
                      <Link className="btn btn-anim btn-default btn-outline opposite slide-right-up" href="/about-us">
                        <span className="btn-caption">Studio</span>
                        <i className="ph-bold ph-arrow-up-right"></i>
                      </Link>
                    </div>
                 
                  </div>
                </div>

                {/* item */}
                <div className="col-12 col-xl-7 mxd-stats-cards__item mxd-grid-item anim-uni-scale-in-left">
                  <div className="mxd-stats-cards__inner align-end bg-base-tint radius-m padding-4">
                    <div className="mxd-stats-cards__btngroup">
                      <div className="mxd-avatars">
                       
                        <div className="mxd-avatars__item bg-base-opp">
                          <svg className="mxd-avatars__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            width="60px" height="60px" viewBox="0 0 60 60" xmlSpace="preserve">
                            <style type="text/css">
                              {`.icon-star { fill: var(--additional); }`}
                            </style>
                            <path className="icon-star" d="M58.9,28.9c0,0-9.1,0.1-12.1,0c-1.3,0-5.3-0.5-5.3-0.5c-1.7-0.2-3.4-0.7-4.8-1.7c-1.4-1-2.7-2.3-3.6-3.7
                              c-0.8-1.3-1.3-2.7-1.5-4.2c0,0-0.4-3.3-0.5-4.4c-0.2-3.3,0-13.1,0-13.1c0-0.6-0.5-1.1-1.1-1.1s-1.1,0.5-1.1,1.1
                              c0,0,0.2,9.8,0,13.1c0,1.1-0.5,4.4-0.5,4.4c-0.2,1.5-0.6,3-1.5,4.2c-0.9,1.5-2.2,2.7-3.6,3.7s-3,1.5-4.7,1.7c0,0-3.7,0.4-5,0.5
                              c-3.1,0.2-12.5,0-12.5,0C0.5,28.9,0,29.4,0,30s0.5,1.1,1.1,1.1c0,0,9.4-0.2,12.5,0c1.2,0,5,0.5,5,0.5c1.7,0.2,3.3,0.7,4.7,1.7
                              c1.3,0.9,2.4,2,3.3,3.3c1,1.4,1.5,3.1,1.7,4.8c0,0,0.4,3.9,0.5,5.2c0.1,3,0,12.2,0,12.2c0,0.6,0.5,1.1,1.1,1.1s1.1-0.5,1.1-1.1
                              c0,0-0.1-9.2,0-12.2c0-1.3,0.5-5.2,0.5-5.2c0.2-1.7,0.7-3.4,1.7-4.8c0.9-1.3,2-2.4,3.3-3.3c1.4-1,3.1-1.5,4.8-1.7
                              c0,0,3.9-0.4,5.3-0.5c3-0.1,12.1,0,12.1,0c0.6,0,1.1-0.5,1.1-1.1s-0.5-1.1-1.1-1.1l0,0L58.9,28.9z"/>
                          </svg>
                        </div>
                        <div className="mxd-avatars__item">
                          <Image src="/porthomeimages/300x300_ava-02.webp" alt="Avatar" width={60} height={60} />
                        </div>
                      </div>
                    </div>
                    <div className="mxd-counter align-end">
                      <p ref={counter2Ref} className="mxd-counter__number mxd-stats-number">0</p>
                      <p className="mxd-counter__descr t-140 t-bright">Clients come back for<br/>a new projects</p>
                    </div>
                 
                  </div>
                </div>

                {/* item */}
                <div className="col-12 col-xl-7 mxd-stats-cards__item mxd-grid-item anim-uni-scale-in-right">
                  <div className="mxd-stats-cards__inner bg-base-tint radius-m padding-4">
                    <div className="mxd-counter">
                      <p ref={counter3Ref} className="mxd-counter__number mxd-stats-number">0</p>
                      <p className="mxd-counter__descr t-140 t-bright">Years of professional experience in designing digital products</p>
                    </div>
                    <div className="mxd-stats-cards__btngroup">
                      <Link className="btn btn-anim btn-default btn-outline slide-right-down" href="/contact">
                        <span className="btn-caption">Start New Project</span>
                        <i className="ph-bold ph-arrow-down-right"></i>
                      </Link>
                    </div>
                    
                  </div>
                </div> 

                {/* item */}
                <div className="col-12 col-xl-5 mxd-stats-cards__item mxd-grid-item anim-uni-scale-in-left">
                  <div className="mxd-stats-cards__inner bg-base-tint radius-m padding-4">
                    <div className="mxd-counter">
                      <p ref={counter4Ref} className="mxd-counter__number mxd-stats-number">0</p>
                      <p className="mxd-counter__descr t-140 t-bright">Successfully<br/>completed projects</p>
                    </div>
                    <div className="mxd-stats-cards__btngroup">
                      <Link className="btn btn-anim btn-default btn-outline slide-right-up" href="/works-masonry">
                        <span className="btn-caption">Works</span>
                        <i className="ph-bold ph-arrow-up-right"></i>
                      </Link>
                    </div>
                    <div className="mxd-stats-cards__image mxd-stats-cards-image-4">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - Statistics Cards End */}
      </div>
    </div>
  );
};

export default Statistics;