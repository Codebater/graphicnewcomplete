'use client';

import Link from 'next/link';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate subscription logic
    try {
      setIsSubscribed(true);
      setError(false);
      setEmail('');
    } catch (err) {
      setError(true);
      setIsSubscribed(false);
    }
  };

  return (
    <footer id="mxd-footer" className="mxd-footer">
      {/* Footer Block - Fullwidth Text Start */}
      <div className="mxd-footer__text-wrap">
        <div className="fullwidth-text__tl-trigger"></div>
        <div className="mxd-footer__fullwidth-text anim-top-to-bottom">
          <h1 className="footerh1">graphiq.art</h1>
        </div>
      </div>
      {/* Footer Block - Fullwidth Text End */}

      {/* Footer Block - Info Columns Start */}
      <div className="mxd-footer__footer-blocks">
        {/* single column */}
        <div className="footer-blocks__column animate-card-3">
          {/* inner card */}
          <div className="footer-blocks__card fullheight-card">
            {/* footer navigation */}
            <div className="footer-blocks__nav">
              <ul className="footer-nav">
                <li className="footer-nav__item anim-uni-in-up">
                  <Link href="/" className="footer-nav__link btn-anim">
                    <span className="btn-caption">Home</span>
                  </Link>
                </li>
                <li className="footer-nav__item anim-uni-in-up">
                  <Link href="/about-us" className="footer-nav__link btn-anim">
                    <span className="btn-caption">About Us</span>
                  </Link>
                </li>
                <li className="footer-nav__item anim-uni-in-up">
                  <Link href="/pricing" className="footer-nav__link btn-anim">
                    <span className="btn-caption">Pricing</span>
                  </Link>
                </li>
                <li className="footer-nav__item anim-uni-in-up">
                  <Link href="/portfolio" className="footer-nav__link btn-anim">
                    <span className="btn-caption">Portfolio</span>
                  </Link>
                </li>
                <li className="footer-nav__item anim-uni-in-up">
                  <Link href="/contact" className="footer-nav__link btn-anim">
                    <span className="btn-caption">Contact</span>
                  </Link>
                </li>
              </ul>
            </div>
            {/* links */}
            <div className="footer-blocks__links anim-uni-in-up">
              <Link className="btn btn-line-xsmall btn-muted slide-right anim-no-delay" href="/privacy">
                <span className="btn-caption">Privacy Policy</span>
                <i className="ph ph-arrow-right"></i>
              </Link>
              <Link className="btn btn-line-xsmall btn-muted slide-right anim-no-delay" href="/terms">
                <span className="btn-caption">Terms & conditions</span>
                <i className="ph ph-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* single column */}
        <div className="footer-blocks__column animate-card-3">
          {/* inner card */}
          <div className="footer-blocks__card">
            <p className="mxd-point-subtitle anim-uni-in-up">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor">
                <path fill="currentColor" d="M19.6,9.6c0,0-3,0-4,0c-0.4,0-1.8-0.2-1.8-0.2c-0.6-0.1-1.1-0.2-1.6-0.6c-0.5-0.3-0.9-0.8-1.2-1.2
                  c-0.3-0.4-0.4-0.9-0.5-1.4c0,0-0.1-1.1-0.2-1.5c-0.1-1.1,0-4.4,0-4.4C10.4,0.2,10.2,0,10,0S9.6,0.2,9.6,0.4c0,0,0.1,3.3,0,4.4
                  c0,0.4-0.2,1.5-0.2,1.5C9.4,6.7,9.2,7.2,9,7.6C8.7,8.1,8.2,8.5,7.8,8.9c-0.5,0.3-1,0.5-1.6,0.6c0,0-1.2,0.1-1.7,0.2
                  c-1,0.1-4.2,0-4.2,0C0.2,9.6,0,9.8,0,10c0,0.2,0.2,0.4,0.4,0.4c0,0,3.1-0.1,4.2,0c0.4,0,1.7,0.2,1.7,0.2c0.6,0.1,1.1,0.2,1.6,0.6
                  c0.4,0.3,0.8,0.7,1.1,1.1c0.3,0.5,0.5,1,0.6,1.6c0,0,0.1,1.3,0.2,1.7c0,1,0,4.1,0,4.1c0,0.2,0.2,0.4,0.4,0.4s0.4-0.2,0.4-0.4
                  c0,0,0-3.1,0-4.1c0-0.4,0.2-1.7,0.2-1.7c0.1-0.6,0.2-1.1,0.6-1.6c0.3-0.4,0.7-0.8,1.1-1.1c0.5-0.3,1-0.5,1.6-0.6
                  c0,0,1.3-0.1,1.8-0.2c1,0,4,0,4,0c0.2,0,0.4-0.2,0.4-0.4C20,9.8,19.8,9.6,19.6,9.6L19.6,9.6z"/>
              </svg>
              <a href="mailto:hello@graphiq.art">hello@graphiq.art</a>
            </p>
          </div>
          {/* inner card */}
          <div className="footer-blocks__card">
            <p className="mxd-point-subtitle anim-uni-in-up">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor">
                <path fill="currentColor" d="M19.6,9.6c0,0-3,0-4,0c-0.4,0-1.8-0.2-1.8-0.2c-0.6-0.1-1.1-0.2-1.6-0.6c-0.5-0.3-0.9-0.8-1.2-1.2
                  c-0.3-0.4-0.4-0.9-0.5-1.4c0,0-0.1-1.1-0.2-1.5c-0.1-1.1,0-4.4,0-4.4C10.4,0.2,10.2,0,10,0S9.6,0.2,9.6,0.4c0,0,0.1,3.3,0,4.4
                  c0,0.4-0.2,1.5-0.2,1.5C9.4,6.7,9.2,7.2,9,7.6C8.7,8.1,8.2,8.5,7.8,8.9c-0.5,0.3-1,0.5-1.6,0.6c0,0-1.2,0.1-1.7,0.2
                  c-1,0.1-4.2,0-4.2,0C0.2,9.6,0,9.8,0,10c0,0.2,0.2,0.4,0.4,0.4c0,0,3.1-0.1,4.2,0c0.4,0,1.7,0.2,1.7,0.2c0.6,0.1,1.1,0.2,1.6,0.6
                  c0.4,0.3,0.8,0.7,1.1,1.1c0.3,0.5,0.5,1,0.6,1.6c0,0,0.1,1.3,0.2,1.7c0,1,0,4.1,0,4.1c0,0.2,0.2,0.4,0.4,0.4s0.4-0.2,0.4-0.4
                  c0,0,0-3.1,0-4.1c0-0.4,0.2-1.7,0.2-1.7c0.1-0.6,0.2-1.1,0.6-1.6c0.3-0.4,0.7-0.8,1.1-1.1c0.5-0.3,1-0.5,1.6-0.6
                  c0,0,1.3-0.1,1.8-0.2c1,0,4,0,4,0c0.2,0,0.4-0.2,0.4-0.4C20,9.8,19.8,9.6,19.6,9.6L19.6,9.6z"/>
              </svg>
              <a href="tel:+12127089400">+1 212-708-9400</a>
            </p>
          </div>
          {/* inner card */}
          <div className="footer-blocks__card fill-card notify">
            {/* card title */}
            <div className="footer-blocks__title anim-uni-in-up">
              <p className="footer-blocks__title-m">Subscribe to our insights:</p>
            </div>
            {/* subscribe form container */}
            <div className="form-container anim-uni-in-up">
              {/* reply messages */}
              <div className={`form__reply subscription-ok ${isSubscribed ? 'visible' : ''}`}>
                <span className="reply__text">Done! Thanks for subscribing.</span>
              </div>
              <div className={`form__reply subscription-error ${error ? 'visible' : ''}`}>
                <span className="reply__text">Oops! Something went wrong. Please try again later.</span>
              </div>
              {/* subscribe form */}
              <form className="form notify-form form-light" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-form btn-absolute-right btn-muted slide-right-up anim-no-delay" type="submit">
                  <i className="ph ph-arrow-up-right"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* single column */}
        <div className="footer-blocks__column animate-card-3">
          {/* inner card */}
          <div className="footer-blocks__card fullheight-card">
            {/* nav block */}
            <div className="footer-blocks__block">
              {/* card title */}
              <div className="footer-blocks__title anim-uni-in-up">
                <p className="footer-blocks__title-l">Ecosystem</p>
              </div>
              {/* footer socials */}
              <div className="footer-blocks__socials">
                <ul className="footer-socials">
                  <li className="footer-socials__item anim-uni-in-up">
                    <a href="https://dribbble.com/" className="footer-socials__link" target="_blank" rel="noopener noreferrer">Dribbble</a>
                  </li>
                  <li className="footer-socials__item anim-uni-in-up">
                    <a href="https://www.behance.net/" className="footer-socials__link" target="_blank" rel="noopener noreferrer">Behance</a>
                  </li>
                  <li className="footer-socials__item anim-uni-in-up">
                    <a href="https://www.instagram.com/" className="footer-socials__link" target="_blank" rel="noopener noreferrer">Instagram</a>
                  </li>
                  <li className="footer-socials__item anim-uni-in-up">
                    <a href="https://github.com/" className="footer-socials__link" target="_blank" rel="noopener noreferrer">Github</a>
                  </li>
                  <li className="footer-socials__item anim-uni-in-up">
                    <a href="https://codepen.io/" className="footer-socials__link" target="_blank" rel="noopener noreferrer">Codepen</a>
                  </li>
                  <li className="footer-socials__item anim-uni-in-up">
                    <a href="https://www.figma.com/community" className="footer-socials__link" target="_blank" rel="noopener noreferrer">Figma Community</a>
                  </li>
                </ul>
              </div>
            </div>
            {/* links */}
            <div className="footer-blocks__links anim-uni-in-up">
              <p className="t-xsmall t-muted">
                <a className="no-effect" href="https://1.envato.market/EKA9WD" target="_blank" rel="noopener noreferrer">graphic_art</a>
                <i className="ph-bold ph-copyright"></i>
                2025
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Block - Info Columns End */}
    </footer>
  );
};

export default Footer;