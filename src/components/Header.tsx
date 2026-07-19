import Link from 'next/link';
import RotatingCaption from '@/components/RotatingCaption';
import PixelGLogo from '@/components/PixelGLogo';
import PixelText from '@/components/PixelText';
import RadialMenu from '@/components/RadialMenu';

export default function Header() {
  return (
    <>
      {/* Menu & Menu Hamburger */}
      <nav className="mxd-nav__wrap" data-lenis-prevent="">
        {/* Hamburger */}
        <div className="mxd-nav__contain loading__fade">
          <button 
            className="mxd-nav__hamburger"
            aria-label="Toggle menu"
          >
            <div className="hamburger__base"></div>
            {/* kawaii smiley — the two "lines" are the eyes (they stretch and
                cross into the X when the menu opens), plus a smile mouth */}
            <div className="hamburger__line"></div>
            <div className="hamburger__line"></div>
            <div className="hamburger__mouth"></div>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="mxd-menu__wrapper">
          <div className="mxd-menu__base"></div>
          <div className="mxd-menu__contain">
            <div className="mxd-menu__inner">
              {/* left side */}
              <div className="mxd-menu__left">
                <p className="mxd-menu__caption menu-fade-in"><RotatingCaption /></p>
                <div className="main-menu">
                  <nav className="main-menu__content">
                    {/* links set in the brand tile lettering (SELECTED WORK style) */}
                    <ul id="main-menu" className="main-menu__accordion">
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn" href="/" aria-label="Home">
                          <PixelText text="HOME" cursor={false} font="5x7" />
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn" href="/about-us" aria-label="Studio">
                          <PixelText text="STUDIO" cursor={false} font="5x7" />
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn" href="/pricing" aria-label="Services">
                          <PixelText text="SERVICES" cursor={false} font="5x7" />
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn" href="/portfolio" aria-label="Work">
                          <PixelText text="WORK" cursor={false} font="5x7" />
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn" href="/contact" aria-label="Contact">
                          <PixelText text="CONTACT" cursor={false} font="5x7" />
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              {/* right side */}
              <div className="mxd-menu__right">
                <div className="menu-promo">
                  <div className="menu-promo__content">
                    {/* futuristic single-mass G glyph (AIRSKIN reference):
                        pointed left chevron, carved counter, rounded joins.
                        Socials ride the caption line above it. */}
                    <div className="menu-glyph menu-fade-in">
                      <div className="menu-glyph__row">
                        <span className="menu-glyph__brand" aria-hidden="true">GRAPHIQ<sup>&reg;</sup></span>
                        <span className="menu-glyph__socials">
                          <a href="https://wa.me/12132322227" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <i className="ph ph-whatsapp-logo"></i>
                          </a>
                          <a href="https://www.instagram.com/n_drjj" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <i className="ph ph-instagram-logo"></i>
                          </a>
                          <a href="https://www.linkedin.com/in/andrej-lisal-67620341a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <i className="ph ph-linkedin-logo"></i>
                          </a>
                        </span>
                      </div>
                      <svg viewBox="0 0 400 420" aria-hidden="true" focusable="false">
                        {/* body: top bar + pointed left chevron + bottom bar,
                            mouth open to the right edge */}
                        <path
                          d="M150 16 H384 V148 H210 V198 L305 404 H90 L16 212 Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="26"
                          strokeLinejoin="round"
                        />
                        {/* the detached arm, split by the diagonal channel */}
                        <path
                          d="M252 198 H384 V404 H340 Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="26"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* data bottom line */}
              <div className="mxd-menu__data menu-fade-in">
                <p className="t-xsmall">
                  <a className="no-effect" href="" target="_blank">GRAPHIQ STUDIO LLC</a>
                </p>
                <p className="t-xsmall">
                  <i className="ph ph-copyright"></i>
                  2026
                </p>
              </div>
            </div>
            {/* sub-1200 replaces the whole layout with the radial
                installation menu (CSS-gated) */}
            <RadialMenu />
          </div>
        </div>
      </nav>

      {/* Header */}
      <header id="header" className="mxd-header">
        {/* header logo */}
        <div className="mxd-header__logo loading__fade">
          <Link href="/" className="mxd-logo">
            {/* logo icon — pixel G with traveling accent tile */}
            <div className="mxd-logo__image">
              <PixelGLogo />
            </div>
            {/* logo text */}
            <span className="mxd-logo__text">GRAPHIQ<br/>STUDIO LLC</span>
          </Link>
        </div>
        
        {/* header controls */}
        <div className="mxd-header__controls loading__fade">
          <button 
            id="color-switcher" 
            className="mxd-color-switcher" 
            type="button" 
            role="switch" 
            aria-label="light/dark mode" 
            aria-checked="true"
          >
            <i className="ph-bold ph-moon-stars"></i>
          </button>
          {/* "Let's Work" CTA removed — the reference bar has just the two
              chips; the menu + Contact page cover the CTA */}
        </div>
      </header>
    </>
  );
};

