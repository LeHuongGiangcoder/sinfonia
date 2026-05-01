"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { purgatory } from "@/lib/fonts";
import Entrance from "@/components/Entrance";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const agendaTrigger = useRef<HTMLDivElement>(null);
  const dresscodeTrigger = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAgenda, setActiveAgenda] = useState<number>(0);
  const [activeDresscode, setActiveDresscode] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    confirmation: "",
    attendants: "1",
    meal_preference: "",
    note: ""
  });

  const agendaData = [
    {
      time: "12:00",
      title: "CHECK IN",
      location: "Lobby Lounge",
      details: [],
      coords: { x: 56, y: 62, scale: 2.2 }
    },
    {
      time: "14:30",
      title: "TEA BREAK",
      location: "Sinfonia Garden",
      details: [],
      coords: { x: 58, y: 41, scale: 2.5 }
    },
    {
      time: "15:00",
      title: "WELCOME + WORKSHOP",
      location: "Grand Ballroom",
      details: ["Khai mạc", "Workshop"],
      coords: { x: 47, y: 81, scale: 2.2 }
    },
    {
      time: "16:30",
      title: "CATCH THE SUN",
      location: "Sunset Terrace",
      details: ["Cocktail", "Live music"],
      coords: { x: 70, y: 13, scale: 2.8 }
    },
    {
      time: "18:30",
      title: "A SKY FULL OF STARS",
      location: "Starlight Dining",
      details: ["Dinner", "Drinking game"],
      coords: { x: 66, y: 60, scale: 2.5 }
    },
    {
      time: "20:30",
      title: "MIDNIGHT REVERIE",
      location: "Infinity Pool",
      details: ["Fireworks", "DJ", "Pool Party"],
      coords: { x: 50, y: 77, scale: 2.5 }
    },
  ];

  const dresscodeData = [
    {
      title: "Welcoming",
      subtitle: "Đón khách",
      women: "Váy lụa",
      men: "Vest / Blazer",
      womenImg: "/assets/women 1.png",
      menImg: "/assets/men 2.png",
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
      womenImg: "/assets/women 3.png",
      menImg: "/assets/men 3.png",
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
      womenImg: "/assets/women 4.png",
      menImg: "/assets/men 4.png",
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

      // ScrollTrigger for Agenda Pinning & State
      ScrollTrigger.create({
        trigger: agendaTrigger.current,
        start: "top top",
        end: "+=3500", // Total scroll distance for all items
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          // Calculate which agenda item to show based on scroll progress
          const totalItems = agendaData.length;
          const progress = self.progress;
          // Segment progress into equal parts for each item
          const index = Math.min(Math.floor(progress * totalItems), totalItems - 1);
          setActiveAgenda(index);
        }
      });

      // ScrollTrigger for Dresscode Pinning & State
      ScrollTrigger.create({
        trigger: dresscodeTrigger.current,
        start: "top top",
        end: "+=1500", // Smaller scroll distance for 3 items
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const totalItems = 3;
          const progress = self.progress;
          const index = Math.min(Math.floor(progress * totalItems), totalItems - 1);
          setActiveDresscode(index);
        }
      });
    }
  }, { scope: container, dependencies: [isLoading] });

  return (
    <>
      {isLoading && <Entrance onComplete={() => setIsLoading(false)} />}
      <div ref={container} className={`min-h-screen ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}>
        {/* 1 & 2. Hero Section — Full Bleed */}
        <section className="relative h-screen w-full overflow-hidden bg-black">
          {/* Background — natural colors, no overlay */}
          <img
            src="/assets/hero%20background.png"
            alt="The Sinfonia"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: 'auto' }}
          />

          {/* Text block — repositioned to vertical center of viewport */}
          <div
            className="absolute left-1/2 z-10 flex flex-col items-center text-center w-full px-6"
            style={{ top: '45%', transform: 'translate(-50%, -50%)' }}
          >
            {/* Subheading — above the title */}
            <p
              className="uppercase font-light tracking-[0.5em] text-[9px] md:text-[11px] mb-5"
              style={{
                color: 'rgba(243,237,225,0.65)',
                animation: 'hero-fade-up 0.9s ease-out 0.3s both',
              }}
            >
              a party that never ends
            </p>

            {/* Main Title — Pure fade-up for maximum sharpness */}
            <h1
              className={`${purgatory.className} text-[4.5rem] md:text-[7rem] lg:text-[9rem] leading-none lowercase tracking-tight`}
              style={{
                color: '#f3ede1',
                opacity: 0,
                animation: 'hero-fade-up 1.2s ease-out 0.7s both',
                transform: 'translateZ(0)',
                WebkitFontSmoothing: 'antialiased',
              } as React.CSSProperties}
            >
              The Sinfonia
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

        {/* 3. Time & Places - Redesigned for Premium Aesthetic */}
        <section className="section-container section-accent relative overflow-hidden" id="details-section">
          <div className="content-wrapper max-w-6xl">
            <div className="mb-20 space-y-4">
              <h2 className="heading-lg">Thời gian & Địa điểm</h2>
              <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
              <p className="text-elegant opacity-60">Hành trình của những cảm xúc thăng hoa</p>
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
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <span key={day} className="text-[9px] font-bold opacity-30 tracking-[0.2em] mb-2">{day}</span>
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

        {/* 4. Agendas - Vertical Timeline & Spotlight Map (Pinned via ScrollTrigger) */}
        <div ref={agendaTrigger} className="bg-background">
          <section className="min-h-screen w-full flex flex-col justify-center overflow-hidden" id="agenda-section">
            <div className="w-full max-w-7xl mx-auto px-6">
              <div className="mb-12 space-y-4 text-center">
                <h2 className="heading-lg">Chương trình</h2>
                <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
                <p className="text-elegant opacity-60">Dấu ấn của những khoảnh khắc</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-16 items-stretch h-[450px] md:h-[500px]">
                {/* Vertical Timeline Bar - Typographic Minimalist */}
                <div className="w-full lg:w-64 relative flex flex-col order-2 lg:order-1 h-full">
                  {/* The items container itself will define the height for the line */}
                  <div className="relative grid grid-rows-6 h-full pl-8 lg:pl-12">
                    {/* Vertical Axis Line - Anchored to items container */}
                    <div className="absolute left-0 top-[8px] bottom-[8px] w-[1px] bg-primary/5 hidden lg:block"></div>

                    {/* Vertical Active Progress Line */}
                    <div
                      className="absolute left-0 top-[8px] w-[1px] bg-primary/30 transition-all duration-1000 ease-in-out hidden lg:block"
                      style={{
                        height: `${(activeAgenda !== null ? (activeAgenda / (agendaData.length - 1)) * 100 : 0)}%`,
                      }}
                    ></div>

                    {agendaData.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col justify-center relative z-10 transition-all duration-700 ${activeAgenda === idx ? 'opacity-100' : 'opacity-20'}`}
                      >
                        <div className="flex lg:flex-row flex-col items-center lg:items-start">
                          {/* Time Label */}
                          <div className="lg:w-16 lg:mr-8 mb-2 lg:mb-0 shrink-0">
                            <span className={`text-xs md:text-sm font-light tabular-nums transition-colors duration-500 ${activeAgenda === idx ? 'text-primary' : ''}`}>
                              {item.time}
                            </span>
                          </div>

                          {/* Title */}
                          <div className="transition-all duration-700">
                            <h3 className={`text-[11px] md:text-xs font-medium tracking-[0.15em] uppercase transition-colors ${activeAgenda === idx ? 'text-primary' : ''}`}>
                              {item.title}
                            </h3>
                            <div className="relative h-4 overflow-visible">
                              <p className={`absolute top-1 left-0 text-[9px] md:text-[10px] font-light transition-all duration-500 whitespace-nowrap ${activeAgenda === idx ? 'opacity-60 block' : 'opacity-0 hidden'}`}>
                                {item.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Overview - Right */}
                <div className="flex-1 relative aspect-video lg:aspect-auto min-h-[400px] lg:min-h-0 overflow-hidden rounded-sm border border-primary/10 bg-accent/10 shadow-2xl group/map order-1 lg:order-2">
                  {/* The Map Image */}
                  <img
                    src="/assets/map 2.png"
                    alt="Sinfonia Overview Map"
                    className="w-full h-full object-cover object-top opacity-80 saturate-[0.7]"
                  />

                  {/* Spotlight Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10 transition-all duration-700 ease-in-out"
                    style={{
                      background: activeAgenda !== null
                        ? `radial-gradient(circle 100px at ${agendaData[activeAgenda].coords.x}% ${agendaData[activeAgenda].coords.y}%, transparent 0%, rgba(0,0,0,0.25) 100%)`
                        : 'rgba(0,0,0,0.1)'
                    }}
                  ></div>

                  {/* Magnifying Glass / Highlight Circle */}
                  {activeAgenda !== null && (
                    <div
                      className="absolute w-32 h-32 md:w-40 md:h-40 -ml-16 -mt-16 md:-ml-20 md:-mt-20 border-2 border-primary/30 rounded-full z-20 pointer-events-none transition-all duration-700 ease-in-out shadow-[0_0_50px_rgba(75,80,6,0.2)]"
                      style={{
                        left: `${agendaData[activeAgenda].coords.x}%`,
                        top: `${agendaData[activeAgenda].coords.y}%`,
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 -ml-2 -mt-2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(75,80,6,0.5)]">
                        <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
                      </div>
                    </div>
                  )}

                  {/* Activity Details Overlay on Map */}
                  {activeAgenda !== null && (
                    <div className="absolute bottom-4 left-4 z-40 w-[180px] md:w-[220px] h-[160px] md:h-[180px] p-4 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xs shadow-2xl animate-fade-in pointer-events-none flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl md:text-2xl font-light tabular-nums text-primary/30">{agendaData[activeAgenda].time}</span>
                        <div className="h-[1px] flex-1 bg-primary/10"></div>
                      </div>

                      <h3 className="text-sm md:text-base font-medium mb-0.5 tracking-tight text-primary leading-tight">
                        {agendaData[activeAgenda].title}
                      </h3>
                      <p className="text-[8px] md:text-[9px] uppercase tracking-widest opacity-60 mb-2">
                        {agendaData[activeAgenda].location}
                      </p>

                      <div className="flex-1 overflow-y-auto no-scrollbar">
                        {agendaData[activeAgenda].details.length > 0 && (
                          <ul className="space-y-1 border-t border-primary/5 pt-2">
                            {agendaData[activeAgenda].details.map((detail, dIdx) => (
                              <li key={dIdx} className="text-[9px] md:text-[10px] opacity-70 font-light flex items-start gap-1.5">
                                <span className="mt-1 w-1 h-1 bg-primary/40 rounded-full shrink-0"></span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cinematic Vignette */}
                  <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_100px_rgba(75,80,6,0.1)]"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 5. RSVP */}
        <section className="section-container section-accent">
          <div className="content-wrapper max-w-2xl">
            <div className="mb-16 space-y-4">
              <h2 className="heading-lg">Phản hồi</h2>
              <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
              <p className="text-elegant opacity-60">Hãy để chúng tôi chuẩn bị tốt nhất cho bạn</p>
            </div>

            {formStatus === "success" ? (
              <div className="text-center py-24 space-y-6 animate-fade-in bg-white/30 backdrop-blur-sm rounded-lg border border-primary/10 max-w-2xl mx-auto shadow-sm">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="heading-md">Cảm ơn bạn đã phản hồi</h3>
                  <p className="text-elegant">Chúng tôi đã nhận được thông tin và rất mong được đón tiếp bạn.</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3 group">
                    <label className="subheading block text-[10px] tracking-[0.25em] transition-colors group-focus-within:text-primary">Họ và tên</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary focus:outline-none transition-all placeholder:opacity-20 font-light text-lg"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div className="space-y-3 group">
                    <label className="subheading block text-[10px] tracking-[0.25em] transition-colors group-focus-within:text-primary">Tên đơn vị / Thương hiệu</label>
                    <input
                      type="text"
                      name="business"
                      required
                      value={formData.business}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary focus:outline-none transition-all placeholder:opacity-20 font-light text-lg"
                      placeholder="Nhập tên doanh nghiệp"
                    />
                  </div>
                </div>

                {/* Section: Confirmation */}
                <div className="space-y-6 pt-4">
                  <label className="subheading block text-[10px] tracking-[0.25em] text-center mb-8">Bạn sẽ tham dự cùng chúng tôi chứ?</label>
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
                          className="peer appearance-none w-5 h-5 border border-primary/30 rounded-full checked:border-primary transition-all cursor-pointer"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform duration-300"></div>
                      </div>
                      <span className="font-light text-sm tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">Chắc chắn rồi! Rất mong chờ.</span>
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
                          className="peer appearance-none w-5 h-5 border border-primary/30 rounded-full checked:border-primary transition-all cursor-pointer"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform duration-300"></div>
                      </div>
                      <span className="font-light text-sm tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">Hẹn dịp khác nhé.</span>
                    </label>
                  </div>
                </div>

                {/* Section: Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                  <div className="space-y-3 group">
                    <label className="subheading block text-[10px] tracking-[0.25em] transition-colors group-focus-within:text-primary">Số lượng người tham dự</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="attendants"
                        min="1"
                        value={formData.attendants}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary focus:outline-none transition-all font-light text-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 group">
                    <label className="subheading block text-[10px] tracking-[0.25em] transition-colors group-focus-within:text-primary">Yêu cầu về thực đơn</label>
                    <input
                      type="text"
                      name="meal_preference"
                      value={formData.meal_preference}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary focus:outline-none transition-all placeholder:opacity-20 font-light text-lg"
                      placeholder="Dị ứng, ăn chay..."
                    />
                  </div>
                </div>

                {/* Section: Message */}
                <div className="space-y-3 group pt-4">
                  <label className="subheading block text-[10px] tracking-[0.25em] transition-colors group-focus-within:text-primary">Lời nhắn gửi đến Ban tổ chức</label>
                  <textarea
                    name="note"
                    rows={2}
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary focus:outline-none transition-all placeholder:opacity-20 font-light text-lg resize-none"
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
                    className="relative px-12 py-5 overflow-hidden group border border-primary/20 transition-all duration-700 hover:border-primary disabled:opacity-50"
                  >
                    <span className="relative z-10 text-xs uppercase tracking-[0.4em] font-medium transition-colors duration-500 group-hover:text-background">
                      {formStatus === "submitting" ? "Đang gửi..." : "Gửi phản hồi"}
                    </span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* 6. Dresscode — Upgraded Timeline & Illustration View */}
        <div ref={dresscodeTrigger} className="bg-background">
          <section className="min-h-screen w-full flex flex-col justify-center overflow-hidden" id="dresscode-section">
            <div className="content-wrapper max-w-6xl">
              <div className="mb-10 space-y-4 text-center">
                <h2 className="heading-lg">Quy chuẩn trang phục</h2>
                <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
                <p className="text-elegant opacity-60">Dresscode for an Elegant Atmosphere</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch h-[400px] md:h-[500px]">
                {/* Left Timeline - Vertical Axis */}
                <div className="w-full lg:w-48 relative flex flex-col h-full">
                  <div className="relative grid grid-rows-3 h-full pl-8 lg:pl-12">
                    {/* Vertical Axis Line */}
                    <div className="absolute left-0 top-[15px] bottom-[15px] w-[1px] bg-primary/5 hidden lg:block"></div>

                    {/* Vertical Progress Line */}
                    <div
                      className="absolute left-0 top-[15px] w-[1px] bg-primary/30 transition-all duration-1000 ease-in-out hidden lg:block"
                      style={{
                        height: `${(activeDresscode / (dresscodeData.length - 1)) * 100}%`,
                      }}
                    ></div>

                    {dresscodeData.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col justify-center relative z-10 transition-all duration-700 ${activeDresscode === idx ? 'opacity-100' : 'opacity-20'}`}
                      >
                        <h3 className={`text-sm md:text-base font-medium tracking-[0.1em] uppercase transition-colors ${activeDresscode === idx ? 'text-primary' : ''}`}>
                          {item.title}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">{item.subtitle}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Illustration & Details */}
                <div className="flex-1 grid grid-cols-2 gap-8 md:gap-16 items-center">
                  {/* Women Side */}
                  <div className="flex flex-col items-center space-y-4 animate-fade-in" key={`women-${activeDresscode}`}>
                    <div className="relative h-[250px] md:h-[350px] w-full flex items-center justify-center">
                      <img 
                        src={dresscodeData[activeDresscode].womenImg} 
                        alt="Women Dresscode" 
                        className="h-full object-contain"
                      />
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-[10px] md:text-[11px] font-light max-w-[200px] mx-auto opacity-70 italic leading-relaxed">
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
                    <div className="relative h-[250px] md:h-[350px] w-full flex items-center justify-center">
                      <img 
                        src={dresscodeData[activeDresscode].menImg} 
                        alt="Men Dresscode" 
                        className="h-full object-contain"
                      />
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-[10px] md:text-[11px] font-light max-w-[200px] mx-auto opacity-70 italic leading-relaxed">
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
          </section>
        </div>

        {/* 7. Contact Us */}
        <section className="section-container section-accent">
          <div className="content-wrapper">
            <div className="mb-16 space-y-4 text-center">
              <h2 className="heading-lg">Liên hệ</h2>
              <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
              <p className="text-elegant opacity-60">Hỗ trợ thông tin trực tiếp</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <h3 className="heading-md mb-2">Đơn vị 1</h3>
                <p className="font-light text-lg">Người đại diện 1</p>
                <a href="mailto:rep1@example.com" className="text-sm opacity-60 mt-2 hover:opacity-100 transition-opacity">rep1@example.com</a>
                <p className="text-sm opacity-60 mt-1">+84 123 456 789</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="heading-md mb-2">Đơn vị 2</h3>
                <p className="font-light text-lg">Người đại diện 2</p>
                <a href="mailto:rep2@example.com" className="text-sm opacity-60 mt-2 hover:opacity-100 transition-opacity">rep2@example.com</a>
                <p className="text-sm opacity-60 mt-1">+84 123 456 789</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="heading-md mb-2">Đơn vị 3</h3>
                <p className="font-light text-lg">Người đại diện 3</p>
                <a href="mailto:rep3@example.com" className="text-sm opacity-60 mt-2 hover:opacity-100 transition-opacity">rep3@example.com</a>
                <p className="text-sm opacity-60 mt-1">+84 123 456 789</p>
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
          <div className="relative z-20 content-wrapper max-w-4xl px-8 flex flex-col items-center">
            <div className="flex flex-col items-center text-center">
              {/* Subheading — Synced size with Hero */}
              <p
                className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-light !text-white opacity-60 mb-4"
              >
                See you at The Sinfonia
              </p>

              {/* Main Title — Synced size with Hero */}
              <h2 className={`${purgatory.className} text-[4.5rem] md:text-[7rem] lg:text-[9rem] !text-white lowercase tracking-tight leading-none`}>
                Thank you
              </h2>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
