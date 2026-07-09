import Link from 'next/link';
import RotatingCaption from '@/components/RotatingCaption';
import PixelGLogo from '@/components/PixelGLogo';
import PixelText from '@/components/PixelText';

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
                        <Link className="main-menu__link btn" href="/about-us" aria-label="About Us">
                          <PixelText text="ABOUT US" cursor={false} font="5x7" />
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn" href="/pricing" aria-label="Pricing">
                          <PixelText text="PRICING" cursor={false} font="5x7" />
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn" href="/portfolio" aria-label="Portfolio">
                          <PixelText text="PORTFOLIO" cursor={false} font="5x7" />
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
                    {/* Optional promo content */}
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
                  2025
                </p>
              </div>
            </div>
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

