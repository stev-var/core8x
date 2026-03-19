import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowRight, ShieldCheck, Leaf, MessageCircle, Home, ShoppingCart, Mail, Phone, MapPin, Instagram, Play, CheckCircle2, ShieldAlert, Cpu, Star } from 'lucide-react';

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
  const [activeBrand, setActiveBrand] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/urbancave') || path.includes('/urbancurve') || path.includes('/urbancrave')) return 'urbancave';
    return 'split';
  });
  const containerRef = useRef(null);
  const coreRef = useRef(null);
  const urbanRef = useRef(null);
  const contentCoreRef = useRef(null);
  const contentUrbanRef = useRef(null);

  useEffect(() => {
    let lenis;
    let scrollerWrapper = null;
    let contentLayer = null;
    let lenisRaf;

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(max-width: 768px)").matches;
    if (!isTouchDevice) {
      if (activeBrand === 'core8x') scrollerWrapper = document.querySelector('.full-content.core');
      else if (activeBrand === 'urbancave') scrollerWrapper = document.querySelector('.full-content.urban');

      if (scrollerWrapper) {
        contentLayer = scrollerWrapper.children[0];
        scrollerWrapper.style.overflowY = 'hidden';
        lenis = new Lenis({
          wrapper: scrollerWrapper,
          content: contentLayer,
          lerp: 0.08,
          smooth: true,
        });

        lenis.on('scroll', ScrollTrigger.update);

        lenisRaf = function (time) {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(lenisRaf);
        gsap.ticker.lagSmoothing(0);

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
      }
    }

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

    return () => {
      mm.revert();
      if (lenis) {
        gsap.ticker.remove(lenisRaf);
        lenis.destroy();
        ScrollTrigger.scrollerProxy(scrollerWrapper, null);
        if (scrollerWrapper) scrollerWrapper.style.overflowY = 'auto';
      }
    };
  }, [activeBrand]);

  const handleBrandClick = (brand) => {
    if (activeBrand !== brand) {
      setActiveBrand(brand);

      const path = brand === 'urbancave' ? '/urbancrave' : '/';
      window.history.pushState({}, '', path);

      if (coreRef.current) coreRef.current.scrollTop = 0;
      if (urbanRef.current) urbanRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/urbancave') || path.includes('/urbancurve') || path.includes('/urbancrave')) setActiveBrand('urbancave');
      else setActiveBrand('split');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

            {/* Hero Section */}
            <div className="relative mb-4 md:mb-6">
              <h2 className="reveal-item text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white leading-tight">
                Don't Leave Your Car's <br className="hidden md:block"/>Safety to Chance. <br />
                <span className="text-[var(--color-fire-red)]">Protect What Matters.</span>
              </h2>
            </div>
            
            <p className="reveal-item text-lg md:text-2xl text-white/70 font-light max-w-3xl mb-10 md:mb-12 leading-relaxed">
              Introducing the World’s First Patented Brandsdaddy Car Auto Fire Extinguisher Capsule. Instant, automatic fire suppression that fits right under your bonnet.
            </p>
            
            <div className="reveal-item flex flex-col sm:flex-row gap-4 mb-20 md:mb-24">
              <a href="https://wa.me/919048443281?text=I'd like to get the Brandsdaddy Car Auto Fire Extinguisher Capsule." target="_blank" rel="noreferrer" className="bg-gradient-to-r from-[var(--color-fire-red)] to-red-900 text-white px-8 py-4 md:py-5 rounded-xl font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(211,47,47,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 clickable text-sm md:text-base">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" /> Secure Your Car Today
              </a>
              <a href="https://youtu.be/-qvKq1LhqGs?feature=shared" target="_blank" rel="noreferrer" className="glass border border-white/20 text-white px-8 py-4 md:py-5 rounded-xl font-bold uppercase tracking-wider hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 clickable text-sm md:text-base">
                <Play className="w-5 h-5 flex-shrink-0" /> Watch How It Works
              </a>
            </div>

            {/* Section 1: Problem & Solution */}
            <div className="reveal-item mb-20 md:mb-28 glass p-6 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-fire-red)]/10 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight relative z-10">
                Engine Fires Strike Without Warning. <br/><span className="text-white/50">Be Ready Before They Do.</span>
              </h3>
              <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed relative z-10 max-w-2xl">
                Every year, engine fire emergencies account for a massive percentage of vehicle accidents, causing irreversible damage to property and endangering lives. Traditional fire extinguishers are often bulky, hard to reach, or neglected until it’s too late.
              </p>
              <div className="border-l-4 border-[var(--color-fire-red)] pl-6 relative z-10">
                <h4 className="text-xl md:text-2xl font-bold text-white mb-3">The Core8x Solution</h4>
                <p className="text-white/80 font-light leading-relaxed text-sm md:text-base max-w-2xl">
                  We bring you the Brandsdaddy Car AFE (Auto Fire Extinguisher) Capsule—an <strong className="text-[var(--color-fire-red)] font-bold">"Inside Solution for an Inside Problem."</strong> Designed to be a compact, silent guardian, this capsule self-activates the moment a fire breaks out in your car’s engine, stopping the flames before they spread. No panic, no pulling pins, just pure protection.
                </p>
              </div>
            </div>

            {/* Section 2: Features & Benefits */}
            <div className="mb-20 md:mb-28 relative">
              <h3 className="reveal-item text-3xl md:text-5xl font-black uppercase text-white mb-10 md:mb-16 text-center">
                Why Choose the <span className="text-[var(--color-fire-red)]">Brandsdaddy</span> AFE Capsule?
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Instant Automatic Activation", desc: "Senses heat and activates automatically within 3 to 10 seconds of flame exposure. You don't even need to be present for it to work.", icon: <ShieldAlert className="w-8 h-8 text-[var(--color-fire-red)] mb-4" /> },
                  { title: "Effortless Self-Installation", desc: "Features a compact, magnetic, discreet design that seamlessly mounts under your car’s bonnet in seconds.", icon: <Cpu className="w-8 h-8 text-[var(--color-fire-red)] mb-4" /> },
                  { title: "Eco-Friendly & Non-Toxic", desc: "Safe for you, your vehicle, and the environment. Leaves no harmful residue and eliminates massive cleanup costs.", icon: <Leaf className="w-8 h-8 text-[var(--color-fire-red)] mb-4" /> },
                  { title: "Maintenance-Free for 3 Years", desc: "Install it and forget it. Zero servicing, zero refilling, and zero hidden maintenance costs for a full 3 years.", icon: <CheckCircle2 className="w-8 h-8 text-[var(--color-fire-red)] mb-4" /> },
                  { title: "Multi-Class Fire Protection", desc: "Effectively extinguishes Class A (Solid), B (Liquid), C (Combustible Gases), and E (Electrical) fires.", icon: <ShieldCheck className="w-8 h-8 text-[var(--color-fire-red)] mb-4" /> },
                  { title: "Certified Reliability & Free Insurance", desc: "ISO and CE-approved quality. Backed by Brandsdaddy's unmatched compensation warranty AND 3 full years of free comprehensive insurance.", icon: <Star className="w-8 h-8 text-[var(--color-fire-red)] mb-4" /> }
                ].map((feature, i) => (
                  <div key={i} className="reveal-item p-6 md:p-8 glass rounded-2xl border border-white/5 hover:border-[var(--color-fire-red)]/50 transition-colors group hover:-translate-y-2 duration-300 shadow-xl">
                    {feature.icon}
                    <h4 className="text-lg md:text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h4>
                    <p className="text-white/60 text-sm md:text-base leading-relaxed font-light">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: How It Works */}
            <div className="reveal-item mb-20 md:mb-28">
              <h3 className="text-3xl md:text-5xl font-black uppercase text-white mb-10 md:mb-16 text-center">
                Pure Innovation. <span className="text-[var(--color-fire-red)]">Zero Effort.</span>
              </h3>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Install in Seconds", desc: "Mount the compact capsule directly in high-risk areas like under the car bonnet or near battery compartments using the provided self-activating mount." },
                    { step: "02", title: "Automatic Detection", desc: "The capsule is designed to monitor the environment continuously." },
                    { step: "03", title: "Instant Suppression", desc: "When it detects sustained flames or critical temperatures, it bursts within 3–10 seconds, releasing a highly effective, eco-friendly fire-retardant powder (powered by MAP 90) that safely smothers the fire instantly." },
                    { step: "04", title: "Loud Audio Alert", desc: "Emits an 80 dB to 120 dB impulse noise upon activation to alert you and bystanders immediately." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 md:gap-6 group">
                      <div className="text-4xl md:text-5xl font-black text-[var(--color-fire-red)]/20 group-hover:text-[var(--color-fire-red)] transition-colors duration-500 mt-1">{item.step}</div>
                      <div>
                        <h4 className="text-xl md:text-2xl font-bold text-white mb-2">{item.title}</h4>
                        <p className="text-white/60 leading-relaxed font-light text-sm md:text-base">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative w-full h-[300px] md:h-full md:min-h-[500px] bg-black rounded-3xl overflow-hidden border border-white/10 group shadow-[0_0_50px_rgba(211,47,47,0.15)]">
                  <img src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800" alt="Engine Bay" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                    <div className="glass border border-[var(--color-fire-red)]/50 px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-mono text-[var(--color-fire-red)] mb-3 inline-block tracking-widest backdrop-blur-md">SYSTEM_READY</div>
                    <h4 className="text-xl md:text-3xl font-bold text-white drop-shadow-md">Passive Monitoring Active.</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Specs */}
            <div className="reveal-item mb-20 md:mb-28 glass p-6 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-2xl md:text-4xl font-black uppercase text-white mb-8 border-b border-white/10 pb-6">Built to Perform Under Pressure</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <tbody>
                    {[
                      ["Product Type", "Automatic Fire Suppression Capsule / Device"],
                      ["Activation Time", "3 - 10 seconds (with flame)"],
                      ["Fire Classes Covered", "A, B, C, E"],
                      ["Lifespan", "Up to 3 Years (Zero Maintenance)"],
                      ["Safety Certifications", "ISO & CE Approved"],
                      ["Audio Alert Signal", "~80 dB Impulse Noise upon activation"],
                      ["Ideal For", "Cars, SUVs, Trucks, EV Two/Three Wheelers, Buses"]
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-4 md:py-5 px-4 md:px-6 text-white/50 font-medium whitespace-nowrap text-sm md:text-base w-1/3">{row[0]}</td>
                        <td className="py-4 md:py-5 px-4 md:px-6 text-white font-bold text-sm md:text-base">{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5 & 6: Trust & Final CTA */}
            <div className="reveal-item mb-16 text-center">
              <div className="inline-block glass rounded-full px-6 py-2 border border-white/10 text-xs md:text-sm text-[var(--color-fire-red)] font-bold tracking-widest mb-6 uppercase shadow-lg">
                Trusted by Drivers Everywhere
              </div>
              <p className="text-xl md:text-3xl text-white/90 font-serif italic max-w-4xl mx-auto leading-relaxed mb-16 px-4">
                "I drive a lot for work, and having the Brandsdaddy capsule installed gives me total peace of mind. It takes up no space under the hood and knowing it works automatically is a game-changer."
              </p>
              
              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a0f0f] border border-[var(--color-fire-red)]/30 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(211,47,47,0.15)] group mx-auto max-w-4xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-[var(--color-fire-red)]/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-[var(--color-fire-red)]/20 transition-colors duration-1000"></div>
                <h3 className="relative z-10 text-3xl md:text-5xl font-black uppercase text-white mb-6 leading-tight">Upgrade Your Vehicle’s <br className="hidden md:block"/>Safety Today</h3>
                <p className="relative z-10 text-white/60 text-base md:text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                  Equip your car with the ultimate first line of defense against engine fires. Safe, smart, and fully automatic.
                </p>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="https://wa.me/919048443281?text=I'd like to get the Brandsdaddy Car Auto Fire Extinguisher Capsule." target="_blank" rel="noreferrer" className="bg-gradient-to-r from-[var(--color-fire-red)] to-red-900 text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-bold uppercase tracking-wider hover:scale-[1.03] transition-transform duration-300 shadow-2xl flex items-center justify-center gap-3 clickable text-sm md:text-base w-full sm:w-auto">
                    <ShoppingCart className="w-5 h-5 flex-shrink-0" /> Get Yours Now
                  </a>
                </div>
              </div>
            </div>

            {/* Core8x Contact Info */}
            <div className="reveal-item mt-12 md:mt-20 pt-8 md:pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-12 pb-20">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="text-xl md:text-3xl font-black uppercase text-white mb-6 tracking-widest">
                  Get in <span className="text-[var(--color-fire-red)]">Touch</span>
                </h3>
                <div className="flex flex-col gap-4 text-white/70 font-light text-sm md:text-base mb-8">
                  <a href="tel:+919048443281" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <Phone className="w-5 h-5 text-[var(--color-fire-red)] flex-shrink-0 group-hover:scale-110 transition-transform" /> 
                    <span>+91 9048443281</span>
                  </a>
                  <a href="mailto:contactcore8x@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <Mail className="w-5 h-5 text-[var(--color-fire-red)] flex-shrink-0 group-hover:scale-110 transition-transform" /> 
                    <span>contactcore8x@gmail.com</span>
                  </a>
                  <a href="https://www.google.com/maps/place/Anakkara,+Kerala,+India/@9.6687412,77.1391723,14z/data=!3m1!4b1!4m6!3m5!1s0x3b07aad01e8c6ff3:0x878a209abdcb4fbe!8m2!3d9.6646067!4d77.1657716!16s%2Fm%2F0dddj5h?entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <MapPin className="w-5 h-5 text-[var(--color-fire-red)] flex-shrink-0 group-hover:scale-110 transition-transform" /> 
                    <span>Anakkara, Kattapana, Idukki Kerala</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center bg-white/5 p-4 rounded-3xl border border-[var(--color-fire-red)]/30 shadow-[0_0_30px_rgba(211,47,47,0.1)] hover:border-[var(--color-fire-red)] hover:shadow-[0_0_40px_rgba(211,47,47,0.3)] transition-all duration-500 group group-card">
                <div className="bg-white p-2 md:p-3 rounded-2xl mb-3 shadow-inner">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=1&data=https%3A%2F%2Fwww.google.com%2Fmaps%2Fplace%2FAnakkara%2C%2BKerala%2C%2BIndia%2F%409.6687412%2C77.1391723%2C14z%2Fdata%3D%213m1%214b1%214m6%213m5%211s0x3b07aad01e8c6ff3%3A0x878a209abdcb4fbe%218m2%213d9.6646067%214d77.1657716%2116s%252Fm%252F0dddj5h%3Fentry%3Dttu%26g_ep%3DEgoyMDI2MDMxNS4wIKXMDSoASAFQAw%253D%253D" 
                    alt="Core8x Location QR Code" 
                    className="w-32 h-32 md:w-40 md:h-40 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <span className="text-xs md:text-sm text-[var(--color-fire-red)] tracking-wider uppercase font-bold">Scan for Location</span>
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
            <p className="text-sm md:text-lg font-bold text-[var(--color-warm-gold)] mb-6 md:mb-8 tracking-widest uppercase">
              Premium Spice Trading, Scaled.
            </p>
            <div className="glass px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center space-x-2 md:space-x-3 text-xs md:text-sm font-serif italic group-hover:bg-white/10 transition-colors border border-[var(--color-warm-gold)]/30">
              <span>B2B Partnerships</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-[var(--color-warm-gold)] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        <div className="full-content urban absolute inset-0 opacity-0 pointer-events-none p-6 md:p-24 overflow-y-auto pb-32 md:pb-40" style={{ perspective: '1000px' }}>
          <div className="max-w-4xl mx-auto pt-10 md:pt-20 relative">
            <div className="relative mb-4 md:mb-6 mt-4 md:mt-0">
              <h2 className="reveal-item text-5xl md:text-8xl font-serif text-white leading-tight drop-shadow-2xl">
                Premium Spice Trading,
                <br />
                <span className="text-[var(--color-warm-gold)] italic">Scaled.</span>
              </h2>
            </div>

            <p className="reveal-item text-lg md:text-2xl text-white/80 font-light max-w-2xl mb-8 md:mb-12 leading-relaxed">
              The search for export-grade spices ends here. We are officially open for B2B partnerships, specializing in the "Queen of Spices": Cardamom.
            </p>

            <div className="reveal-item relative w-full h-64 md:h-[500px] bg-black rounded-3xl overflow-hidden mb-12 md:mb-20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-spice-dark)]/90 via-[var(--color-spice-dark)]/20 to-transparent z-10 transition-opacity duration-700 group-hover:opacity-80"></div>
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1600"
                alt="Bulk Spices"
                className="parallax-bg absolute top-[-20%] left-0 w-full h-[140%] object-cover opacity-90 will-change-transform"
              />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 transition-transform duration-700 transform group-hover:-translate-y-2">
                <h3 className="text-3xl md:text-5xl font-serif italic text-[var(--color-warm-gold)] mb-2 md:mb-3 drop-shadow-xl">B2B Partnerships</h3>
                <p className="text-white/90 font-light text-sm md:text-xl tracking-wide drop-shadow-md">From distributors to commercial kitchens, we're here to elevate your inventory.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-20 relative">
              <div className="reveal-item p-6 md:p-10 glass bg-white/5 rounded-3xl border border-[var(--color-warm-gold)]/20 hover:bg-white/10 hover:border-[var(--color-warm-gold)]/50 transition-all duration-500 shadow-xl group">
                <h3 className="text-2xl md:text-3xl font-serif italic text-[var(--color-warm-gold)] mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                  <Leaf className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-500" />
                  Consistency is Everything
                </h3>
                <ul className="text-white/80 leading-relaxed font-light text-sm md:text-lg space-y-4">
                  <li><strong className="text-[var(--color-warm-gold)]">Premium Grade:</strong> Hand-selected for aroma & oil content.</li>
                  <li><strong className="text-[var(--color-warm-gold)]">Reliable Volume:</strong> Built for commercial demands.</li>
                  <li><strong className="text-[var(--color-warm-gold)]">Direct Sourcing:</strong> Transparent trading for better value.</li>
                </ul>
              </div>
              <div className="reveal-item p-6 md:p-10 glass bg-white/5 rounded-3xl border border-[var(--color-warm-gold)]/20 flex flex-col justify-center items-center text-center hover:bg-white/10 hover:border-[var(--color-warm-gold)]/50 transition-all duration-500 shadow-xl">
                <h3 className="text-2xl md:text-3xl font-serif italic mb-4 md:mb-6 text-white">Elevate Your Inventory</h3>
                <p className="text-white/70 mb-6 md:mb-8 font-light text-sm md:text-lg">Contact our wholesale team today for bulk pricing, samples, and partnership inquiries.</p>
                <a
                  href="https://wa.me/919048443281?text=I am interested in exploring a B2B wholesale partnership and would appreciate the opportunity to discuss potential collaboration."
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white px-6 md:px-8 py-4 md:py-5 rounded-full font-bold shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-[1.05] flex items-center space-x-2 md:space-x-3 clickable text-sm md:text-base w-full justify-center md:w-auto"
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-base md:text-lg">Contact Wholesale</span>
                </a>
              </div>
            </div>

            {/* Wholesale Products Selection */}
            <div className="mb-16 relative">
              <h3 className="reveal-item text-3xl md:text-5xl font-serif italic text-white mb-8 md:mb-12 text-center border-b border-white/10 pb-4 md:pb-6">Wholesale Catalog</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Export Grade Cardamom", weight: "8mm+", desc: "Jumbo pods, vivid green color", price: "Bulk Pricing", img: "/cardamom.png" },
                  { name: "Premium Cardamom", weight: "7-8mm", desc: "High aroma & volatile oil content", price: "Bulk Pricing", img: "/combo.png" },
                  { name: "A-Grade Black Pepper", weight: "A-Grade", desc: "Machine cleaned, sun-dried", price: "Bulk Pricing", img: "/pepper.png" },
                  { name: "B2B Sample Box", weight: "1kg Box", desc: "Quality testing sample batch", price: "Contact Us", img: "/combo.png" }
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
                          href={`https://wa.me/919048443281?text=I'd like to request wholesale pricing for: ${product.name}`}
                          target="_blank" rel="noreferrer"
                          className="bg-white/10 hover:bg-[#25D366] hover:text-white border border-white/20 hover:border-transparent px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 clickable flex items-center space-x-1 md:space-x-2 group/btn"
                        >
                          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:hidden" />
                          <MessageCircle className="w-3 h-3 md:w-4 md:h-4 hidden group-hover/btn:block" />
                          <span>Inquire</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UrbanCrave Contact Info */}
            <div className="reveal-item mt-12 md:mt-20 pt-8 md:pt-12 border-t border-[var(--color-warm-gold)]/20 flex flex-col md:flex-row items-center justify-center gap-12 pb-20">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="text-2xl md:text-4xl font-serif italic text-[var(--color-warm-gold)] mb-6 drop-shadow-md">
                  Reach UrbanCrave
                </h3>
                <div className="flex flex-col gap-4 text-white/80 font-light text-sm md:text-base mb-8">
                  <a href="tel:+919048443281" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <Phone className="w-5 h-5 text-[var(--color-warm-gold)] flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>+91 9048443281</span>
                  </a>
                  <a href="mailto:contactcore8x@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <Mail className="w-5 h-5 text-[var(--color-warm-gold)] flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>contactcore8x@gmail.com</span>
                  </a>
                  <a href="https://www.instagram.com/_urbancrave_?igsh=MXVjdzBmYXg5MzVqcg==" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <Instagram className="w-5 h-5 text-[var(--color-warm-gold)] flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>@_urbancrave_</span>
                  </a>
                  <a href="https://www.google.com/maps/place/Anakkara,+Kerala,+India/@9.6687412,77.1391723,14z/data=!3m1!4b1!4m6!3m5!1s0x3b07aad01e8c6ff3:0x878a209abdcb4fbe!8m2!3d9.6646067!4d77.1657716!16s%2Fm%2F0dddj5h?entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <MapPin className="w-5 h-5 text-[var(--color-warm-gold)] flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>Anakkara, Kattapana, Idukki Kerala</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center bg-white/5 p-4 rounded-3xl border border-[var(--color-warm-gold)]/30 shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:border-[var(--color-warm-gold)] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all duration-500 group group-card">
                <div className="bg-white p-2 md:p-3 rounded-2xl mb-3 shadow-inner">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=1&data=https%3A%2F%2Fwww.google.com%2Fmaps%2Fplace%2FAnakkara%2C%2BKerala%2C%2BIndia%2F%409.6687412%2C77.1391723%2C14z%2Fdata%3D%213m1%214b1%214m6%213m5%211s0x3b07aad01e8c6ff3%3A0x878a209abdcb4fbe%218m2%213d9.6646067%214d77.1657716%2116s%252Fm%252F0dddj5h%3Fentry%3Dttu%26g_ep%3DEgoyMDI2MDMxNS4wIKXMDSoASAFQAw%253D%253D"
                    alt="UrbanCrave Location QR Code"
                    className="w-32 h-32 md:w-40 md:h-40 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-xs md:text-sm text-[var(--color-warm-gold)] font-serif italic tracking-wider">Scan for Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
