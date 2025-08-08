'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { submitFormDataToFormspree, getErrorMessage } from '@/lib/formspree';

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    Flip: any;
    Lenis: any;
    Typed: any;
    Swiper: any;
    Ukiyo: any;
    SplitType: any;
    SVGInjector: any;
    $: any;
    Modernizr: any;
    lenis?: any;
    imagesLoaded: any;
    CountUp: any;
    emojiInterval?: any;
  }
}

export default function AppInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    // Wait for all required libraries to be loaded
    const initializeApp = () => {
      if (typeof window === 'undefined' || !window.gsap || !window.$) {
        setTimeout(initializeApp, 100);
        return;
      }

      const { gsap, ScrollTrigger, Flip, Lenis, Typed, Swiper, Ukiyo, SplitType, $, imagesLoaded } = window;

      // Clean up previous instances
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
      ScrollTrigger.killAll();

      // Clear any existing intervals/timeouts
      if (window.emojiInterval) {
        clearInterval(window.emojiInterval);
      }

      // Register GSAP plugins
      if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
      if (Flip) gsap.registerPlugin(Flip);

      // Loader & Loading Animation
      const content = document.querySelector('body');
      const loadingWrap = document.querySelector('.loading-wrap');
      const loadingItems = loadingWrap?.querySelectorAll('.loading__item');
      const fadeInItems = document.querySelectorAll('.loading__fade');

      function startLoader() {
        const counterElement = document.querySelector(".loader__count .count__text");
        if (counterElement) {
          let currentValue = 0;
          function updateCounter() {
            if (currentValue < 100 && counterElement) {
              const increment = Math.floor(Math.random() * 10) + 1;
              currentValue = Math.min(currentValue + increment, 100);
              counterElement.textContent = currentValue.toString();
              const delay = Math.floor(Math.random() * 120) + 25;
              setTimeout(updateCounter, delay);
            }
          }
          updateCounter();
        }
      }

      function hideLoader() {
        gsap.to(".loader__count", { duration: 0.8, ease: 'power2.in', y: "100%", delay: 1.8 });
        gsap.to(".loader__wrapper", { duration: 0.8, ease: 'power4.in', y: "-100%", delay: 2.2 });
        setTimeout(() => {
          const loader = document.getElementById("loader");
          if (loader) {
            loader.classList.add("loaded");
          }
        }, 3200);
      }

      function pageAppearance() {
        if (loadingItems) {
          gsap.set(loadingItems, { opacity: 0 });
          gsap.to(loadingItems, { 
            duration: 1.1,
            ease: 'power4',
            startAt: {y: 120},
            y: 0,
            opacity: 1,
            delay: 0.8,
            stagger: 0.08
          });
        }
        gsap.set(fadeInItems, { opacity: 0 });
        gsap.to(fadeInItems, { duration: 0.8, ease: 'none', opacity: 1, delay: 3.2 });
      }

      // Start loader if it exists
      if (document.querySelector(".loader__count")) {
        startLoader();
      }

      // Initialize images loaded for page appearance
      if (imagesLoaded && content) {
        const imgLoad = imagesLoaded(content);
        imgLoad.on('done', () => {
          if (document.querySelector(".loader__wrapper")) {
            hideLoader();
          }
          pageAppearance();
        });
      } else {
        // Fallback if imagesLoaded is not available
        setTimeout(() => {
          if (document.querySelector(".loader__wrapper")) {
            hideLoader();
          }
          pageAppearance();
        }, 1000);
      }

      // Initialize Lenis Scroll Plugin
      if (Lenis) {
        window.lenis = new Lenis();
        window.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time: number) => {
          window.lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }

      // Initialize Typed.js
      const animatedHeadline = $(".animated-type");
      if (animatedHeadline.length && Typed) {
        new Typed('#typed', {
          stringsElement: '#typed-strings',
          showCursor: true,
          cursorChar: '_',
          loop: true,
          typeSpeed: 70,
          backSpeed: 30,
          backDelay: 2500
        });
      }

      // Header Scroll Behavior
      const handleHeaderScroll = () => {
        if ($(window).scrollTop() > 10) {
          $(".mxd-header").addClass("is-hidden");
        } else {
          $(".mxd-header").removeClass("is-hidden");
        }
      };
      $(window).on("scroll", handleHeaderScroll);

      // Hero #02 Scroll Out Animation
      const hero02FadeOutEl = document.querySelectorAll(".hero-02-static-anim-el"); 
      hero02FadeOutEl.forEach((element) => {
        const hero02fadeOutTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero-02-static__tl-trigger",
            start: "top 14%",
            end: "top 0.2%",
            scrub: {
              scrub: true, 
              ease: "sine",
            },
          },
        });
        hero02fadeOutTl.fromTo(element, {
          transform: "translate3d(0, 0, 0)",
          scaleY: 1,
          opacity: 1
        }, 
        {
          transform: "translate3d(0, -5rem, 0)",
          scaleY: 1.3,
          opacity: 0
        });
      });

      // Hero #02 pinned screen
      const fadeOutEl = document.querySelectorAll(".hero-02-fade-out-scroll"); 
      fadeOutEl.forEach((element) => {
        const fadeOutTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".mxd-pinned-fullscreen__tl-trigger",
            start: "top 80%",
            end: "top 10%",
            scrub: {
              scrub: true, 
              ease: "sine",
            },
          },
        });
        fadeOutTl.fromTo(element, { opacity: 1 }, { opacity: 0 });
      });

      // Hero #07 Scroll Out Animation
      const hero07FadeOutEl = document.querySelectorAll(".hero-07-slide-out-scroll"); 
      hero07FadeOutEl.forEach((element) => {
        const hero07fadeOutTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".mxd-hero-07__tl-trigger",
            start: "top 86%",
            end: "top 10%",
            scrub: {
              scrub: true, 
              ease: "power4.out",
            },
          },
        });
        hero07fadeOutTl.fromTo(element, {
          transform: "translate3d(0, 0, 0)",
          scaleY: 1,
        }, 
        {
          transform: "translate3d(0, -26rem, 0)",
          scaleY: 0.8,
        });
      });

      // Hero #07 small scroll-out elements
      const hero07SmallFadeOutEl = document.querySelectorAll(".hero-07-fade-out-scroll"); 
      hero07SmallFadeOutEl.forEach((element) => {
        const fadeOutTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".mxd-hero-07__tl-trigger",
            start: "top 70%",
            end: "top 40%",
            scrub: {
              scrub: true, 
              ease: "elastic.out(1,0.3)",
            },
          },
        });
        fadeOutTl.fromTo(element, { opacity: 1, transform: "translate3d(0, 0, 0)" }, { opacity: 0, transform: "translate3d(0, -10rem, 0)"});
      });

      // Hero #08 Scroll Out Animation
      const hero08FadeOutEl = document.querySelectorAll(".hero-08-slide-out-scroll");
      const hero08ScaleOutEl = document.querySelectorAll(".hero-08-scale-out-scroll"); 
      hero08FadeOutEl.forEach((element) => {
        const hero08fadeOutTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".mxd-hero-08__tl-trigger",
            start: "top 80%",
            end: "top 40%",
            scrub: {
              scrub: true, 
              ease: "power4.inOut",
            },
          },
        });
        hero08fadeOutTl.fromTo(element, {
          transform: "translate3d(0, 0, 0)",
          opacity: 1
        }, 
        {
          transform: "translate3d(0, -5rem, 0)",
          opacity: 0
        });
      });
      hero08ScaleOutEl.forEach((element) => {
        const hero08scaleOutTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".mxd-hero-08__tl-trigger",
            start: "top 40%",
            end: "top 10%",
            scrub: {
              scrub: true, 
              ease: "power4.inOut",
            },
          },
        });
        hero08scaleOutTl.fromTo(element, {
          transform: "translate3d(0, 0, 0)",
          scaleY: 1,
          opacity: 1
        }, 
        {
          transform: "translate3d(0, -5rem, 0)",
          scaleY: 1.2,
          opacity: 0
        });
      });

      // Smooth Scrolling
      $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').off('click').on('click', function(this: any, event: any) {
        const target = $(this.getAttribute('href') || '');
        if (target.length) {
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset()!.top
          }, 1000, function() {
            const $target = $(target);
            $target.focus();
            if ($target.is(":focus")) {
              return false;
            } else {
              $target.attr('tabindex','-1');
              $target.focus();
            }
          });
        }
      });

      // Images Moving Ban
      $("img, a").off("dragstart").on("dragstart", function(event: any) { event.preventDefault(); });

      // Chrome Smooth Scroll
      try {
        if ($.browserSelector) {
          $.browserSelector();
          if($("html").hasClass("chrome")) {
            if ($.smoothScroll) {
              $.smoothScroll();
            }
          }
        }
      } catch(err) {
        // Ignore errors if browserSelector is not available
      }

      // SVG Fallback
      if (window.Modernizr && !window.Modernizr.svg) {
        $("img[src*='svg']").attr("src", function(this: any) {
          return $(this).attr("src")?.replace(".svg", ".png") || '';
        });
      }

      // Menu & Hamburger
      $(".mxd-nav__wrap").each((index: number, element: any) => {
        const hamburgerEl = $(element).find(".mxd-nav__hamburger");
        const navLineEl = $(element).find(".hamburger__line");
        const menuContainEl = $(element).find(".mxd-menu__contain");
        const flipItemEl = $(element).find(".hamburger__base");
        const menuWrapEl = $(element).find(".mxd-menu__wrapper");
        const menuBaseEl = $(element).find(".mxd-menu__base");
        const menuItem = $(element).find(".main-menu__item");
        const videoEl = $(element).find(".menu-promo__video");
        const fadeInEl = $(element).find(".menu-fade-in");
        const flipDuration = 0.6;

        function flip(forwards: boolean) {
          const state = Flip.getState(flipItemEl);
          if (forwards) {
            flipItemEl.appendTo(menuContainEl);
          } else {
            flipItemEl.appendTo(hamburgerEl);
          }
          Flip.from(state, { ease: "power4.inOut", duration: 0.8 });
        }

        const tl = gsap.timeline({ paused: true });
        tl.set(menuWrapEl, { display: "flex" });
        tl.from(menuBaseEl, { 
          opacity: 0,
          duration: flipDuration,
          ease: "none",
          onStart: () => {
            flip(true);
          }
        });
        tl.to(navLineEl.eq(0), { y: 5, duration: 0.16 }, "<")
        tl.to(navLineEl.eq(1), { y: -5, duration: 0.16 }, "<")
        tl.to(navLineEl.eq(0), { rotate: 45, duration: 0.16 }, 0.2)
        tl.to(navLineEl.eq(1), { rotate: -45, duration: 0.16 }, 0.2)
        tl.add("fade-in-up")
        .from(menuItem, {
          opacity: 0,
          yPercent: 50,
          duration: 0.2,
          stagger: {amount: 0.2},
          onReverseComplete: () => {
            flip(false);
          }
        }, "fade-in-up")
        .from(videoEl, {
          opacity: 0,
          yPercent: 20,
          duration: 0.2,
        }, "fade-in-up");
        tl.from(fadeInEl, { opacity: 0, duration: 0.3, });

        function openMenu(open: boolean) {
          if (!tl.isActive()) {
            if (open) {
              tl.play();
              hamburgerEl.addClass("nav-open");
            } else {
              tl.reverse();
              hamburgerEl.removeClass("nav-open");
            }
          }
        }

        hamburgerEl.on("click", (e: Event) => {
          e.preventDefault();
          if ($(e.currentTarget).hasClass("nav-open")) {
            openMenu(false);
          } else {
            openMenu(true);
          }
        });
        menuBaseEl.on("click", () => {
          openMenu(false);
        });
        $(document).on("keydown", (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            openMenu(false);
          }
        });

        // Add event listener for page unload
        window.addEventListener("beforeunload", () => {
          openMenu(false);
        });
      });

      // Header/Menu Z-index Change
      $(".mxd-nav__hamburger").off("click.zindex").on("click.zindex", function() {
        if ($(".mxd-nav__hamburger").hasClass("nav-open")) {
          $(".mxd-header").addClass("menu-is-visible");
        } else {
          setTimeout(function() {
            $(".mxd-header").removeClass("menu-is-visible");
          }, 1100);
        }
      });

      // Menu Accordion
      const Accordion = function(this: any, el: any, multiple: boolean) {
        this.el = el || {};
        this.multiple = multiple || false;
        const links = this.el.find('.main-menu__toggle');
        links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
      }
      Accordion.prototype.dropdown = function(this: any, e: any) {
        const $el = e.data.el;
        const $this = $(this),
        $next = $this.next();
        $next.slideToggle();
        $this.parent().toggleClass('open');
        if (!e.data.multiple) {
          $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        };
      }
      new (Accordion as any)($('#main-menu'), false);

      // Accordion
      $(".mxd-accordion__title").on("click", function(this: any, e: Event) {
        e.preventDefault();
        const $this = $(this);
        if (!$this.hasClass("accordion-active")) {
          $(".mxd-accordion__content").slideUp(400);
          $(".mxd-accordion__title").removeClass("accordion-active");
          $('.mxd-accordion__arrow').removeClass('accordion-rotate');
        }
        $this.toggleClass("accordion-active");
        $this.next().slideToggle();
        $('.mxd-accordion__arrow', this).toggleClass('accordion-rotate');
      });

      // Layout Masonry After Each Image Loads
      if ($.fn.imagesLoaded && $.fn.masonry) {
        $('.mxd-projects-masonry__gallery').imagesLoaded().progress(() => {
          $('.mxd-projects-masonry__gallery').masonry('layout');
          ScrollTrigger.refresh();
        });
      }

      // Magnific Popup Video
      if ($.fn.magnificPopup) {
        $('#showreel-trigger').magnificPopup({
          type: 'iframe',
          mainClass: 'mfp-fade',
          removalDelay: 160,
          preloader: false,
          fixedContentPos: false,
          callbacks: {
            beforeOpen: function() { 
              $('body').addClass('overflow-hidden'); 
              if (window.lenis) window.lenis.stop(); 
            },
            close: function() { 
              $('body').removeClass('overflow-hidden'); 
              if (window.lenis) window.lenis.start(); 
            }
          }
        });
      }

      // Mailchimp Subscribe Form
      if ($.fn.ajaxChimp) {
        $('.notify-form').ajaxChimp({
          callback: function(resp: any) {
            if(resp.result === 'success') {
              $('.notify').find('.form').addClass('is-hidden');
              $('.notify').find('.subscription-ok').addClass('is-visible');
              setTimeout(function() {
                $('.notify').find('.subscription-ok').removeClass('is-visible');
                $('.notify').find('.form').delay(300).removeClass('is-hidden');
                $('.notify-form').trigger("reset");
              }, 5000);
            } else if(resp.result === 'error') {
              $('.notify').find('.form').addClass('is-hidden');
              $('.notify').find('.subscription-error').addClass('is-visible');
              setTimeout(function() {
                $('.notify').find('.subscription-error').removeClass('is-visible');
                $('.notify').find('.form').delay(300).removeClass('is-hidden');
                $('.notify-form').trigger("reset");
              }, 5000);
            }
          },
          url: 'https://club.us10.list-manage.com/subscribe/post?u=e8d650c0df90e716c22ae4778&amp;id=54a7906900&amp;f_id=00b64ae4f0'
        });
      }

      // Contact Form
      $("#contact-form").off("submit").on("submit", async function(this: any, e: Event) {
        e.preventDefault();
        const th = $(this);
        
        try {
          // Get form data and submit to Formspree
          const formData = new FormData(this);
          await submitFormDataToFormspree(formData);
          
          // Show success UI
          $('.contact').find('.form').addClass('is-hidden');
          $('.contact').find('.form__reply').addClass('is-visible');
          setTimeout(function() {
            $('.contact').find('.form__reply').removeClass('is-visible');
            $('.contact').find('.form').delay(300).removeClass('is-hidden');
            th.trigger("reset");
          }, 5000);
        } catch (error) {
          console.error('Contact form submission error:', error);
          alert(getErrorMessage());
        }
        
        return false;
      });

      // Pinned Images (for Services Block)
      $(".mxd-pinned").each(function (this: any, index: number) {
        const childTriggers = $(this).find(".mxd-pinned__text-item");
        const childTargets = $(this).find(".mxd-pinned__img-item");
        function makeItemActive(index: number) {
          childTriggers.removeClass('is-active');
          childTargets.removeClass('is-active');
          childTriggers.eq(index).addClass('is-active');
          childTargets.eq(index).addClass('is-active');
        }
        makeItemActive(0);
        childTriggers.each(function (this: any, index: number) {
          ScrollTrigger.create({
            trigger: this,
            start: "top center",
            end: "bottom center",
            onToggle: (self: any) => {
              if (self.isActive) {
                makeItemActive(index);
              }
            }
          });
        });
      });

      // Stacking Cards
      const cards = document.querySelectorAll('.stack-item');
      const stickySpace = document.querySelector('.stack-offset');
      const animation = gsap.timeline();
      let cardHeight: number;

      if(document.querySelector(".stack-item")) {
        function initCards(){
          animation.clear();
          cardHeight = (cards[0] as HTMLElement).offsetHeight;
          cards.forEach((card, index) => {
            if(index > 0){
              gsap.set(card, {y:index * cardHeight});
              animation.to(card, {y:0, duration: index*0.5, ease: "none"},0);
            }
          });
        }
        initCards();
        ScrollTrigger.create({
          trigger: ".stack-wrapper",
          start: "top top",
          pin: true,
          end: ()=>`+=${(cards.length * cardHeight) + (stickySpace as HTMLElement)?.offsetHeight || 0}`,
          scrub: true,
          animation: animation,
          invalidateOnRefresh: true
        });
        ScrollTrigger.addEventListener("refreshInit", initCards);
      }

      // Animation - Buttons Common
      const buttonElements = document.querySelectorAll(".btn-anim .btn-caption");
      buttonElements.forEach((element) => {
        const innerText = (element as HTMLElement).innerText;
        element.innerHTML = "";
        const textContainer = document.createElement("div");
        textContainer.classList.add("btn-anim__block");
        for (let letter of innerText) {
          const span = document.createElement("span");
          span.innerText = letter.trim() === "" ? "\xa0" : letter;
          span.classList.add("btn-anim__letter");
          textContainer.appendChild(span);
        }
        element.appendChild(textContainer);
        element.appendChild(textContainer.cloneNode(true));

        element.addEventListener("mouseover", () => {
          element.classList.remove("play");
        });
      });

      // Parallax - Ukiyo Images & Video
      if (Ukiyo) {
        const images = document.querySelectorAll(".parallax-img");
        const imagesSmall = document.querySelectorAll(".parallax-img-small");
        const video = document.querySelectorAll(".parallax-video");
        new Ukiyo(images,{
          scale: 1.5,
          speed: 1.5,
          externalRAF: false,
        });
        new Ukiyo(imagesSmall,{
          scale: 1.2,
          speed: 1.5,
          externalRAF: false
        });
        new Ukiyo(video,{
          scale: 1.5,
          speed: 1.5,
          externalRAF: false
        });
      }

      // Animation - Text Reveal
      if (SplitType) {
        const splitTypes = document.querySelectorAll(".reveal-type");
        splitTypes.forEach((char: Element) => {
          const text = new SplitType(char, { types: 'words, chars' });
          gsap.from(text.chars, {
            scrollTrigger: {
              trigger: char,
              start: 'top 80%',
              end: 'top 20%',
              scrub: true,
              markers: false
            },
            opacity: 0.2,
            stagger: 0.1
          });
        });

        const animInUp = document.querySelectorAll(".reveal-in-up");
        animInUp.forEach((char: Element) => {
          const text = new SplitType(char);
          gsap.from(text.chars, {
            scrollTrigger: {
              trigger: char,
              start: 'top 90%',
              end: 'top 20%',
              scrub: true,
            },
            transformOrigin: "top left",
            y: 10,
            stagger: 0.2,
            delay: 0.2,
            duration: 2,
          });
        });
      }

      // Animation - Scroll Rotating Animation
      const animateRotation = document.querySelectorAll(".animate-rotation");
      animateRotation.forEach((section) => {
        const value = $(section).data("value") || 360;
        gsap.fromTo(section, {
          ease: 'sine',
          rotate: 0,
        }, {
          rotate: value,
          scrollTrigger: {
            trigger: section,
            scrub: true,
            toggleActions: 'play none none reverse',
          }
        });
      });

      // Top to Bottom Animation
      const toBottomEl = document.querySelectorAll(".anim-top-to-bottom"); 
      toBottomEl.forEach((element) => {
        const toBottomTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".fullwidth-text__tl-trigger",
            start: "top 99%",
            end: "top 24%",
            scrub: {
              scrub: true, 
              ease: "none" 
            },
          },
        });
        toBottomTl.fromTo(element, {
          transform: "translate3d(0, -100%, 0)"
        }, 
        {
          transform: "translate3d(0, 0, 0)"
        });
      });

      // Animation - Images Reveal on Hover
      const link = document.querySelectorAll('.hover-reveal__item');
      const linkHoverReveal = document.querySelectorAll('.hover-reveal__content');
      const linkImages = document.querySelectorAll('.hover-reveal__image');

      for(let i = 0; i < link.length; i++) {
        link[i].addEventListener('mousemove', (e: any) => {
          (linkHoverReveal[i] as HTMLElement).style.opacity = '1';
          (linkHoverReveal[i] as HTMLElement).style.transform = `translate(-80%, -50% )`;
          (linkImages[i] as HTMLElement).style.transform = 'scale(1, 1)';
          (linkHoverReveal[i] as HTMLElement).style.left = e.clientX + "px";
        });
        
        link[i].addEventListener('mouseleave', () => {
          (linkHoverReveal[i] as HTMLElement).style.opacity = '0';
          (linkHoverReveal[i] as HTMLElement).style.transform = `translate(-80%, -50%)`;
          (linkImages[i] as HTMLElement).style.transform = 'scale(1, 1.4)';
        });
      }

      // CountUp - All Counters Options
      if (window.CountUp) {
        const optionsNormal = {
          enableScrollSpy: true
        };
        const optionsDecimal = {
          decimalPlaces: 1,
          enableScrollSpy: true
        };
        const optionsDecimalTwo = {
          decimalPlaces: 2,
          enableScrollSpy: true
        };
        const optionsPercent = {
          suffix: '%',
          enableScrollSpy: true
        };
        const optionsK = {
          suffix: 'K',
          enableScrollSpy: true
        };
        const optionsPlus = {
          suffix: '+',
          enableScrollSpy: true
        };

        // Initialize counters if elements exist
        document.querySelectorAll('[data-count]').forEach((el) => {
          const target = parseFloat(el.getAttribute('data-count') || '0');
          const options = el.classList.contains('decimal') ? optionsDecimal :
                        el.classList.contains('decimal-two') ? optionsDecimalTwo :
                        el.classList.contains('percent') ? optionsPercent :
                        el.classList.contains('k') ? optionsK :
                        el.classList.contains('plus') ? optionsPlus :
                        optionsNormal;
          
          new window.CountUp(el, target, options);
        });
      }

      // Animation - Scroll Universal Animations
      const animateInUp = document.querySelectorAll(".anim-uni-in-up");
      animateInUp.forEach((element: Element) => {
        gsap.fromTo(element, {
          opacity: 0,
          y: 50,
          ease: 'sine',
        }, {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: element,
            toggleActions: 'play none none reverse',
          }
        });
      });

      const animateInUpFront = document.querySelectorAll(".anim-uni-scale-in");
      animateInUpFront.forEach((element: Element) => {
        gsap.fromTo(element, {
          opacity: 1,
          y: 50,
          scale: 1.2,
          ease: 'sine',
        }, {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: element,
            toggleActions: 'play none none reverse',
          }
        });
      });

      const animateInUpRight = document.querySelectorAll(".anim-uni-scale-in-right");
      animateInUpRight.forEach((element: Element) => {
        gsap.fromTo(element, {
          opacity: 1,
          y: 50,
          x: -70,
          scale: 1.2,
          ease: 'sine',
          duration: 5
        }, {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: element,
            toggleActions: 'play none none reverse',
          }
        });
      });

      const animateInUpLeft = document.querySelectorAll(".anim-uni-scale-in-left");
      animateInUpLeft.forEach((element: Element) => {
        gsap.fromTo(element, {
          opacity: 1,
          y: 50,
          x: 70,
          scale: 1.2,
          ease: 'sine',
        }, {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: element,
            toggleActions: 'play none none reverse',
          }
        });
      });

      // Grid Animations
      if(document.querySelector(".animate-card-2")) {
        gsap.set(".animate-card-2", {y: 50, opacity: 0});
        ScrollTrigger.batch(".animate-card-2", {
          interval: 0.1,
          batchMax: 2,
          duration: 3,
          onEnter: (batch: any) => gsap.to(batch, {
            opacity: 1, 
            y: 0,
            ease: 'sine',
            stagger: {each: 0.15, grid: [1, 2]}, 
            overwrite: true
          }),
          onLeave: (batch: any) => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
          onEnterBack: (batch: any) => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
          onLeaveBack: (batch: any) => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
        });
        ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-2", {y: 0, opacity: 1}));
      }

      if(document.querySelector(".animate-card-3")) {
        gsap.set(".animate-card-3", {y: 50, opacity: 0});
        ScrollTrigger.batch(".animate-card-3", {
          interval: 0.1,
          batchMax: 3,
          duration: 3,
          onEnter: (batch: any) => gsap.to(batch, {
            opacity: 1, 
            y: 0,
            ease: 'sine',
            stagger: {each: 0.15, grid: [1, 3]}, 
            overwrite: true
          }),
          onLeave: (batch: any) => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
          onEnterBack: (batch: any) => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
          onLeaveBack: (batch: any) => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
        });
        ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-3", {y: 0, opacity: 1}));
      }

      if(document.querySelector(".animate-card-4")) {
        gsap.set(".animate-card-4", {y: 50, opacity: 0});
        ScrollTrigger.batch(".animate-card-4", {
          interval: 0.1,
          batchMax: 4,
          delay: 1000,
          onEnter: (batch: any) => gsap.to(batch, {
            opacity: 1, 
            y: 0,
            ease: 'sine',
            stagger: {each: 0.15, grid: [1, 4]}, 
            overwrite: true
          }),
          onLeave: (batch: any) => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
          onEnterBack: (batch: any) => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
          onLeaveBack: (batch: any) => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
        });
        ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-4", {y: 0, opacity: 1}));
      }

      if(document.querySelector(".animate-card-5")) {
        gsap.set(".animate-card-5", {y: 50, opacity: 0});
        ScrollTrigger.batch(".animate-card-5", {
          interval: 0.1,
          batchMax: 5,
          delay: 1000,
          onEnter: (batch: any) => gsap.to(batch, {
            opacity: 1, 
            y: 0,
            ease: 'sine',
            stagger: {each: 0.15, grid: [1, 5]}, 
            overwrite: true
          }),
          onLeave: (batch: any) => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
          onEnterBack: (batch: any) => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
          onLeaveBack: (batch: any) => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
        });
        ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-5", {y: 0, opacity: 1}));
      }

      // Zoom In / Zoom Out Container Animations
      const docStyle = getComputedStyle(document.documentElement);
      const zoomInContainer = document.querySelectorAll(".anim-zoom-in-container");
      const zoomOutContainer = document.querySelectorAll(".anim-zoom-out-container");

      zoomInContainer.forEach((element: Element) => {
        const zoomInBlockTl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            end: "top 14%",
            scrub: {
              scrub: true, 
              ease: "power4.inOut" 
            },
          },
        });
        zoomInBlockTl.fromTo(element, {
          borderRadius: '200px',
          transform: "scale3d(0.94, 1, 1)"
        }, 
        {
          borderRadius: docStyle.getPropertyValue("--_radius-l"),
          transform: "scale3d(1, 1, 1)"
        });
      });

      zoomOutContainer.forEach((element: Element) => {
        const zoomOutBlockTl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            end: "top 14%",
            scrub: {
              scrub: true, 
              ease: "power4.inOut" 
            },
          },
        });
        zoomOutBlockTl.fromTo(element, {
          borderRadius: '200px',
          transform: "scale3d(1.14, 1, 1)"
        }, 
        {
          borderRadius: docStyle.getPropertyValue("--_radius-l"),
          transform: "scale3d(1, 1, 1)",
        });
      });

      // Swiper Sliders
      if (Swiper) {
        const testimonialsSlider = document.querySelector("testimonials-slider");
        if (!testimonialsSlider) {
          new Swiper('.swiper-testimonials', {
            slidesPerView: 'auto',
            grabCursor: true,
            spaceBetween: 30,
            autoplay: true,
            delay: 3000,
            speed: 1000,
            loop: true,
            parallax: true,
            loopFillGroupWithBlank: true,
            pagination: {
              el: ".swiper-pagination",
              type: "fraction",
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
        }

        const testimonialsSlider2 = document.querySelector("testimonials-slider-2");
        if (!testimonialsSlider2) {
          new Swiper('.swiper-testimonials-2', {
            slidesPerView: 1,
            grabCursor: true,
            effect: 'fade',
            spaceBetween: 30,
            autoplay: true,
            delay: 3000,
            speed: 1000,
            loop: true,
            parallax: true,
            loopFillGroupWithBlank: true,
            pagination: {
              el: ".swiper-pagination",
              type: "fraction",
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
        }

        const innerDemoSlider = document.querySelector("mxd-demo-swiper");
        if (!innerDemoSlider) {
          new Swiper('.mxd-demo-swiper', {
            breakpoints: {
              640: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1600: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            },
            loop: true,
            parallax: true,
            autoplay: { disableOnInteraction: false, enabled: true },
            grabCursor: true,
            speed: 600,
            centeredSlides: true,
            keyboard: { enabled: true },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
        }
      }

      // Marquee Animations
      const initMarquees = () => {
        const items = [...document.querySelectorAll(".marquee--gsap")];
        if (items) {
          const marqueeObject = {
            top: {
              el: null as any,
              width: 0
            },
            bottom: {
              el: null as any,
              width: 0
            }
          };
          items.forEach((itemBlock: Element) => {
            marqueeObject.top.el = itemBlock.querySelector(".marquee__top");
            marqueeObject.bottom.el = itemBlock.querySelector(".marquee__bottom");
            marqueeObject.top.width = marqueeObject.top.el.offsetWidth;
            marqueeObject.bottom.width = marqueeObject.bottom.el.offsetWidth;
            marqueeObject.top.el.innerHTML += marqueeObject.top.el.innerHTML;
            marqueeObject.bottom.el.innerHTML += marqueeObject.bottom.el.innerHTML;
            const dirFromLeft = "-=50%";
            const dirFromRight = "+=50%";
            const master = gsap
              .timeline()
              .add(marquee(marqueeObject.top.el, 30, dirFromLeft), 0)
              .add(marquee(marqueeObject.bottom.el, 30, dirFromRight), 0);
            const tween = gsap.to(master, { 
              duration: 1.5, 
              timeScale: 1, 
              paused: true 
            });
            const timeScaleClamp = gsap.utils.clamp(1, 6);
            ScrollTrigger.create({
              start: 0,
              end: "max",
              onUpdate: (self: any) => {
                master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
                tween.invalidate().restart();
              }
            });
          });
        }
      };

      const marquee = (item: any, time: number, direction: string) => {
        const mod = gsap.utils.wrap(0, 50);
        return gsap.to(item, {
          duration: time,
          ease: "none",
          x: direction,
          modifiers: {
            x: (x: string) => (direction = mod(parseFloat(x)) + "%")
          },
          repeat: -1
        });
      };

      initMarquees();

      // Marquee - One Line To Right
      const initMarquee = () => {
        const items = [...document.querySelectorAll(".marquee-right--gsap")];
        if (items.length) {
          const marqueeObject = {
            el: null as any,
            width: 0
          };
          items.forEach((itemBlock: Element) => {
            marqueeObject.el = itemBlock.querySelector(".marquee__toright");
            if (marqueeObject.el) {
              marqueeObject.width = marqueeObject.el.offsetWidth;
              marqueeObject.el.innerHTML += marqueeObject.el.innerHTML;
              const dirFromRight = "+=50%";
              const master = gsap
                .timeline()
                .add(marqueeRight(marqueeObject.el, 30, dirFromRight), 0);
              const tween = gsap.to(master, { 
                duration: 1.5, 
                timeScale: 1, 
                paused: true 
              });
              const timeScaleClamp = gsap.utils.clamp(1, 6);
              ScrollTrigger.create({
                start: 0,
                end: "max",
                onUpdate: (self: any) => {
                  master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
                  tween.invalidate().restart();
                }
              });
            }
          });
        }
      };

      const marqueeRight = (item: any, time: number, direction: string) => {
        const mod = gsap.utils.wrap(0, 50);
        return gsap.to(item, {
          duration: time,
          ease: "none",
          x: direction,
          modifiers: {
            x: (x: string) => (direction = mod(parseFloat(x)) + "%")
          },
          repeat: -1
        });
      };

      initMarquee();

      // Marquee - One Line To Left
      const initMarqueeLeft = () => {
        const items = [...document.querySelectorAll(".marquee-left--gsap")];
        if (items.length) {
          const marqueeObject = {
            el: null as any,
            width: 0
          };
          items.forEach((itemBlock: Element) => {
            marqueeObject.el = itemBlock.querySelector(".marquee__toleft");
            if (marqueeObject.el) {
              marqueeObject.width = marqueeObject.el.offsetWidth;
              marqueeObject.el.innerHTML += marqueeObject.el.innerHTML;
              const dirFromLeft = "-=50%";
              const master = gsap
                .timeline()
                .add(marquee(marqueeObject.el, 30, dirFromLeft), 0);
              const tween = gsap.to(master, { 
                duration: 1.5, 
                timeScale: 1, 
                paused: true 
              });
              const timeScaleClamp = gsap.utils.clamp(1, 6);
              ScrollTrigger.create({
                start: 0,
                end: "max",
                onUpdate: (self: any) => {
                  master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
                  tween.invalidate().restart();
                }
              });
            }
          });
        }
      };

      initMarqueeLeft();

      // SVG DOM Injection
      if (window.SVGInjector) {
        const mySVGsToInject = document.querySelectorAll('img.inject-me');
        const injectorOptions = {
          evalScripts: 'once',
          pngFallback: 'assets/png',
          each: function (svg: any) {
            // callback for each injected SVG
          }
        };
        window.SVGInjector(mySVGsToInject, injectorOptions, function (totalSVGsInjected: number) {
          console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
        });
      }

      // Color Switch
      const themeBtn = document.querySelector('#color-switcher');
      if (themeBtn) {
        function getCurrentTheme(){
          let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          const savedTheme = localStorage.getItem('template.theme');
          if (savedTheme) {
            theme = savedTheme;
          }
          return theme;
        }
        function loadTheme(theme: string){
          const root = document.querySelector(':root');
          if(theme === "light"){
            if (themeBtn) themeBtn.innerHTML = `<i class="ph-bold ph-moon-stars"></i>`;
          } else {
            if (themeBtn) themeBtn.innerHTML = `<i class="ph-bold ph-sun-horizon"></i>`;
          }
          root?.setAttribute('color-scheme', `${theme}`);
        };
        themeBtn.addEventListener('click', () => {
          let theme = getCurrentTheme();
          if(theme === 'dark'){
            theme = 'light';
          } else {
            theme = 'dark';
          }
          localStorage.setItem('template.theme', `${theme}`);
          loadTheme(theme);
        });
        loadTheme(getCurrentTheme());
      }

      // Scroll to Top Button
      const toTop = document.querySelector(".btn-to-top");
      if (toTop) {
        toTop.addEventListener("click", function(event: Event){
          event.preventDefault();
        });

        toTop.addEventListener("click", () => gsap.to(window, { 
          scrollTo: 0, 
          ease: 'power4.inOut',
          duration: 1.3,
        }));

        gsap.set(toTop, { opacity: 0 });

        gsap.to(toTop, {
          opacity: 1,
          autoAlpha: 1,
          scrollTrigger: {
            trigger: "body",
            start: "top -20%",
            end: "top -20%",
            toggleActions: "play none reverse none"
          }
        });
      }

      // Parallax Universal
      gsap.to("[data-speed]", {
        y: (i: number, el: any) => (1 - parseFloat(el.getAttribute("data-speed"))) * ScrollTrigger.maxScroll(window) ,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          invalidateOnRefresh: true,
          scrub: 0
        }
      });

      // Emoji Logo Rotation
      const emojis = [
        'emojis/1.png',
        'emojis/2.png', 
        'emojis/3.png',
        'emojis/4.png',
        'emojis/5.png'
      ];
      
      let currentEmojiIndex = 0;
      const emojiDisplay = document.getElementById('emoji-display');
      
      function changeEmoji() {
        if (emojiDisplay) {
          emojiDisplay.classList.add('changing');
          
          setTimeout(() => {
            currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length;
            (emojiDisplay as HTMLImageElement).src = emojis[currentEmojiIndex];
            
            setTimeout(() => {
              emojiDisplay.classList.remove('changing');
            }, 500);
          }, 250);
        }
      }

      if (emojiDisplay) {
        window.emojiInterval = setInterval(changeEmoji, 3000);
      }

      const emojiLogo = document.getElementById('emoji-logo');
      if (emojiLogo) {
        emojiLogo.addEventListener('mouseenter', () => {
          changeEmoji();
        });
      }

      // Detect Mobile/Desktop
      const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        $('html').addClass('touch');
      } else {
        $('html').addClass('no-touch');
      }

      // IE, Edge detection
      const isIE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d+/.test(navigator.userAgent);
      if (isIE) {
        $('html').addClass('is-ie');
      }

      // Refresh ScrollTrigger after initialization
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      console.log('AppInitializer: All animations and interactions initialized for', pathname);
    };

    // Initialize the app
    initializeApp();

    // Cleanup function
    return () => {
      // Clean up any event listeners or animations if needed
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
      if (window.emojiInterval) {
        clearInterval(window.emojiInterval);
        window.emojiInterval = null;
      }
      ScrollTrigger.killAll();
      
      // Remove jQuery event handlers
      if (typeof (window as any).$ !== 'undefined') {
        const $ = (window as any).$;
        $(window).off("scroll");
        $(".mxd-nav__hamburger").off("click");
        $(".mxd-accordion__title").off("click");
        $("#contact-form").off("submit");
        $('a[href*="#"]').off('click');
        $("img, a").off("dragstart");
      }
    };
  }, [pathname]); // Re-run when pathname changes

  return null; // This component doesn't render anything
} 