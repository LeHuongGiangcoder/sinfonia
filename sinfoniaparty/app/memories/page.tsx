"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { purgatory } from "@/lib/fonts";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function SimpleNavbar({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { name: "Home", href: "/?skipEntrance=true" },
    { name: "Gallery", href: "/?skipEntrance=true#gallery-section" },
    { name: "Venue", href: "/?skipEntrance=true#details-section" },
    { name: "Agenda", href: "/?skipEntrance=true#agenda-section" },
    { name: "Dress Code", href: "/?skipEntrance=true#dresscode-section" },
    { name: "About Us", href: "/about-us" },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${(scrolled || menuOpen) ? "bg-background/90 backdrop-blur-lg py-4 shadow-sm" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-8 flex-1">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-all hover:text-primary/100 ${scrolled ? "text-primary/70" : "text-white/70"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className={`flex-none transition-all duration-700 ${scrolled || menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
            <Link href="/?skipEntrance=true" className={`${purgatory.className} text-2xl md:text-3xl text-primary`}>
              The Sunset Sinfonia
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-end gap-8 flex-1">
            {navItems.slice(3).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-all hover:text-primary/100 ${scrolled ? "text-primary/70" : "text-white/70"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`${scrolled || menuOpen ? "text-primary" : "text-white"} transition-colors`}
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                  <path d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[90] bg-background flex flex-col items-center justify-center transition-all duration-700 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="space-y-12 text-center">
          {navItems.map((item, i) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block text-2xl font-display italic text-primary opacity-0 translate-y-8"
              style={{
                animation: menuOpen ? `hero-fade-up 0.8s ease-out ${0.1 + i * 0.1}s both` : "none"
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Memories() {
  const container = useRef<HTMLDivElement>(null);
  const envelopeSectionRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const envelopeBackRef = useRef<HTMLDivElement>(null);
  const envelopeFrontRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const letterFoldRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.setItem("skipEntrance", "true");
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    if (!envelopeSectionRef.current || !envelopeRef.current || !flapRef.current || !letterRef.current || !letterFoldRef.current || !ctaRef.current) return;

    // Initial states: letter is folded up
    gsap.set(letterFoldRef.current, { rotateX: 180 });
    gsap.set(letterRef.current, { y: 0, scale: 1, zIndex: 10 });
    gsap.set(flapRef.current, { rotateX: 0 });
    gsap.set(ctaRef.current, { opacity: 0, y: 0 }); 

    // 1. Pinning trigger: Keeps the section in place so the user can read the letter
    ScrollTrigger.create({
      trigger: envelopeSectionRef.current,
      start: "top top",
      end: "+=120%", 
      pin: true,
      anticipatePin: 1,
    });

    // 2. Auto-playing animation trigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: envelopeRef.current,
        start: "top 75%", 
        toggleActions: "play none none reverse", 
      }
    });

    // Step 1: Flap opens
    tl.to(flapRef.current, {
      rotateX: 180,
      duration: 0.8, // Slower, more elegant flap open
      ease: "power2.inOut",
    })
    // Step 2: Envelope falls away, letter pops to front, centers, and scales up
    .set(letterRef.current, { zIndex: 40 })
    .to([envelopeBackRef.current, envelopeFrontRef.current, flapRef.current], {
      y: '60vh',
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
    }, "+=0.1")
    .to(letterRef.current, {
      y: -110, // Move up to keep the unfolded A4 letter centered
      scale: 1.15,
      duration: 1.0, // Slower scale and position
      ease: "power3.out",
    }, "<")
    // Step 3: Letter unfolds downwards!
    .to(letterFoldRef.current, {
      rotateX: 0,
      duration: 1.4, // Much slower, elegant unfold
      ease: "back.out(1.0)", // Reduced the bounce slightly for elegance
    }, "-=0.3")
    // Step 4: CTA fades in and moves down enough to clear the massive A4 letter
    .fromTo(ctaRef.current, 
      { opacity: 0, y: 0 },
      {
        opacity: 1,
        y: 180, // Push it down below the expanded letter
        duration: 0.8, // Slower CTA fade in
        ease: "power3.out",
      }, "-=0.6"
    );

    // Hero title entrance
    gsap.from(".memories-hero-title", {
      y: 30,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.3,
    });

    gsap.from(".memories-hero-sub", {
      y: 20,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.8,
    });

    gsap.from(".memories-scroll-hint", {
      opacity: 0,
      y: 10,
      duration: 0.8,
      ease: "power2.out",
      delay: 1.5,
    });

  }, { scope: container });

  const renderLetterContent = (positionClass: string) => (
    <div className={`absolute left-0 right-0 h-[440px] md:h-[600px] flex flex-col justify-center items-center px-6 md:px-10 z-10 text-center ${positionClass}`}>
      <h3 className="text-[11.5px] md:text-base uppercase tracking-[0.25em] font-bold" style={{ color: '#5a6108' }}>
        ✨ Thank You Party People ✨
      </h3>
      <div className="w-16 h-[0.5px] bg-primary/30 mx-auto mt-4 mb-4"></div>
      <div className="space-y-3.5 md:space-y-5">
        <p className="text-[11px] md:text-[14px] text-primary/80 leading-[1.65] font-light">
          BTC THE SUNSET SINFONIA xin gửi lời cảm ơn thật lớn đến tất cả anh/chị đã cùng chúng tôi tạo nên một buổi tối hôm qua quá sức bùng nổ!
        </p>
        <p className="text-[11px] md:text-[14px] text-primary/80 leading-[1.65] font-light">
          Những cuộc trò chuyện rôm rả, những chiếc ly nâng cùng nhau, những tiếng cười vang khắp không gian cho đến sân khấu DJ cạnh hồ bơi &quot;nóng&quot; hơn cả thời tiết mùa hè — tất cả đã tạo nên một đêm THE SUNSET SINFONIA rất trọn vẹn.
        </p>
        <p className="text-[11px] md:text-[14px] text-primary/80 leading-[1.65] font-light">
          Cảm ơn vì đã dành thời gian đến, đã cùng tạo ra những khoảnh khắc quá đẹp và một chiếc vibe rất đáng nhớ cho THE SUNSET SINFONIA. Hẹn gặp lại ở những lần sau — nhưng lần tới nhớ giữ sức một chút vì mọi người vào mood nhanh quá tụi mình theo không kịp🤍
        </p>
      </div>
    </div>
  );

  return (
    <div ref={container} className="min-h-screen bg-background text-foreground">
      <SimpleNavbar scrolled={scrolled} />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden bg-[#0a0a0a]">
        <img
          src="/assets/thankyou%20background.png"
          alt="Our Memories"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-6">
          <p className="memories-hero-title text-[10px] uppercase tracking-[0.5em] font-medium !text-white/80">
            The Sunset Sinfonia
          </p>
          <h1
            className={`memories-hero-title ${purgatory.className} text-5xl md:text-7xl lg:text-8xl lowercase tracking-tight leading-[0.9]`}
            style={{ color: '#ffffff' }}
          >
            Our Memories
          </h1>
          <div className="memories-hero-sub flex flex-col items-center gap-2 pt-4">
            <p className="text-white/60 text-sm font-light tracking-wide">
              Scroll down to open your letter
            </p>
          </div>
        </div>

        <div className="memories-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <div className="w-5 h-8 border-[1.2px] border-white/30 rounded-full relative">
            <div className="absolute left-1/2 top-2 -translate-x-1/2 w-[1.5px] h-[4px] bg-white/60 rounded-full animate-wheel-scroll"></div>
          </div>
          <div className="w-[1px] h-10 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="absolute top-0 left-0 w-full h-1/2 animate-scroll-down"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent)' }}
            ></div>
          </div>
        </div>
      </section>

      {/* Envelope Section */}
      <section
        ref={envelopeSectionRef}
        className="relative bg-background flex flex-col items-center justify-center overflow-hidden min-h-screen py-20 md:py-64"
      >
        <div className="absolute -top-10 -right-10 opacity-[0.18] pointer-events-none rotate-[165deg] hidden md:block">
          <img src="/assets/component/18.svg" className="w-[22rem] h-[22rem]" alt="" />
        </div>
        <div className="absolute -bottom-16 -left-16 opacity-[0.18] pointer-events-none rotate-[-15deg] hidden md:block">
          <img src="/assets/component/20.svg" className="w-[22rem] h-[22rem]" alt="" />
        </div>
        <div className="absolute -top-8 -right-8 opacity-[0.15] pointer-events-none rotate-[150deg] md:hidden">
          <img src="/assets/component/18.svg" className="w-40 h-40" alt="" />
        </div>

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full flex flex-col items-center">
          <div
            ref={envelopeRef}
            className="relative w-[340px] h-[240px] md:w-[500px] md:h-[350px] mx-auto z-20"
            style={{ perspective: "1200px" }}
          >
            {/* 1. Envelope Back */}
            <div ref={envelopeBackRef} className="absolute inset-0 rounded-md overflow-hidden shadow-2xl shadow-primary/10 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5a6108] via-[#4b5006] to-[#3d4205]"></div>
              <div className="absolute inset-[3px] bg-gradient-to-br from-[#e8e2c8]/90 via-[#f3ede1]/80 to-[#e8e2c8]/90 rounded-sm">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, #4b5006 8px, #4b5006 9px)' }}></div>
              </div>
            </div>

            {/* 2. Letter Wrapper (A4 Paper unfolding) */}
            <div
              ref={letterRef}
              className="absolute left-[4%] right-[4%] top-[10px] md:top-[25px] z-10 flex flex-col"
              style={{ perspective: "1500px" }}
            >
              {/* Top Half of A4 */}
              <div 
                className="w-full bg-[#faf8f0] rounded-t-[4px] border-t border-l border-r border-primary/20 relative z-20 h-[220px] md:h-[300px] overflow-hidden"
                style={{ boxShadow: "0 -4px 15px rgba(0,0,0,0.04)" }}
              >
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)"/%3E%3C/svg%3E')` }}></div>
                
                {renderLetterContent('top-0')}
              </div>

              {/* Bottom Half of A4 (Folds Down) */}
              <div
                ref={letterFoldRef}
                className="w-full relative z-10 h-[220px] md:h-[300px]"
                style={{
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                }}
              >
                 {/* Back of fold (visible when folded UP inside envelope) */}
                 <div className="absolute inset-0 bg-[#f5f2e6] rounded-b-[4px] border-b border-l border-r border-primary/10 shadow-inner" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}>
                   <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)"/%3E%3C/svg%3E')` }}></div>
                   <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary/10"></div>
                 </div>

                 {/* Front of fold (Inside text, visible when unfolded) */}
                 <div 
                   className="absolute inset-0 bg-[#faf8f0] rounded-b-[4px] border-b border-l border-r border-primary/20 overflow-hidden"
                   style={{ backfaceVisibility: 'hidden', boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
                 >
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)"/%3E%3C/svg%3E')` }}></div>
                    
                    {/* Seamless Crease Line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-black/5 z-20"></div> 
                    <div className="absolute top-[1px] left-0 right-0 h-[1px] bg-white/60 z-20"></div> 
                    <div className="absolute top-[2px] left-0 right-0 h-6 bg-gradient-to-b from-black/[0.03] to-transparent z-20 pointer-events-none"></div>
                    
                    {renderLetterContent('top-[-220px] md:top-[-300px]')}
                 </div>
              </div>
            </div>

            {/* 3. Envelope Front V-fold */}
            <div ref={envelopeFrontRef} className="absolute inset-0 z-20 pointer-events-none rounded-md overflow-hidden">
               <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)', background: '#4b5006' }}></div>
               <div className="absolute inset-0" style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)', background: '#454a05' }}></div>
               <div className="absolute inset-0" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)', background: 'linear-gradient(to top, #3d4205, #515607)' }}></div>
            </div>

            {/* 4. Envelope Flap */}
            <div
              ref={flapRef}
              className="absolute top-0 left-0 right-0 h-[55%] z-30 pointer-events-none"
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  background: 'linear-gradient(to bottom, #5a6108, #4b5006)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="absolute inset-0 opacity-30" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)', background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
              </div>
              <div
                className="absolute inset-0"
                style={{
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  background: 'linear-gradient(to bottom, #e8e2c8, #f3ede1)',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, #4b5006 8px, #4b5006 9px)' }}></div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div ref={ctaRef} className="mt-8 md:mt-12 flex flex-col items-center gap-6 relative z-50">
            <div className="w-12 h-[0.5px] bg-primary/30 mx-auto"></div>
            <p className="text-primary/50 text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">
              Những khoảnh khắc đáng nhớ
            </p>
            <a
              href="https://drive.google.com/drive/folders/1yHH7emwiWFiSngpBeQh9lWFqaZZ6eWl1?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-primary/40 via-[#6b7210]/30 to-primary/40 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-button-glow"></div>
              <div className="relative px-8 py-3.5 md:px-10 md:py-4 rounded-full bg-gradient-to-r from-[#5a6108] via-[#6b7210] to-[#5a6108] text-[#f3ede1] font-semibold text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-3 group-hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(75,80,6,0.2)] group-hover:shadow-[0_0_50px_rgba(75,80,6,0.35)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 md:w-5 md:h-5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span>Xem Kho Ảnh</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </div>
            </a>
            <div className="flex items-center gap-2 opacity-40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-primary animate-pointing-hand">
                <path d="M12 10V4a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v7" />
                <path d="M12 10a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
                <path d="M16 12a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
                <path d="M20 14a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
                <path d="M12 22h4a8 8 0 0 0 8-8v-2" />
                <path d="M6 10l-3 3a2 2 0 0 0 0 2.8l4 4a8 8 0 0 0 5 2.2" />
              </svg>
              <span className="text-[10px] text-primary tracking-[0.15em] uppercase">Nhấn để xem ảnh</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background flex flex-col items-center justify-center border-t border-primary/10 relative z-50">
        <Link href="/?skipEntrance=true" className="group flex flex-col items-center gap-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-primary group-hover:-translate-y-1 transition-transform duration-500">
            <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 group-hover:text-primary transition-colors duration-500">
            Back to Home
          </span>
        </Link>
      </section>
    </div>
  );
}
