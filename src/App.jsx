import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowRight, ShieldCheck, Leaf, MessageCircle, Home, ShoppingCart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MagneticCursor = () => {
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Fast tracking for smooth dual-pointer effect
      window.addEventListener('mousemove', (e) => {
        gsap.to(cursorDot.current, { x: e.clientX, y: e.clientY, duration: 0, ease: 'none' });
        gsap.to(cursorRing.current, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'expo.out' });
      });

      const interactables = document.querySelectorAll('button, a, .clickable, .product-card');
      interactables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          gsap.to(cursorDot.current, { scale: 0, opacity: 0, duration: 0.2 });
          gsap.to(cursorRing.current, { scale: 3.5, borderWidth: "1px", backgroundColor: "rgba(255,255,255,0.1)", duration: 0.4, ease: 'power4.out' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(cursorDot.current, { scale: 1, opacity: 1, duration: 0.2 });
          gsap.to(cursorRing.current, { scale: 1, borderWidth: "2px", backgroundColor: "transparent", duration: 0.4, ease: 'power4.out' });
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={cursorDot} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] opacity-90 hidden md:block" style={{ transform: 'translate(-50%, -50%)', mixBlendMode: 'difference' }}></div>
      <div ref={cursorRing} className="fixed top-0 left-0 w-10 h-10 border-2 border-white/50 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference" style={{ transform: 'translate(-50%, -50%)' }}></div>
    </>
  );
};

const App = () => {
  const [activeBrand, setActiveBrand] = useState('split'); // 'split', 'core8x', 'urbancave'
  const containerRef = useRef(null);
  const coreRef = useRef(null);
  const urbanRef = useRef(null);
  const contentCoreRef = useRef(null);
  const contentUrbanRef = useRef(null);

  useEffect(() => {
    let mm = gsap.matchMedia(containerRef);

    mm.add("all", () => {
      // Glancing Light / Shimmer Effect across the logo rings
      gsap.to('.shimmer', {
        left: '150%',
        duration: 1.5,
        repeat: -1,
        repeatDelay: 3.5,
        ease: 'power2.inOut'
      });
    });

    const initializeScrollAnimations = (selector, scrollerElement) => {
      const items = gsap.utils.toArray(`${selector} .reveal-item`);
      items.forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out',
            scrollTrigger: {
              trigger: item,
              scroller: scrollerElement,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      const products = gsap.utils.toArray(`${selector} .product-card`);
      if (products.length > 0) {
        gsap.set(products, { opacity: 0, y: 100, rotationX: 10 });
        ScrollTrigger.batch(products, {
          scroller: scrollerElement,
          start: "top 85%",
          onEnter: batch => gsap.to(batch, {
            opacity: 1, y: 0, rotationX: 0, duration: 1, ease: 'back.out(1.2)',
            stagger: 0.15, overwrite: true
          }),
          onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 100, rotationX: 10, overwrite: true })
        });
      }

      const images = gsap.utils.toArray(`${selector} .parallax-bg`);
      images.forEach((img) => {
        gsap.fromTo(img,
          { yPercent: -20 },
          {
            yPercent: 20, ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              scroller: scrollerElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      });

      // Ambient Scroll Progress Line attached to the entire container height
      const scrollerNode = document.querySelector(scrollerElement);
      if (scrollerNode && scrollerNode.children[0]) {
        gsap.fromTo(`${selector}-progress`,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: scrollerNode.children[0], // Tracks inner scroll bounds
              scroller: scrollerElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.2
            }
          }
        );
      }

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 850);
    };

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isMobile } = context.conditions;
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut', duration: 1 } });

      if (activeBrand === 'split') {
        tl.to(coreRef.current, {
          width: isMobile ? '100%' : '50%',
          height: isMobile ? '50%' : '100%',
          top: '0%', left: '0%', zIndex: 1
        }, 0)
          .to(urbanRef.current, {
            width: isMobile ? '100%' : '50%',
            height: isMobile ? '50%' : '100%',
            top: isMobile ? '50%' : '0%',
            left: isMobile ? '0%' : '50%',
            zIndex: 1
          }, 0)
          .to('.brand-content', { opacity: 1, scale: 1, duration: 0.8 }, 0.4)
          .to('.full-content', { opacity: 0, pointerEvents: 'none', y: 50, duration: 0.4 }, 0);
      } else if (activeBrand === 'core8x') {
        tl.to(coreRef.current, {
          width: '100%', height: '100%', top: '0%', left: '0%', zIndex: 10
        }, 0)
          .to(urbanRef.current, {
            width: isMobile ? '100%' : '0%',
            height: isMobile ? '0%' : '100%',
            top: isMobile ? '100%' : '0%',
            left: isMobile ? '0%' : '100%',
            zIndex: 1
          }, 0)
          .to(contentCoreRef.current, { opacity: 0, scale: 0.9, duration: 0.4 }, 0)
          .to('.full-content.core', { opacity: 1, pointerEvents: 'auto', y: 0, duration: 0.8 }, 0.6);

        initializeScrollAnimations('.core', '.full-content.core');
      } else if (activeBrand === 'urbancave') {
        tl.to(coreRef.current, {
          width: isMobile ? '100%' : '0%',
          height: isMobile ? '0%' : '100%',
          top: '0%', left: '0%', zIndex: 1
        }, 0)
          .to(urbanRef.current, {
            width: '100%', height: '100%', top: '0%', left: '0%', zIndex: 10
          }, 0)
          .to(contentUrbanRef.current, { opacity: 0, scale: 0.9, duration: 0.4 }, 0)
          .to('.full-content.urban', { opacity: 1, pointerEvents: 'auto', y: 0, duration: 0.8 }, 0.6);

        initializeScrollAnimations('.urban', '.full-content.urban');
      }
    });

    return () => mm.revert();
  }, [activeBrand]);

  useEffect(() => {
    // DO NOT run Lenis JS-smooth scroll on touch devices to preserve native mobile hardware scrolling
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(max-width: 768px)").matches;
    if (isTouchDevice) return;

    let lenis;
    let scrollerWrapper = null;
    let contentLayer = null;
    let rafId = null;

    if (activeBrand === 'core8x') scrollerWrapper = document.querySelector('.full-content.core');
    else if (activeBrand === 'urbancave') scrollerWrapper = document.querySelector('.full-content.urban');

    if (scrollerWrapper) {
      contentLayer = scrollerWrapper.children[0];
      // Switch to local Lenis logic
      scrollerWrapper.style.overflowY = 'hidden';
      lenis = new Lenis({
        wrapper: scrollerWrapper,
        content: contentLayer,
        lerp: 0.08,
        smooth: true,
      });

      lenis.on('scroll', ScrollTrigger.update);

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      ScrollTrigger.scrollerProxy(scrollerWrapper, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: scrollerWrapper.style.transform ? "transform" : "fixed"
      });
      ScrollTrigger.refresh();
    }

    return () => {
      if (lenis) {
        lenis.destroy();
        if (rafId) cancelAnimationFrame(rafId);
        ScrollTrigger.scrollerProxy(scrollerWrapper, null);
        if (scrollerWrapper) scrollerWrapper.style.overflowY = 'auto'; // restore
      }
    };
  }, [activeBrand]);

  const handleBrandClick = (brand) => {
    if (activeBrand !== brand) {
      setActiveBrand(brand);
      if (coreRef.current) coreRef.current.scrollTop = 0;
      if (urbanRef.current) urbanRef.current.scrollTop = 0;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] overflow-hidden bg-black text-white md:cursor-none">
      <MagneticCursor />
      <div className="core-progress fixed top-0 left-0 w-full h-1 md:h-1.5 bg-[var(--color-fire-red)] z-[9999] origin-left pointer-events-none scale-x-0 shadow-[0_0_10px_rgba(211,47,47,0.8)]"></div>
      <div className="urban-progress fixed top-0 left-0 w-full h-1 md:h-1.5 bg-[var(--color-warm-gold)] z-[9999] origin-left pointer-events-none scale-x-0 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>

      {/* Navigation Tabs - Floating */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-4 md:px-6 py-2 md:py-3 flex items-center space-x-3 md:space-x-6 shadow-2xl transition-all duration-500 whitespace-nowrap overflow-hidden max-w-[90vw]">
        <button
          onClick={() => handleBrandClick('split')}
          className={`clickable flex items-center space-x-2 transition-colors ${activeBrand === 'split' ? 'text-white' : 'text-white/50 hover:text-white'}`}
          title="Home"
        >
          <Home className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <div className="w-[1px] h-4 md:h-6 bg-white/20"></div>
        <button
          onClick={() => handleBrandClick('core8x')}
          className={`clickable font-sans tracking-widest text-xs md:text-sm font-bold transition-colors ${activeBrand === 'core8x' ? 'text-[var(--color-fire-red)]' : 'text-white/50 hover:text-white'}`}
        >
          Core8x
        </button>
        <div className="w-[1px] h-4 md:h-6 bg-white/20"></div>
        <button
          onClick={() => handleBrandClick('urbancave')}
          className={`clickable font-serif italic text-sm md:text-lg transition-colors ${activeBrand === 'urbancave' ? 'text-[var(--color-warm-gold)]' : 'text-white/50 hover:text-white'}`}
        >
          UrbanCrave
        </button>
      </div>

      {/* Core8x Panel */}
      <div
        ref={coreRef}
        className={`absolute top-0 left-0 w-full h-1/2 md:w-1/2 md:h-full overflow-x-hidden md:border-r border-b md:border-b-0 border-white/5 ${activeBrand === 'core8x' ? 'overflow-y-auto' : 'overflow-y-hidden'}`}
        style={{ 
          backgroundColor: '#0D1B2A',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(211, 47, 47, 0.12) 0%, transparent 60%)'
        }}
      >
        <div
          ref={contentCoreRef}
          className="brand-content absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center clickable"
          onClick={() => handleBrandClick('core8x')}
        >
          <div className="group relative cursor-pointer flex flex-col items-center w-full max-w-sm">
            <div
              className="relative w-48 h-48 md:w-80 md:h-80 mb-6 md:mb-8 flex justify-center items-center transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2 z-10"
              style={{
                WebkitMaskImage: 'radial-gradient(circle closest-side, black 65%, transparent 100%)',
                maskImage: 'radial-gradient(circle closest-side, black 65%, transparent 100%)'
              }}
            >
              <img
                src="/core8x-logo.jpg"
                alt="Core8x Logo"
                className="w-full h-full object-cover rounded-full z-10"
              />

              {/* Glancing Light Sheen over the metallic infinity rings */}
              <div
                className="shimmer absolute top-[-50%] left-[-150%] w-[100%] h-[200%] rotate-45 pointer-events-none z-20 mix-blend-overlay bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
              ></div>
            </div>
            <p className="text-sm md:text-2xl font-light text-white/70 mb-6 md:mb-8 md:tracking-wide">
              Automotive Safety Systems
            </p>
            <div className="glass px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center space-x-2 md:space-x-3 text-xs md:text-sm font-bold tracking-widest uppercase group-hover:bg-white/10 transition-colors">
              <span>Enter</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-[var(--color-fire-red)] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        <div className="full-content core absolute inset-0 opacity-0 pointer-events-none p-6 md:p-24 overflow-y-auto pb-32 md:pb-40" style={{ perspective: '1000px' }}>
          <div className="max-w-4xl mx-auto pt-10 md:pt-20 relative">

            <div className="relative mb-4 md:mb-6">
              <h2 className="reveal-item text-4xl md:text-8xl font-black uppercase text-white leading-none">
                Preventing <br />
                <span className="text-[var(--color-fire-red)]">The Unseen</span>
              </h2>
            </div>

            <p className="reveal-item text-lg md:text-2xl text-white/70 font-light max-w-2xl mb-8 md:mb-12">
              Next-generation under-bonnet fire extinguishing systems engineered for immediate suppression.
            </p>

            <div className="reveal-item relative w-full h-64 md:h-[500px] bg-black rounded-3xl overflow-hidden mb-12 md:mb-20 border border-white/10 group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1600"
                alt="Engine Bay"
                className="parallax-bg absolute top-[-20%] left-0 w-full h-[140%] object-cover opacity-60 mix-blend-luminosity will-change-transform"
              />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20">
                <div className="glass px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-mono text-[var(--color-fire-red)] mb-2 md:mb-4 inline-block shadow-lg border border-[var(--color-fire-red)]/30 backdrop-blur-xl">SYSTEM_ACTIVE</div>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Auto-Deploy Mechanism</h3>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
              <div className="reveal-item p-6 md:p-10 glass rounded-3xl border-l-4 border-l-[var(--color-fire-red)] hover:bg-white/5 transition-colors duration-500 shadow-xl">
                <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 uppercase flex items-center gap-3 md:gap-4">
                  <ShieldCheck className="text-[var(--color-fire-red)] w-6 h-6 md:w-8 md:h-8" />
                  Kerala Govt. Mandate
                </h3>
                <p className="text-white/70 leading-relaxed text-sm md:text-lg font-light">
                  Compliance ready. Our systems meet and exceed the strict mandatory requirements set by the Kerala Government for commercial vehicle safety. Focus on your journey, we focus on the protection.
                </p>
              </div>
              <div className="reveal-item p-6 md:p-10 glass rounded-3xl border border-white/5 flex flex-col justify-center items-start hover:bg-white/5 transition-colors duration-500 shadow-xl">
                <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 uppercase text-white">Secure Your Fleet Today</h3>
                <p className="text-white/60 mb-6 md:mb-8 font-light text-sm md:text-lg">Direct installation available across Kerala with certified professionals.</p>
                <button className="bg-gradient-to-r from-[var(--color-fire-red)] to-red-900 text-white px-6 md:px-8 py-4 md:py-5 rounded-xl font-bold uppercase tracking-wider hover:from-red-800 hover:to-red-950 transition-all duration-300 w-full flex justify-center items-center space-x-2 md:space-x-3 clickable shadow-[0_0_30px_rgba(211,47,47,0.5)] transform hover:scale-[1.02] text-sm md:text-base">
                  <span>Get Safety Quote</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UrbanCave Panel */}
      <div
        ref={urbanRef}
        className={`absolute top-1/2 md:top-0 left-0 md:left-1/2 w-full h-1/2 md:w-1/2 md:h-full bg-[var(--color-spice-dark)] overflow-x-hidden md:border-l border-white/5 ${activeBrand === 'urbancave' ? 'overflow-y-auto' : 'overflow-y-hidden'}`}
        style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)' }}
      >
        <div
          ref={contentUrbanRef}
          className="brand-content absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center clickable"
          onClick={() => handleBrandClick('urbancave')}
        >
          <div className="group relative cursor-pointer flex flex-col items-center w-full max-w-sm">
            <div
              className="relative w-56 h-56 md:w-96 md:h-96 mb-6 md:mb-8 flex justify-center items-center transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2 z-10"
              style={{
                WebkitMaskImage: 'radial-gradient(circle closest-side, black 65%, transparent 100%)',
                maskImage: 'radial-gradient(circle closest-side, black 65%, transparent 100%)'
              }}
            >
              {/* Native CSS Background Removal Trick using Screen Blending & Contrast filtering */}
              <img
                src="/urbancrave-logo.png"
                alt="Urban Crave Logo"
                className="w-full h-full object-cover rounded-full z-10 mix-blend-screen contrast-125 brightness-110 grayscale-[10%]"
              />

              <div
                className="shimmer absolute top-[-50%] left-[-150%] w-[100%] h-[200%] rotate-45 pointer-events-none z-20 mix-blend-overlay bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
              ></div>
            </div>
            <p className="text-sm md:text-2xl font-light text-[var(--color-warm-gold)] mb-6 md:mb-8">
              Premium Spices & Aromatics
            </p>
            <div className="glass px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center space-x-2 md:space-x-3 text-xs md:text-sm font-serif italic group-hover:bg-white/10 transition-colors border border-[var(--color-warm-gold)]/30">
              <span>Experience Now</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-[var(--color-warm-gold)] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        <div className="full-content urban absolute inset-0 opacity-0 pointer-events-none p-6 md:p-24 overflow-y-auto pb-32 md:pb-40" style={{ perspective: '1000px' }}>
          <div className="max-w-4xl mx-auto pt-10 md:pt-20 relative">
            <div className="relative mb-4 md:mb-6 mt-4 md:mt-0">
              <h2 className="reveal-item text-5xl md:text-8xl font-serif text-white leading-tight drop-shadow-2xl">
                Idukki's Finest
                <br />
                <span className="text-[var(--color-warm-gold)] italic">Cardamom & Pepper</span>
              </h2>
            </div>

            <p className="reveal-item text-lg md:text-2xl text-white/80 font-light max-w-2xl mb-8 md:mb-12 leading-relaxed">
              Handpicked from the mist-covered hills of Kerala, bringing authentic warmth and sensory delight right to your kitchen.
            </p>

            <div className="reveal-item relative w-full h-64 md:h-[500px] bg-black rounded-3xl overflow-hidden mb-12 md:mb-20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-spice-dark)]/90 via-[var(--color-spice-dark)]/20 to-transparent z-10 transition-opacity duration-700 group-hover:opacity-80"></div>
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1600"
                alt="Spices"
                className="parallax-bg absolute top-[-20%] left-0 w-full h-[140%] object-cover opacity-90 will-change-transform"
              />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 transition-transform duration-700 transform group-hover:-translate-y-2">
                <h3 className="text-3xl md:text-5xl font-serif italic text-[var(--color-warm-gold)] mb-2 md:mb-3 drop-shadow-xl">Sustainable Harvest</h3>
                <p className="text-white/90 font-light text-sm md:text-xl tracking-wide drop-shadow-md">Ethically sourced. Pure essence.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-20 relative">
              <div className="reveal-item p-6 md:p-10 glass bg-white/5 rounded-3xl border border-[var(--color-warm-gold)]/20 hover:bg-white/10 hover:border-[var(--color-warm-gold)]/50 transition-all duration-500 shadow-xl group">
                <h3 className="text-2xl md:text-3xl font-serif italic text-[var(--color-warm-gold)] mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                  <Leaf className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-500" />
                  Our Heritage
                </h3>
                <p className="text-white/80 leading-relaxed font-light text-sm md:text-lg">
                  We partner directly with generations of farmers in Idukki, ensuring zero adulteration and peak aroma in every single pod. Discover the true taste of pure, organically grown spices straight from nature's lap.
                </p>
              </div>
              <div className="reveal-item p-6 md:p-10 glass bg-white/5 rounded-3xl border border-[var(--color-warm-gold)]/20 flex flex-col justify-center items-center text-center hover:bg-white/10 hover:border-[var(--color-warm-gold)]/50 transition-all duration-500 shadow-xl">
                <h3 className="text-2xl md:text-3xl font-serif italic mb-4 md:mb-6 text-white">Direct from Farm to Home</h3>
                <p className="text-white/70 mb-6 md:mb-8 font-light text-sm md:text-lg">Skip the middleman. Chat directly with us to explore our fresh harvest collections.</p>
                <a
                  href="https://wa.me/911234567890?text=I-am-interested-in-your-premium-spices"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white px-6 md:px-8 py-4 md:py-5 rounded-full font-bold shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-[1.05] flex items-center space-x-2 md:space-x-3 clickable text-sm md:text-base w-full justify-center md:w-auto"
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-base md:text-lg">Contact us</span>
                </a>
              </div>
            </div>

            {/* Premium Products Selection */}
            <div className="mb-16 relative">
              <h3 className="reveal-item text-3xl md:text-5xl font-serif italic text-white mb-8 md:mb-12 text-center border-b border-white/10 pb-4 md:pb-6">Our Premium Selection</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Idukki Cardamom", weight: "300g", desc: "UrbanCrave Special Package", price: "₹1,200", img: "/cardamom.png" },
                  { name: "Black Pepper", weight: "300g", desc: "Hand-picked, sun-dried", price: "₹450", img: "/pepper.png" },
                  { name: "Combo Pack", weight: "500g", desc: "Premium mixed batch", price: "₹1,400", img: "/combo.png" },
                  { name: "Reserve Combo", weight: "1kg", desc: "Family reserve pack", price: "₹2,600", img: "/combo.png" }
                ].map((product, i) => (
                  <div key={i} className="product-card glass bg-white/5 rounded-2xl overflow-hidden border border-[var(--color-warm-gold)]/20 hover:border-[var(--color-warm-gold)] transition-all duration-500 group flex flex-col shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:-translate-y-2">
                    <div className="h-40 md:h-48 overflow-hidden relative">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 origin-center" />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-[var(--color-warm-gold)] border border-[var(--color-warm-gold)]/40 shadow-lg">
                        {product.weight}
                      </div>
                    </div>
                    <div className="p-5 md:p-6 flex flex-col flex-grow bg-gradient-to-t from-black/60 to-transparent">
                      <h4 className="text-lg md:text-xl font-serif text-[var(--color-warm-gold)] mb-1 md:mb-2 group-hover:text-white transition-colors">{product.name}</h4>
                      <p className="text-white/60 text-xs md:text-sm mb-auto">{product.desc}</p>
                      <div className="flex justify-between items-center mt-4 md:mt-6 pt-4 border-t border-white/10">
                        <span className="text-base md:text-lg font-bold text-white tracking-wider">{product.price}</span>
                        <a
                          href={`https://wa.me/911234567890?text=I'd like to order: ${product.name} (${product.weight})`}
                          target="_blank" rel="noreferrer"
                          className="bg-white/10 hover:bg-[#25D366] hover:text-white border border-white/20 hover:border-transparent px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 clickable flex items-center space-x-1 md:space-x-2 group/btn"
                        >
                          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:hidden" />
                          <MessageCircle className="w-3 h-3 md:w-4 md:h-4 hidden group-hover/btn:block" />
                          <span>Buy Now</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
