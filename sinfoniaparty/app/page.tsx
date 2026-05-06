"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { purgatory } from "@/lib/fonts";
import Entrance from "@/components/Entrance";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// --- Sub-component: InstagramPost ---
function InstagramPost({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDoubleClick = () => {
    if (!heartRef.current) return;
    const tl = gsap.timeline();
    tl.set(heartRef.current, { scale: 0, opacity: 0, display: "flex" })
      .to(heartRef.current, { scale: 1.2, opacity: 0.9, duration: 0.3, ease: "back.out(1.7)" })
      .to(heartRef.current, { scale: 1, duration: 0.1 })
      .to(heartRef.current, {
        opacity: 0, scale: 1.5, duration: 0.4, delay: 0.3, ease: "power2.in", onComplete: () => {
          gsap.set(heartRef.current, { display: "none" });
        }
      });
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] overflow-hidden bg-primary/5 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIndex((prev) => (prev + 1) % images.length)}
      onDoubleClick={handleDoubleClick}
    >
      {/* Images */}
      <div className="absolute inset-0 flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((src, i) => (
          <img key={i} src={`/assets/${src}`} className="w-full h-full object-cover shrink-0" alt="Post" />
        ))}
      </div>

      {/* Navigation Arrows */}
      {isHovered && images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute hidden md:flex left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md items-center justify-center text-white z-10 hover:bg-white/40 transition-colors"
          >
            <span className="sr-only">Previous</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute hidden md:flex right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md items-center justify-center text-white z-10 hover:bg-white/40 transition-colors"
          >
            <span className="sr-only">Next</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === index ? "bg-white scale-110" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}

      {/* Heart React Animation */}
      <div ref={heartRef} className="absolute inset-0 hidden items-center justify-center pointer-events-none z-20">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-white drop-shadow-2xl">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.716 3.99 1.954a4.41 4.41 0 01.101-.132C12.54 3.716 14.029 3 15.586 3 18.37 3 20.75 5.322 20.75 8.25c0 3.924-2.438 7.11-4.73 9.27a25.115 25.115 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>

      {/* Instagram Carousel Icon (top right) */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 text-white z-10 drop-shadow-md">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M19 8H8a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V10a2 2 0 00-2-2z" />
            <path d="M5 16H3a2 2 0 01-2-2V3a2 2 0 012-2h11a2 2 0 012 2v2" />
          </svg>
        </div>
      )}
    </div>
  );
}

// --- Sub-component: NavigationHint ---
function NavigationHint({ text, isVisible }: { text: string; isVisible: boolean }) {
  const handRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !handRef.current || !isVisible) return;

    gsap.set(handRef.current, { opacity: 0, y: 30, scale: 0.8 });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 60%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ delay: 0.5 });
        tl.to(handRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" })
          .to(handRef.current, { scale: 0.85, duration: 0.1, repeat: 1, yoyo: true }, "+=0.2")
          .to(handRef.current, { opacity: 0, y: -20, duration: 0.6, ease: "power2.in" }, "+=2.5");
      }
    });
  }, { scope: containerRef, dependencies: [isVisible] });

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div ref={handRef} className="flex flex-col items-center gap-3">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-16 h-16">
            <path d="M12 10V4a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v7" />
            <path d="M12 10a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
            <path d="M16 12a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
            <path d="M20 14a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
            <path d="M12 22h4a8 8 0 0 0 8-8v-2" />
            <path d="M6 10l-3 3a2 2 0 0 0 0 2.8l4 4a8 8 0 0 0 5 2.2" />
          </svg>
          <div className="absolute top-0 right-0 w-6 h-6 border-2 border-white rounded-full animate-ping opacity-75"></div>
        </div>
        <p className="text-[11px] text-white font-medium uppercase tracking-[0.25em] bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
          {text}
        </p>
      </div>
    </div>
  );
}

// --- Sub-component: GalleryHint ---
function GalleryHint() {
  const handRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !handRef.current) return;

    gsap.set(handRef.current, { opacity: 0, y: 30, scale: 0.8 });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 60%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ delay: 0.5 });
        tl.to(handRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" })
          .to(handRef.current, { scale: 0.85, duration: 0.1, repeat: 1, yoyo: true }, "+=0.2")
          .to(handRef.current, { x: 15, duration: 0.3, repeat: 1, yoyo: true, ease: "power2.inOut" }, "+=0.3")
          .to(handRef.current, { opacity: 0, y: -20, duration: 0.6, ease: "power2.in" }, "+=1");
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div ref={handRef} className="flex flex-col items-center gap-3">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-16 h-16 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <path d="M12 10V4a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v7" />
            <path d="M12 10a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
            <path d="M16 12a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
            <path d="M20 14a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
            <path d="M12 22h4a8 8 0 0 0 8-8v-2" />
            <path d="M6 10l-3 3a2 2 0 0 0 0 2.8l4 4a8 8 0 0 0 5 2.2" />
          </svg>
          <div className="absolute top-0 right-0 w-6 h-6 border-2 border-white rounded-full animate-ping opacity-75"></div>
        </div>
        <p className="text-[11px] text-white font-medium uppercase tracking-[0.25em] bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
          Double tap to react
        </p>
      </div>
    </div>
  );
}

// --- Sub-component: ContactCard (Instagram Style) ---
function ContactCard({ images, unit, rep, role, phone, intro, link }: {
  images: string[];
  unit: string;
  rep: string;
  role: string;
  phone: string;
  intro: string;
  link?: string;
}) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);

  const next = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIndex((prev) => (prev + 1) % 2);
  };

  const prev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIndex((prev) => (prev - 1 + 2) % 2);
  };

  const handleDoubleClick = () => {
    if (!heartRef.current) return;
    const tl = gsap.timeline();
    tl.set(heartRef.current, { scale: 0, opacity: 0, display: "flex" })
      .to(heartRef.current, { scale: 1.2, opacity: 0.9, duration: 0.3, ease: "back.out(1.7)" })
      .to(heartRef.current, { scale: 1, duration: 0.1 })
      .to(heartRef.current, {
        opacity: 0, scale: 1.5, duration: 0.4, delay: 0.3, ease: "power2.in", onComplete: () => {
          gsap.set(heartRef.current, { display: "none" });
        }
      });
  };

  return (
    <div
      className="relative aspect-square md:aspect-[4/5] bg-white overflow-hidden group border border-primary/5 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => next()}
      onDoubleClick={handleDoubleClick}
    >
      {/* Slides */}
      <div className="absolute inset-0 flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {/* Slide 1: Rep Photo */}
        <div className="w-full h-full shrink-0 relative">
          <img
            src={`/assets/${images[0]}`}
            className={`w-full h-full object-cover ${images[0].includes('nhat linh') ? 'scale-105' : ''}`}
            alt={rep}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-left text-white">
            <p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-80 mb-1">{unit}</p>
            <h3 className="heading-md text-2xl font-bold !text-white">{rep}</h3>
            <p className="text-xs font-medium opacity-100 mt-1">{phone}</p>
            <p className="text-[10px] font-medium opacity-70 mt-0.5">{role}</p>
          </div>
        </div>

        {/* Slide 2: Info & Link */}
        <div className="w-full h-full shrink-0 flex flex-col items-center justify-center p-8 bg-primary text-center text-white">
          <h3 className="heading-md text-2xl mb-2">{unit}</h3>
          <div className="w-8 h-[1px] bg-white/20 mb-6"></div>
          <p className="text-sm font-light leading-relaxed mb-8 opacity-90 italic">
            "{intro}"
          </p>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-6 py-2.5 border border-white/30 text-white text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-500"
            >
              Ghé thăm Fanpage
            </a>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {isHovered && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-10 hover:bg-white/40 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-10 hover:bg-white/40 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {[0, 1].map((i) => (
          <div key={i} className={`w-1 h-1 rounded-full transition-all duration-300 ${i === index ? "bg-white scale-125" : "bg-white/40"}`} />
        ))}
      </div>

      {/* Heart React Animation */}
      <div ref={heartRef} className="absolute inset-0 hidden items-center justify-center pointer-events-none z-20">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-white drop-shadow-2xl">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.716 3.99 1.954a4.41 4.41 0 01.101-.132C12.54 3.716 14.029 3 15.586 3 18.37 3 20.75 5.322 20.75 8.25c0 3.924-2.438 7.11-4.73 9.27a25.115 25.115 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>

      {/* Instagram Carousel Icon */}
      <div className="absolute top-3 right-3 text-white z-10 drop-shadow-md opacity-70">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M19 8H8a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V10a2 2 0 00-2-2z" /><path d="M5 16H3a2 2 0 01-2-2V3a2 2 0 012-2h11a2 2 0 012 2v2" />
        </svg>
      </div>
    </div>
  );
}

// --- Sub-component: Navbar ---
function Navbar({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { name: "Venue", href: "#details-section" },
    { name: "Agenda", href: "#agenda-section" },
    { name: "Gallery", href: "#gallery-section" },
    { name: "Dress Code", href: "#dresscode-section" },
    { name: "RSVP", href: "#rsvp-section" },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${scrolled || menuOpen ? "bg-background/90 backdrop-blur-lg py-4 shadow-sm" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Desktop Navigation Left */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            {navItems.slice(0, 2).map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-all hover:text-primary/100 ${scrolled ? "text-primary/70" : "text-white/70"}`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Brand Logo - Centered */}
          <div className={`flex-none transition-all duration-700 ${scrolled || menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
            <a href="#" className={`${purgatory.className} text-2xl md:text-3xl text-primary`}>
              The Sunset Sinfonia
            </a>
          </div>

          {/* Desktop Navigation Right */}
          <div className="hidden md:flex items-center justify-end gap-8 flex-1">
            {navItems.slice(2).map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-all hover:text-primary/100 ${scrolled ? "text-primary/70" : "text-white/70"}`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] bg-background flex flex-col items-center justify-center transition-all duration-700 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="space-y-12 text-center">
          {navItems.map((item, i) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block text-2xl font-display italic text-primary opacity-0 translate-y-8"
              style={{
                animation: menuOpen ? `hero-fade-up 0.8s ease-out ${0.1 + i * 0.1}s both` : "none"
              }}
            >
              {item.name}
            </a>
          ))}
        </div>


      </div>
    </>
  );
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const agendaTrigger = useRef<HTMLDivElement>(null);
  const dresscodeTrigger = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [activeAgenda, setActiveAgenda] = useState<number | null>(null);
  const [activeDresscode, setActiveDresscode] = useState(0);
  const [showAgendaHint, setShowAgendaHint] = useState(true);
  const [showDresscodeHint, setShowDresscodeHint] = useState(true);
  const [showContactHint, setShowContactHint] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    confirmation: "",
    meal_preference: "",
    note: ""
  });

  // Handle scroll for Navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const agendaData = [
    {
      time: "12:00",
      title: "CHECK IN",
      location: "Lobby Lounge",
      details: [],
      coords: { x: 63, y: 56, scale: 2 }
    },
    {
      time: "14:30",
      title: "TEA BREAK",
      location: "Sinfonia Garden",
      details: [],
      coords: { x: 75, y: 15, scale: 2.2 }
    },
    {
      time: "15:00",
      title: "WELCOME + WORKSHOP",
      location: "Grand Ballroom",
      details: ["Khai mạc", "Workshop"],
      coords: { x: 63, y: 56, scale: 2 }
    },
    {
      time: "16:30",
      title: "CATCH THE SUN",
      location: "Sunset Terrace",
      details: ["Cocktail", "Live music"],
      coords: { x: 75, y: 15, scale: 2.2 }
    },
    {
      time: "18:30",
      title: "A SKY FULL OF STARS",
      location: "Starlight Dining",
      details: ["Dinner", "Drinking game"],
      coords: { x: 75, y: 15, scale: 2.2 }
    },
    {
      time: "20:30",
      title: "MIDNIGHT REVERIE",
      location: "Infinity Pool",
      details: ["Fireworks", "DJ", "Pool Party"],
      coords: { x: 63, y: 56, scale: 2 }
    },
  ];

  const dresscodeData = [
    {
      title: "Welcoming",
      subtitle: "Đón khách",
      women: "Váy lụa",
      men: "Vest / Blazer",
      womenImg: "/assets/dresscode%20webp/women%201.webp",
      menImg: "/assets/dresscode%20webp/men%202.webp",
      palette: {
        women: ["#FCE4EC", "#FFF9C4", "#E1BEE7", "#FFFFFF"],
        men: ["#F5F5DC", "#D2B48C", "#4E342E", "#FFFFFF"]
      }
    },
    {
      title: "Dinner",
      subtitle: "Tiệc tối",
      women: "Đầm dạ hội",
      men: "Suit / Tuxedo",
      womenImg: "/assets/dresscode%20webp/women%203.webp",
      menImg: "/assets/dresscode%20webp/men%203.webp",
      palette: {
        women: ["#556B2F", "#1A1A1A", "#8B4513", "#FFFFFF"],
        men: ["#556B2F", "#1A1A1A", "#333333", "#FFFFFF"]
      }
    },
    {
      title: "After Party",
      subtitle: "Tiệc hồ bơi",
      women: "Trang phục hồ bơi / Bikini",
      men: "Quần short / Trang phục bơi",
      womenImg: "/assets/dresscode%20webp/women%204.webp",
      menImg: "/assets/dresscode%20webp/men%204.webp",
      palette: {
        women: ["#B2EBF2", "#FFF9C4", "#FFCCBC", "#FFFFFF"],
        men: ["#E0F7FA", "#CFD8DC", "#FFAB91", "#FFFFFF"]
      }
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      const response = await fetch("https://n8n.giangle.site/webhook/c61cf4eb-bdec-47fa-bec4-e6e8210c8beb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setFormStatus("error");
    }
  };

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  useGSAP(() => {
    if (!isLoading) {
      // Initial hero fade in
      gsap.from(".hero-content", {
        y: 30,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.2,
      });

      // Bridge Section — Word by word reveal
      const bridgeWords = gsap.utils.toArray(".bridge-word");
      gsap.from(bridgeWords, {
        scrollTrigger: {
          trigger: bridgeRef.current,
          start: "top 85%",
          end: "bottom 70%",
          scrub: 1,
        },
        opacity: 0.1,
        stagger: 0.2,
        ease: "power2.out",
      });

      // Generic Section Reveals
      const reveals = gsap.utils.toArray(".reveal-on-scroll");
      reveals.forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      });
    }
  }, { scope: container, dependencies: [isLoading] });

  return (
    <>
      {/* Audio Source — Moved outside and preloaded for immediate playback */}
      <audio
        ref={audioRef}
        src="/assets/Lady Gaga, Bruno Mars - Die With A Smile (Official Music Video).mp4"
        loop
        preload="auto"
      />

      {isLoading && (
        <Entrance
          onComplete={() => setIsLoading(false)}
          onInteraction={() => {
            if (audioRef.current) {
              audioRef.current.play().then(() => setIsMuted(false)).catch(e => console.log("Audio play blocked", e));
            }
          }}
        />
      )}
      {!isLoading && <Navbar scrolled={scrolled} />}
      <div ref={container} className={`min-h-screen ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}>
        {/* 1 & 2. Hero Section — Full Bleed */}
        <section className="relative h-screen w-full overflow-hidden bg-black">
          {/* Background — natural colors, no overlay */}
          <img
            src="/assets/hero%20background.png"
            alt="The Sunset Sinfonia"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: 'auto' }}
          />

          {/* Text block — repositioned to vertical center of viewport */}
          <div
            className="absolute left-1/2 z-10 flex flex-col items-center text-center w-full px-6"
            style={{ top: '44%', transform: 'translate(-50%, -50%)' }}
          >

            {/* Main Title — Now appears first for immediate impact */}
            <h1
              className={`${purgatory.className} text-7xl md:text-[8rem] lg:text-[9.5rem] leading-[0.95] lowercase tracking-tight flex flex-col items-center`}
              style={{
                color: '#f3ede1',
                transform: 'translateZ(0)',
                WebkitFontSmoothing: 'antialiased',
              } as React.CSSProperties}
            >
              <span className="hero-content overflow-visible px-4">The Sunset</span>
              <span className="hero-content overflow-visible px-4">Sinfonia</span>
            </h1>
          </div>

          {/* Subtle bottom blend into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10"></div>

          {/* Scroll Indicator — Minimalist Mouse Icon */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 animate-fade-in"
            style={{ animationDelay: '3.5s', animationFillMode: 'both' }}
          >
            {/* Elegant Mouse SVG */}
            <div className="w-5 h-8 border-[1.2px] border-[#f3ede1]/30 rounded-full relative">
              <div
                className="absolute left-1/2 top-2 -translate-x-1/2 w-[1.5px] h-[4px] bg-[#f3ede1]/60 rounded-full animate-wheel-scroll"
              ></div>
            </div>

            <div className="w-[1px] h-10 relative overflow-hidden" style={{ background: 'rgba(243,237,225,0.1)' }}>
              <div
                className="absolute top-0 left-0 w-full h-1/2 animate-scroll-down"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(243,237,225,0.6), transparent)' }}
              ></div>
            </div>
          </div>
        </section>

        {/* Bridge Section — A cinematic transition */}
        <section ref={bridgeRef} className="py-32 md:py-48 bg-background flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Signature Olive Decorations — Bottom-Left and Top-Right */}
          <div className="absolute -bottom-16 -left-16 opacity-[0.18] pointer-events-none rotate-[-15deg] hidden md:block">
            <img src="/assets/component/20.svg" className="w-[22rem] h-[22rem]" alt="" />
          </div>
          <div className="absolute -top-10 -right-10 opacity-[0.18] pointer-events-none rotate-[165deg] hidden md:block">
            <img src="/assets/component/18.svg" className="w-[22rem] h-[22rem]" alt="" />
          </div>
          <div className="absolute -top-8 -right-8 opacity-[0.15] pointer-events-none rotate-[150deg] md:hidden">
            <img src="/assets/component/18.svg" className="w-40 h-40" alt="" />
          </div>
          <p
            className="text-elegant uppercase tracking-[0.5em] text-xl md:text-3xl lg:text-4xl text-primary/80 max-w-[90%] leading-relaxed flex flex-wrap justify-center gap-y-4"
          >
            {"a party that never ends".split(" ").map((word, i) => (
              <span key={i} className="bridge-word inline-block mx-[0.2em]">
                {word}
              </span>
            ))}
          </p>
        </section>
        {/* 2.5 Atmosphere Gallery — A cinematic journey through the day */}
        <section className="p-[1px] md:p-[4px] bg-background relative overflow-hidden reveal-on-scroll" id="gallery-section">
          {/* Signature Olive Decorations — Corner Framing */}
          <div className="absolute top-24 -left-32 opacity-[0.18] pointer-events-none rotate-[45deg] hidden md:block">
            <img src="/assets/component/19.svg" className="w-[32rem] h-[32rem]" alt="" />
          </div>
          <div className="absolute -bottom-40 -right-40 opacity-[0.2] pointer-events-none rotate-[225deg] hidden md:block">
            <img src="/assets/component/20.svg" className="w-[38rem] h-[38rem]" alt="" />
          </div>
          <div className="absolute bottom-0 right-0 opacity-[0.15] pointer-events-none rotate-[225deg] md:hidden">
            <img src="/assets/component/20.svg" className="w-56 h-56" alt="" />
          </div>
          <div className="w-full">
            {/* Interaction Hint */}
            <div className="flex justify-center py-4 opacity-30 animate-pulse-slow">
              <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-primary font-medium">
                Double tap to react • Click arrows to explore
              </p>
            </div>
            <div className="grid grid-cols-3 gap-[1px] md:gap-[4px]">
              {/* Row 1: Garden & Sunset */}
              {[
                ["w7.jpeg", "w6.jpeg", "w1.jpeg"],
                ["w11.jpeg", "w10.jpeg", "w8.jpeg"],
                ["b1.jpg", "b4.jpg", "b10.jpg"]
              ].map((images, idx) => (
                <div key={`row1-${idx}`} className="relative">
                  <InstagramPost images={images} />
                  {idx === 1 && <GalleryHint />}
                </div>
              ))}

              {/* Row 2: Dinner */}
              {[
                ["w9.jpg", "b14.jpg", "b11.jpg"],
                ["b15.jpg", "b18.jpg", "b12.jpg"],
                ["w12.jpeg", "w14.jpeg", "w15.jpeg"]
              ].map((images, idx) => (
                <InstagramPost key={`row2-${idx}`} images={images} />
              ))}

              {/* Row 3: Night Party */}
              {[
                ["w13.jpeg", "b5.jpg", "b16.jpg"],
                ["b7.jpg", "b8.jpg", "b17.jpg"],
                ["b9.jpg", "b6.jpg", "w18.jpeg"]
              ].map((images, idx) => (
                <InstagramPost key={`row3-${idx}`} images={images} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Time & Places - Redesigned for Premium Aesthetic */}
        <section className="section-container section-accent relative overflow-hidden" id="details-section">
          <div className="content-wrapper max-w-6xl reveal-on-scroll">
            <div className="mb-20 space-y-4">
              <h2 className="heading-lg">Time & Venue</h2>
              <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
              <p className="text-elegant opacity-60">Nơi ghi dấu những khoảnh khắc hạnh phúc</p>


            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Date Card */}
              <div className="group relative p-6 md:p-10 pt-12 md:pt-16 bg-background/40 backdrop-blur-sm border border-primary/10 rounded-xs shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col items-center justify-start overflow-hidden">
                {/* Decorative Corner Frames */}
                <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-primary/20 transition-all duration-500 group-hover:w-14 group-hover:h-14"></div>
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-primary/20 transition-all duration-500 group-hover:w-14 group-hover:h-14"></div>

                <div className="space-y-8 relative z-10 w-full text-center">
                  <h3 className="subheading !mb-0">Thời gian diễn ra</h3>

                  {/* Top Text Section — Tailored spacing for hierarchy */}
                  <div className="text-center flex flex-col items-center justify-start mt-10 h-[110px] w-full">
                    <div className="mb-0">
                      <p className="text-2xl md:text-3xl font-normal leading-none text-primary">
                        02 & 03 Tháng 6
                      </p>
                    </div>
                    <div className="mt-1">
                      <p className="text-lg md:text-xl font-light italic opacity-80 leading-none">
                        Thứ Ba & Thứ Tư
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 leading-none">
                        Mùa hạ năm 2026
                      </p>
                    </div>
                  </div>

                  {/* Modern Minimalist Calendar — Compressed for viewport fit */}
                  <div className="-mx-6 md:-mx-10 bg-background/40 backdrop-blur-sm p-6 md:p-8 border-y border-primary/5 w-[calc(100%+3rem)] md:w-[calc(100%+5rem)] shadow-sm">
                    <div className="flex justify-between items-center mb-6 px-4">
                      <span className="font-display text-lg md:text-xl text-primary tracking-widest uppercase">June 2026</span>
                      <div className="flex gap-6 opacity-30">
                        <span className="text-sm cursor-default hover:opacity-100 transition-opacity">←</span>
                        <span className="text-sm cursor-default hover:opacity-100 transition-opacity">→</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-x-1 md:gap-x-4 gap-y-2 text-center px-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                        <span key={`day-${day}-${idx}`} className="text-[9px] font-bold opacity-30 tracking-[0.2em] mb-2">{day}</span>
                      ))}

                      <span className="text-sm opacity-10">31</span>
                      <span className="text-sm opacity-40">1</span>

                      <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary rounded-full w-7 h-7 mx-auto -translate-y-[1px]"></div>
                        <span className="relative text-sm text-background font-medium">2</span>
                      </div>

                      <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary rounded-full w-7 h-7 mx-auto -translate-y-[1px]"></div>
                        <span className="relative text-sm text-background font-medium">3</span>
                      </div>

                      {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(d => (
                        <span key={d} className="text-sm opacity-40">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subtle Background Ornament */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-primary/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
              </div>

              {/* Location Card */}
              <div className="group relative p-6 md:p-10 pt-12 md:pt-16 bg-background/40 backdrop-blur-sm border border-primary/10 rounded-xs shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col items-center justify-start overflow-hidden">
                {/* Decorative Corner Frames */}
                <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-primary/20 transition-all duration-500 group-hover:w-14 group-hover:h-14"></div>
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-primary/20 transition-all duration-500 group-hover:w-14 group-hover:h-14"></div>

                <div className="space-y-6 relative z-10 text-center w-full">
                  <h3 className="subheading !mb-0">Địa điểm tổ chức</h3>

                  {/* Top Text Section — Tailored spacing synced with Time card */}
                  <div className="text-center flex flex-col items-center justify-start mt-10 h-[110px] w-full">
                    <div className="mb-0">
                      <p className="text-2xl md:text-3xl font-normal leading-none text-primary">
                        Wyndham Sky Lake
                      </p>
                    </div>
                    <div className="mt-1">
                      <p className="text-lg md:text-xl font-light italic opacity-80 leading-none">
                        Resort & Villas
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 leading-none">
                        Chương Mỹ, Hà Nội, Việt Nam
                      </p>
                    </div>
                  </div>

                  {/* Bottom Section — Height synced with Calendar in Time card */}
                  <div className="flex flex-col h-[320px] w-full">
                    {/* Venue Illustration — Expanded height */}
                    <div className="-mx-6 md:-mx-10 relative overflow-hidden flex-grow border-y border-primary/5">
                      <img
                        src="/assets/places.png"
                        alt="Wyndham Sky Lake Illustration"
                        className="w-full h-full object-cover opacity-90"
                        style={{
                          mixBlendMode: 'multiply',
                          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                        }}
                      />
                    </div>

                    <div className="pt-6 flex justify-center">
                      <a
                        href="https://maps.app.goo.gl/joX5qdMXjJcBBuwVA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link relative inline-block px-8 py-3 overflow-hidden"
                      >
                        <span className="relative z-10 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors group-hover/link:text-background">
                          Chỉ đường
                        </span>
                        <div className="absolute inset-0 bg-primary translate-y-full group-hover/link:translate-y-0 transition-transform duration-500 ease-out"></div>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Subtle Background Ornament */}
                <div className="absolute -top-10 -right-10 w-40 h-40 border border-primary/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Agendas — Clickable Map View */}
        <div ref={agendaTrigger} className="bg-background relative overflow-hidden">
          {/* Signature Olive Decorations — Corner Framing */}
          <div className="absolute -top-24 -left-24 opacity-[0.18] pointer-events-none rotate-[45deg] hidden md:block">
            <img src="/assets/component/18.svg" className="w-[30rem] h-[30rem]" alt="" />
          </div>
          <div className="absolute -bottom-32 -right-32 opacity-[0.18] pointer-events-none rotate-[225deg] hidden md:block">
            <img src="/assets/component/19.svg" className="w-[35rem] h-[35rem]" alt="" />
          </div>
          <div className="absolute -top-12 -right-12 opacity-[0.15] pointer-events-none rotate-[135deg] md:hidden">
            <img src="/assets/component/20.svg" className="w-64 h-64" alt="" />
          </div>

          <section className="py-24 md:py-32 w-full flex flex-col justify-center overflow-hidden" id="agenda-section">
            <div className="w-full max-w-7xl mx-auto px-6 reveal-on-scroll">
              <div className="mb-12 space-y-4 text-center">
                <h2 className="heading-lg">The Agenda</h2>
                <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
                <p className="text-elegant opacity-60">Dấu ấn của những khoảnh khắc</p>

              </div>

              {/* Unified Horizontal Timeline — Agenda */}
              <div className="timeline-container">
                <div
                  className="timeline-line-base"
                  style={{
                    left: `${(100 / agendaData.length) / 2}%`,
                    width: `${100 - (100 / agendaData.length)}%`
                  }}
                ></div>
                <div
                  className="timeline-line-progress"
                  style={{
                    left: `${(100 / agendaData.length) / 2}%`,
                    width: `${activeAgenda !== null ? (activeAgenda / (agendaData.length - 1)) * (100 - (100 / agendaData.length)) : 0}%`
                  }}
                ></div>

                <div className="flex justify-between items-start relative z-10">
                  {agendaData.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveAgenda(idx);
                        setShowAgendaHint(false);
                      }}
                      className={`timeline-node ${activeAgenda === idx ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
                      style={{ width: `${100 / agendaData.length}%` }}
                    >
                      <div className={`timeline-dot ${activeAgenda === idx ? 'timeline-dot-active' : ''}`}>
                        <div className={`timeline-dot-inner ${activeAgenda === idx ? 'timeline-dot-inner-active' : ''}`}></div>
                      </div>

                      <div className="mt-4 text-center">
                        <p className={`text-[12px] md:text-sm font-semibold tabular-nums mb-1 transition-colors ${activeAgenda === idx ? 'text-primary' : 'text-primary/60'}`}>
                          {item.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Activity Details — Mobile only (hidden on desktop to save space) */}
              <div className={`mt-6 mb-6 text-center transition-all duration-700 min-h-[150px] md:hidden flex flex-col justify-center ${activeAgenda !== null ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
                {activeAgenda !== null ? (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-[1px] bg-primary/10"></div>
                      <span className={`${purgatory.className} text-4xl text-primary`}>{agendaData[activeAgenda as number].time}</span>
                      <div className="w-12 h-[1px] bg-primary/10"></div>
                    </div>
                    <h3 className="heading-md !text-2xl md:!text-3xl text-primary">{agendaData[activeAgenda as number].title}</h3>
                    <p className="subheading !opacity-100 text-primary/60">{agendaData[activeAgenda as number].location}</p>
                    {agendaData[activeAgenda as number].details.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2">
                        {agendaData[activeAgenda as number].details.map((detail, idx) => (
                          <span key={idx} className="text-[10px] uppercase tracking-[0.2em] opacity-40 italic">{detail}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 animate-fade-in opacity-80">
                    <h3 className="heading-md !text-2xl md:!text-3xl text-primary uppercase tracking-[0.2em]">Welcome to Wyndham</h3>
                  </div>
                )}
              </div>

              {/* Map Overview — Auto-zooming Map */}
              <div 
                className="relative aspect-video md:aspect-[16/9] w-full overflow-hidden rounded-sm border border-primary/10 bg-[#e5e1d8] shadow-2xl group/map cursor-pointer"
                onClick={() => {
                  if (activeAgenda === null) setActiveAgenda(0);
                  else if (activeAgenda < agendaData.length - 1) setActiveAgenda(prev => (prev as number) + 1);
                  setShowAgendaHint(false);
                }}
              >
                {/* Interaction Hint */}
                <NavigationHint text="Click to view more" isVisible={showAgendaHint} />
                
                {/* Dark Overlay for Hint Visibility */}
                <div 
                  className={`absolute inset-0 bg-black/60 z-40 transition-opacity duration-1000 pointer-events-none ${showAgendaHint ? 'opacity-100' : 'opacity-0'}`}
                ></div>
                {/* Desktop Detail Overlay — The "Note" style per user request */}
                <div className="hidden md:block absolute top-8 left-8 z-40 w-72 pointer-events-none">
                  <div className={`bg-background/90 backdrop-blur-md p-6 rounded-sm border border-primary/10 shadow-2xl transition-all duration-700 ${activeAgenda !== null ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-0'}`}>
                    {activeAgenda !== null ? (
                      <div className="space-y-3 animate-fade-in text-left">
                        <div className="flex items-center gap-3">
                          <span className={`${purgatory.className} text-3xl text-primary`}>{agendaData[activeAgenda as number].time}</span>
                          <div className="h-[1px] flex-1 bg-primary/10"></div>
                        </div>
                        <h3 className="heading-md !text-xl text-primary">{agendaData[activeAgenda as number].title}</h3>
                        <p className="subheading !text-sm !opacity-100 text-primary/60">{agendaData[activeAgenda as number].location}</p>
                        {agendaData[activeAgenda as number].details.length > 0 && (
                          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-primary/5 mt-2">
                            {agendaData[activeAgenda as number].details.map((detail, idx) => (
                              <span key={idx} className="text-[9px] uppercase tracking-[0.1em] opacity-40 italic">{detail}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="animate-fade-in text-left">
                        <h3 className="heading-md !text-xl text-primary uppercase tracking-[0.1em]">Welcome to Wyndham</h3>
                      </div>
                    )}
                  </div>
                </div>

                {/* The Map Image with Zoom Effect */}
                <img
                  src="/assets/map 3.png"
                  alt="The Sunset Sinfonia Overview Map"
                  className="w-full h-full object-cover saturate-[0.7] transition-all duration-1000 ease-in-out will-change-transform"
                  style={{
                    transform: activeAgenda !== null
                      ? `scale(${agendaData[activeAgenda as number].coords.scale})`
                      : 'scale(1)',
                    transformOrigin: activeAgenda !== null
                      ? `${agendaData[activeAgenda as number].coords.x}% ${agendaData[activeAgenda as number].coords.y}%`
                      : 'center top'
                  }}
                />

                {/* Navigation Arrows for Agenda Map */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between z-30 pointer-events-none px-6">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (activeAgenda === 0) setActiveAgenda(null);
                      else if (activeAgenda !== null) setActiveAgenda(prev => (prev as number) - 1);
                    }}
                    disabled={activeAgenda === null}
                    className={`pointer-events-auto w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all duration-500 hover:bg-white hover:text-black disabled:opacity-0 disabled:pointer-events-none outline-none`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (activeAgenda === null) setActiveAgenda(0);
                        else setActiveAgenda(prev => Math.min(agendaData.length - 1, (prev as number) + 1));
                        setShowAgendaHint(false);
                      }}
                      disabled={activeAgenda === agendaData.length - 1}
                      className={`pointer-events-auto w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all duration-500 hover:bg-white hover:text-black disabled:opacity-0 disabled:pointer-events-none outline-none`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </button>

                  </div>
                </div>

                {/* Spotlight Overlay — Subtle while zoomed */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 transition-all duration-1000 ease-in-out"
                  style={{
                    background: activeAgenda !== null
                      ? `radial-gradient(circle 80px at ${agendaData[activeAgenda].coords.x}% ${agendaData[activeAgenda].coords.y}%, transparent 0%, rgba(0,0,0,0.15) 100%)`
                      : 'rgba(0,0,0,0.05)'
                  }}
                ></div>

                {/* Magnifying Glass / Highlight Circle */}
                {activeAgenda !== null && (
                  <div
                    className="absolute w-12 h-12 -ml-6 -mt-6 border-2 border-primary/30 rounded-full z-20 pointer-events-none transition-all duration-1000 ease-in-out shadow-[0_0_20px_rgba(75,80,6,0.2)]"
                    style={{
                      left: `${agendaData[activeAgenda].coords.x}%`,
                      top: `${agendaData[activeAgenda].coords.y}%`,
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 -ml-1 -mt-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(75,80,6,0.5)]">
                      <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
                    </div>
                  </div>
                )}

                {/* Cinematic Vignette */}
                <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_100px_rgba(75,80,6,0.1)]"></div>
              </div>
            </div>
          </section>
        </div>

        {/* 5. RSVP */}
        <section className="min-h-screen flex items-center justify-center py-24 px-6 bg-[#4b5006] text-[#fff8eb] relative z-10 overflow-hidden" id="rsvp-section">
          {/* Signature Olive Decorations — White Overlay for RSVP */}
          <div className="absolute -top-32 -left-32 opacity-[0.1] pointer-events-none rotate-[45deg] hidden md:block grayscale brightness-0 invert">
            <img src="/assets/component/18.svg" className="w-[35rem] h-[35rem]" alt="" />
          </div>
          <div className="absolute -bottom-40 -right-40 opacity-[0.12] pointer-events-none rotate-[225deg] hidden md:block grayscale brightness-0 invert">
            <img src="/assets/component/20.svg" className="w-[40rem] h-[40rem]" alt="" />
          </div>
          <div className="absolute top-0 right-0 opacity-[0.08] pointer-events-none rotate-[135deg] md:hidden grayscale brightness-0 invert">
            <img src="/assets/component/19.svg" className="w-56 h-56" alt="" />
          </div>
          <div className="content-wrapper max-w-2xl opacity-100">
            <div className="mb-16 space-y-4">
              <h2 className="heading-lg !text-[#fff8eb]">RSVP</h2>
              <div className="w-24 h-[1px] bg-[#fff8eb]/20 mx-auto"></div>
              <p className="text-elegant !text-[#fff8eb]/80">Hãy để chúng tôi chuẩn bị tốt nhất cho bạn</p>
            </div>

            {formStatus === "success" ? (
              <div className="text-center py-24 space-y-6 animate-fade-in bg-[#fff8eb]/10 backdrop-blur-sm rounded-lg border border-[#fff8eb]/10 max-w-2xl mx-auto shadow-sm">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#fff8eb]/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#fff8eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="heading-md !text-[#fff8eb]">Cảm ơn bạn đã phản hồi</h3>
                  <p className="text-elegant !text-[#fff8eb]">Chúng tôi đã nhận được thông tin và rất mong được đón tiếp bạn.</p>
                </div>
                <button
                  onClick={() => setFormStatus("idle")}
                  className="text-xs uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all hover:tracking-[0.3em] mt-4"
                >
                  Gửi phản hồi khác
                </button>
              </div>
            ) : (
              <form className="max-w-2xl mx-auto space-y-12" onSubmit={handleSubmit}>
                {/* Section: Name & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left">
                  <div className="space-y-3 group">
                    <label className="subheading block text-[10px] tracking-[0.25em] font-semibold !text-[#fff8eb]/80 transition-colors group-focus-within:!text-[#fff8eb]">Họ và tên</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-[#fff8eb]/30 py-3 focus:border-[#fff8eb] focus:outline-none transition-all placeholder:text-[#fff8eb]/40 font-normal text-lg text-[#fff8eb]"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div className="space-y-3 group">
                    <label className="subheading block text-[10px] tracking-[0.25em] font-semibold !text-[#fff8eb]/80 transition-colors group-focus-within:!text-[#fff8eb]">Tên đơn vị / Thương hiệu</label>
                    <input
                      type="text"
                      name="business"
                      required
                      value={formData.business}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-[#fff8eb]/30 py-3 focus:border-[#fff8eb] focus:outline-none transition-all placeholder:text-[#fff8eb]/40 font-normal text-lg text-[#fff8eb]"
                      placeholder="Nhập tên doanh nghiệp"
                    />
                  </div>
                </div>

                {/* Section: Confirmation */}
                <div className="space-y-6 pt-4">
                  <label className="subheading block text-[10px] tracking-[0.25em] text-center mb-8 !text-[#fff8eb]/80">Bạn sẽ tham dự cùng chúng tôi chứ?</label>
                  <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="confirmation"
                          required
                          value="absolutely! cant wait"
                          checked={formData.confirmation === "absolutely! cant wait"}
                          onChange={handleInputChange}
                          className="peer appearance-none w-5 h-5 border border-[#fff8eb]/40 rounded-full checked:border-[#fff8eb] transition-all cursor-pointer"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-[#fff8eb] rounded-full scale-0 peer-checked:scale-100 transition-transform duration-300"></div>
                      </div>
                      <span className="font-medium text-sm tracking-wide !text-[#fff8eb]/80 group-hover:!text-[#fff8eb] transition-opacity">Chắc chắn rồi! Rất mong chờ.</span>
                    </label>

                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="confirmation"
                          required
                          value="Maybe next time"
                          checked={formData.confirmation === "Maybe next time"}
                          onChange={handleInputChange}
                          className="peer appearance-none w-5 h-5 border border-[#fff8eb]/40 rounded-full checked:border-[#fff8eb] transition-all cursor-pointer"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-[#fff8eb] rounded-full scale-0 peer-checked:scale-100 transition-transform duration-300"></div>
                      </div>
                      <span className="font-medium text-sm tracking-wide !text-[#fff8eb]/80 group-hover:!text-[#fff8eb] transition-opacity">Hẹn dịp khác nhé.</span>
                    </label>
                  </div>
                </div>

                {/* Section: Details */}
                <div className="space-y-3 group pt-4 text-left">
                  <label className="subheading block text-[10px] tracking-[0.25em] font-semibold !text-[#fff8eb]/80 transition-colors group-focus-within:!text-[#fff8eb]">Yêu cầu về thực đơn</label>
                  <input
                    type="text"
                    name="meal_preference"
                    value={formData.meal_preference}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#fff8eb]/30 py-3 focus:border-[#fff8eb] focus:outline-none transition-all placeholder:text-[#fff8eb]/40 font-normal text-lg text-[#fff8eb]"
                    placeholder="Dị ứng, ăn chay..."
                  />
                </div>

                {/* Section: Message */}
                <div className="space-y-3 group pt-4 text-left">
                  <label className="subheading block text-[10px] tracking-[0.25em] font-semibold !text-[#fff8eb]/80 transition-colors group-focus-within:!text-[#fff8eb]">Lời nhắn gửi đến Ban tổ chức</label>
                  <textarea
                    name="note"
                    rows={2}
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#fff8eb]/30 py-3 focus:border-[#fff8eb] focus:outline-none transition-all placeholder:text-[#fff8eb]/40 font-normal text-lg resize-none text-[#fff8eb]"
                    placeholder="Bạn có muốn nhắn nhủ điều gì không?"
                  ></textarea>
                </div>

                {formStatus === "error" && (
                  <p className="text-red-800 text-xs italic text-center">Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp với chúng tôi.</p>
                )}

                <div className="text-center pt-8">
                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="relative px-12 py-5 overflow-hidden group border border-[#fff8eb]/20 transition-all duration-700 hover:border-[#fff8eb] disabled:opacity-50"
                  >
                    <span className="relative z-10 text-xs uppercase tracking-[0.4em] font-medium transition-colors duration-500 text-[#fff8eb] group-hover:text-[#4b5006]">
                      {formStatus === "submitting" ? "Đang gửi..." : "Gửi phản hồi"}
                    </span>
                    <div className="absolute inset-0 bg-[#fff8eb] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* 6. Dresscode — Clickable Carousel View */}
        <div ref={dresscodeTrigger} className="bg-background relative overflow-hidden">
          {/* Signature Olive Decorations — Corner Framing */}
          <div className="absolute -top-32 -right-32 opacity-[0.18] pointer-events-none rotate-[180deg] hidden md:block">
            <img src="/assets/component/20.svg" className="w-[32rem] h-[32rem]" alt="" />
          </div>
          <div className="absolute -bottom-40 -left-40 opacity-[0.18] pointer-events-none rotate-[0deg] hidden md:block">
            <img src="/assets/component/18.svg" className="w-[40rem] h-[40rem]" alt="" />
          </div>
          <div className="absolute -bottom-12 -right-12 opacity-[0.15] pointer-events-none rotate-[225deg] md:hidden">
            <img src="/assets/component/19.svg" className="w-72 h-72" alt="" />
          </div>

          <section className="py-24 md:py-32 w-full flex flex-col justify-center overflow-hidden" id="dresscode-section">
            <div className="content-wrapper max-w-6xl reveal-on-scroll">
              <div className="mb-10 space-y-4 text-center">
                <h2 className="heading-lg">Dress Code</h2>
                <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
                <p className="text-elegant opacity-60">Lựa chọn trang phục cho những khoảnh khắc tuyệt vời</p>

              </div>

              <div className="flex flex-col gap-4 md:gap-16 h-auto relative">
                {/* Unified Horizontal Timeline — Dresscode */}
                <div className="timeline-container">
                  <div
                    className="timeline-line-base"
                    style={{
                      left: `${(100 / dresscodeData.length) / 2}%`,
                      width: `${100 - (100 / dresscodeData.length)}%`
                    }}
                  ></div>
                  <div
                    className="timeline-line-progress"
                    style={{
                      left: `${(100 / dresscodeData.length) / 2}%`,
                      width: `${(activeDresscode / (dresscodeData.length - 1)) * (100 - (100 / dresscodeData.length))}%`
                    }}
                  ></div>

                  <div className="flex justify-between items-start relative z-10">
                    {dresscodeData.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDresscode(idx);
                          setShowDresscodeHint(false);
                        }}
                        className={`timeline-node outline-none ${activeDresscode === idx ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
                        style={{ width: `${100 / dresscodeData.length}%` }}
                      >
                        <div className={`timeline-dot ${activeDresscode === idx ? 'timeline-dot-active' : ''}`}>
                          <div className={`timeline-dot-inner ${activeDresscode === idx ? 'timeline-dot-inner-active' : ''}`}></div>
                        </div>

                        <div className="mt-4 text-center">
                          <p className={`text-[12px] md:text-sm font-semibold tracking-[0.2em] uppercase mb-1 transition-colors ${activeDresscode === idx ? 'text-primary' : 'text-primary/60'}`}>
                            {item.title}
                          </p>
                          <h3 className={`text-[10px] md:text-xs font-semibold tracking-[0.1em] transition-colors hidden md:block ${activeDresscode === idx ? 'text-primary' : 'text-primary/40'}`}>
                            {item.subtitle}
                          </h3>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Content Area with Arrows */}
                <div 
                  className="relative w-full cursor-pointer"
                  onClick={() => {
                    if (activeDresscode < dresscodeData.length - 1) setActiveDresscode(prev => prev + 1);
                    setShowDresscodeHint(false);
                  }}
                >
                  {/* Interaction Hint */}
                  <NavigationHint text="Click to view more" isVisible={showDresscodeHint} />
                  {/* Navigation Arrows */}
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between z-30 pointer-events-none px-4 md:-mx-12">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDresscode(prev => Math.max(0, prev - 1));
                      }}
                      disabled={activeDresscode === 0}
                      className={`pointer-events-auto w-12 h-12 rounded-full border border-primary/10 bg-background/50 backdrop-blur-md flex items-center justify-center text-primary transition-all duration-500 hover:bg-primary hover:text-background disabled:opacity-0 disabled:pointer-events-none outline-none`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDresscode(prev => Math.min(dresscodeData.length - 1, prev + 1));
                          setShowDresscodeHint(false);
                        }}
                        disabled={activeDresscode === dresscodeData.length - 1}
                        className={`pointer-events-auto w-12 h-12 rounded-full border border-primary/10 bg-background/50 backdrop-blur-md flex items-center justify-center text-primary transition-all duration-500 hover:bg-primary hover:text-background disabled:opacity-0 disabled:pointer-events-none outline-none`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </button>

                    </div>
                  </div>

                  {/* Illustration & Details */}
                  <div className="flex-1 grid grid-cols-2 gap-8 md:gap-16 items-center">
                    {/* Women Side */}
                    <div className="flex flex-col items-center space-y-4 animate-fade-in" key={`women-${activeDresscode}`}>
                      <div className="relative h-[250px] md:h-[380px] w-full flex items-center justify-center">
                        <img
                          src={dresscodeData[activeDresscode].womenImg}
                          alt="Women Dresscode"
                          className="h-full object-contain"
                        />
                      </div>
                      <div className="text-center space-y-3">
                        <p className="text-[10px] md:text-[11px] font-light max-w-[200px] mx-auto opacity-70 italic leading-relaxed min-h-[64px] md:min-h-[80px]">
                          {dresscodeData[activeDresscode].women}
                        </p>
                        <div className="flex justify-center gap-3">
                          {dresscodeData[activeDresscode].palette.women.map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-primary/10 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Men Side */}
                    <div className="flex flex-col items-center space-y-4 animate-fade-in" key={`men-${activeDresscode}`}>
                      <div className="relative h-[250px] md:h-[380px] w-full flex items-center justify-center">
                        <img
                          src={dresscodeData[activeDresscode].menImg}
                          alt="Men Dresscode"
                          className="h-full object-contain"
                        />
                      </div>
                      <div className="text-center space-y-3">
                        <p className="text-[10px] md:text-[11px] font-light max-w-[200px] mx-auto opacity-70 italic leading-relaxed min-h-[64px] md:min-h-[80px]">
                          {dresscodeData[activeDresscode].men}
                        </p>
                        <div className="flex justify-center gap-3">
                          {dresscodeData[activeDresscode].palette.men.map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-primary/10 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* 7. Contact Us — Interactive Person Collage */}
        <section className="min-h-screen py-20 md:py-32 flex items-center justify-center section-accent relative overflow-hidden" id="contact-section">
          {/* Signature Olive Decorations — Corner Framing */}
          <div className="absolute -top-24 -left-24 opacity-[0.18] pointer-events-none rotate-[90deg]">
            <img src="/assets/component/19.svg" className="w-[28rem] h-[28rem]" alt="" />
          </div>
          <div className="absolute -bottom-32 -right-32 opacity-[0.2] pointer-events-none rotate-[270deg]">
            <img src="/assets/component/20.svg" className="w-[32rem] h-[32rem]" alt="" />
          </div>
          <div className="w-full max-w-6xl mx-auto px-4 md:px-12 reveal-on-scroll">
            <div className="mb-12 space-y-4 text-center">
              <h2 className="heading-lg">Contact</h2>
              <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
              <p className="text-elegant opacity-60">Main support contacts</p>
            </div>

            <div
              className="flex md:grid md:grid-cols-3 overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 md:gap-8 pb-8 -mx-4 px-4"
              onTouchStart={() => setShowContactHint(false)}
              onScroll={() => setShowContactHint(false)}
            >
              <div className="relative min-w-[85vw] md:min-w-0 snap-center">
                <ContactCard
                  images={["ginale.jpg"]}
                  unit="Glow"
                  rep="Ms. Giang Le"
                  role="0857086906"
                  phone="Hỗ trợ kỹ thuật Website"
                  intro="Glow mang đến giải pháp kỹ thuật và thẩm mỹ số hóa, biến những ý tưởng bay bổng thành trải nghiệm tương tác mượt mà cho website của bạn."
                  link="https://zalo.me/0857086906"
                />

                {/* Interaction Hint — Contact Bubble (Mobile Only) */}
                {showContactHint && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-move-horizontal pointer-events-none md:hidden z-30">
                    <div className="bg-[#fff8eb] text-primary text-[7px] px-2 py-1.5 rounded-full uppercase tracking-[0.2em] font-bold whitespace-nowrap shadow-[0_10px_20px_rgba(0,0,0,0.3)] border border-primary/20 flex items-center gap-2">
                      Swipe left
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2 h-2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div className="min-w-[85vw] md:min-w-0 snap-center">
                <ContactCard
                  images={["nhat linh.png"]}
                  unit="Fancy"
                  rep="Ms. Nhat Linh"
                  role="0852071736"
                  phone="Hỗ trợ kế hoạch & Kỹ thuật"
                  intro="Với Fancy, mỗi đám cưới là một tác phẩm nghệ thuật. Chúng tôi tận tâm kiến tạo không gian tiệc sang trọng, tinh tế và mang đậm dấu ấn cá nhân."
                  link="https://www.facebook.com/fancywedding2015"
                />
              </div>
              <div className="min-w-[85vw] md:min-w-0 snap-center">
                <ContactCard
                  images={["thomas.png"]}
                  unit="SkyLake"
                  rep="Mr. Thomas"
                  role="0889010399"
                  phone="Hỗ trợ địa điểm & Tiệc"
                  intro="Tận hưởng không gian nghỉ dưỡng tuyệt mỹ và dịch vụ đẳng cấp tại Wyndham Sky Lake, nơi khởi đầu cho những hành trình hạnh phúc."
                  link="https://www.facebook.com/WynhamSkyLake.ResortVillas"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 8. Thank you note — Minimalist Finale (Full Viewport) */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
          {/* Background Image — Pure & Sharp */}
          <img
            src="/assets/thankyou%20background.png"
            alt="Thank You"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Content Overlay — Standardized with Hero layout */}
          <div className="relative z-20 content-wrapper max-w-4xl px-8 flex flex-col items-center reveal-on-scroll">
            <div className="flex flex-col items-center text-center">
              {/* Main Title — Synced size with Hero, split for mobile impact */}
              <h2 className={`${purgatory.className} text-[6rem] md:text-[7rem] lg:text-[8rem] !text-white lowercase tracking-tight leading-[0.85] md:leading-none flex flex-col md:flex-row items-center gap-x-8`}>
                <span>thank</span>
                <span>you</span>
              </h2>
            </div>
          </div>
        </section>

        {/* Persistent Audio Control — Redesigned per reference */}
        {!isLoading && (
          <div className="fixed bottom-8 right-8 z-[100] animate-fade-in" style={{ animationDelay: '1s' }}>
            <button
              onClick={() => {
                if (audioRef.current) {
                  const newState = !isMuted;
                  audioRef.current.muted = newState;
                  setIsMuted(newState);
                }
              }}
              className="group flex items-center gap-4 transition-all duration-700"
            >
              {/* Music Bars Indicator */}
              <div className="flex gap-[3px] items-center h-4">
                <div className={`w-[1.5px] bg-primary/40 transition-all duration-500 ${!isMuted ? 'animate-music-one' : 'h-1'}`}></div>
                <div className={`w-[1.5px] bg-primary/40 transition-all duration-500 ${!isMuted ? 'animate-music-two' : 'h-2'}`}></div>
                <div className={`w-[1.5px] bg-primary/40 transition-all duration-500 ${!isMuted ? 'animate-music-three' : 'h-1.5'}`}></div>
              </div>

              {/* Circular Button */}
              <div className="relative w-11 h-11 rounded-full border border-primary/20 flex items-center justify-center bg-background/60 backdrop-blur-xl group-hover:border-primary/50 group-active:scale-95 transition-all duration-500 shadow-sm">
                {!isMuted ? (
                  /* Pause Icon */
                  <div className="flex gap-[3px]">
                    <div className="w-[1.5px] h-3 bg-primary/80"></div>
                    <div className="w-[1.5px] h-3 bg-primary/80"></div>
                  </div>
                ) : (
                  /* Play Icon */
                  <div className="ml-0.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-primary/80">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
