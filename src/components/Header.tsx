import Image from 'next/image';
import Link from 'next/link';

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
            <div className="hamburger__line"></div>
            <div className="hamburger__line"></div>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="mxd-menu__wrapper">
          <div className="mxd-menu__base"></div>
          <div className="mxd-menu__contain">
            <div className="mxd-menu__inner">
              {/* left side */}
              <div className="mxd-menu__left">
                <p className="mxd-menu__caption menu-fade-in">🦄 Innovative design<br/>and cutting-edge development</p>
                <div className="main-menu">
                  <nav className="main-menu__content">
                    <ul id="main-menu" className="main-menu__accordion">
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn btn-anim" href="/">
                          <span className="btn-caption">Home</span>
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn btn-anim" href="/about-us">
                          <span className="btn-caption">About Us</span>
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn btn-anim" href="/pricing">
                          <span className="btn-caption">Pricing</span>
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn btn-anim" href="/portfolio">
                          <span className="btn-caption">Portfolio</span>
                        </Link>
                      </li>
                      <li className="main-menu__item">
                        <Link className="main-menu__link btn btn-anim" href="/contact">
                          <span className="btn-caption">Contact</span>
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
                  <a className="no-effect" href="https://1.envato.market/EKA9WD" target="_blank">graphiq.art</a>
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
            {/* logo icon */}
            <div className="mxd-logo__image" id="emoji-logo">
              <Image className="emoji-display" id="emoji-display" src="/emojis/1.png" alt="Emoji" width={40} height={40} />
            </div>
            {/* logo text */}
            <span className="mxd-logo__text">Graphiq.<br/>art</span>
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
          <Link className="btn btn-anim btn-default btn-mobile-icon btn-outline slide-right-up" href="/contact">
            <span className="btn-caption">Let&apos;s Work</span>
            <i className="ph-bold ph-arrow-up-right"></i>
          </Link>
        </div>
      </header>
    </>
  );
};

