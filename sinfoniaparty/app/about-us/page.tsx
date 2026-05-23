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
    { name: "RSVP", href: "/?skipEntrance=true#rsvp-section" },
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

const VendorCard = ({ role, title, logo, description, quote, link, delay = 0, isSpecial = false }: {
  role: string;
  title: string;
  logo: string;
  description: React.ReactNode;
  quote?: string;
  link?: string;
  delay?: number;
  isSpecial?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 95%",
        toggleActions: "play none none reverse",
      },
      y: 15,
      opacity: 0,
      duration: 0.5,
      delay: delay * 0.12,
      ease: "power2.out",
    });
  }, { scope: cardRef });

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent toggle if the user clicks the external link or any of its children
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      ref={cardRef} 
      onClick={handleCardClick}
      className={`vendor-card group relative bg-white/60 backdrop-blur-md border border-primary/10 p-6 md:p-8 hover:bg-white/90 hover:border-primary/20 transition-all duration-500 ease-out rounded-sm shadow-xs hover:shadow-md cursor-pointer select-none w-full ${isExpanded ? 'md:col-span-4 max-w-none' : 'md:col-span-1 max-w-md'}`}
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
        <img src="/assets/component/18.svg" className="w-24 h-24 rotate-45" alt="" />
      </div>
      
      <div className={`flex items-center relative z-10 gap-6 md:gap-12 transition-all duration-500 ease-out ${isExpanded ? 'flex-col md:flex-row' : 'flex-col'}`}>
        <div className={`w-full flex flex-col items-center justify-center space-y-6 transition-all duration-500 ease-out ${isExpanded ? 'md:w-1/3' : 'md:w-full'}`}>
          <p className="text-[9px] uppercase tracking-[0.3em] text-primary/60 font-medium whitespace-nowrap text-center">
            {role}
          </p>
          {link ? (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[180px] md:max-w-[200px] aspect-square bg-primary/5 border border-primary/10 rounded-sm flex items-center justify-center p-4 hover:border-primary/40 group-hover:border-primary/30 transition-colors duration-500 shadow-[inset_0_0_20px_rgba(75,80,6,0.02)] cursor-pointer shrink-0"
            >
              <img src={`/assets/logo%20webp/${logo}`} alt={title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
            </a>
          ) : (
            <div className="w-full max-w-[180px] md:max-w-[200px] aspect-square bg-primary/5 border border-primary/10 rounded-sm flex items-center justify-center p-4 group-hover:border-primary/30 transition-colors duration-500 shadow-[inset_0_0_20px_rgba(75,80,6,0.02)] shrink-0">
              <img src={`/assets/logo%20webp/${logo}`} alt={title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
            </div>
          )}
          <h3 className="text-xl md:text-2xl font-display text-primary text-center h-14 md:h-16 flex items-center justify-center w-full">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:underline hover:opacity-80 transition-all duration-300 inline-flex items-center gap-1.5 group/title"
              >
                {title}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 opacity-50 group-hover/title:opacity-100 transition-opacity duration-300 translate-y-[1px]">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            ) : (
              title
            )}
          </h3>

          {/* Interactive Cue */}
          <div className="pt-2 flex items-center gap-2 text-primary/60 group-hover:text-primary transition-colors duration-300 text-[10px] uppercase tracking-[0.2em] font-semibold">
            <span>{isExpanded ? "Thu gọn" : "Xem chi tiết"}</span>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              className={`w-3.5 h-3.5 transition-transform duration-500 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className={`transition-all duration-500 ease-out overflow-hidden flex flex-col justify-center w-full md:w-2/3 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="space-y-6 pt-2 pl-2">
            <div className="w-12 h-[1px] bg-primary/30"></div>
            <div className="space-y-4 text-foreground/80 font-light leading-relaxed text-sm md:text-base text-justify">
              {description}
            </div>
            
            {quote && (
              <div className="pt-6">
                <p className="text-primary italic font-display text-lg md:text-xl border-l border-primary/30 pl-6 py-2">
                  "{quote}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AboutUs() {
  const container = useRef<HTMLDivElement>(null);
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
    const tl = gsap.timeline();
    
    tl.to(".hero-overlay", {
      opacity: 1.0,
      duration: 2,
      ease: "power2.inOut"
    })
    .from(".hero-title", {
      y: 30,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=1.5")
    .from(".hero-line", {
      scaleX: 0,
      duration: 1.5,
      ease: "power4.out"
    }, "-=1")
    .from(".hero-desc", {
      y: 20,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=1");

    gsap.from(".partner-line", {
      scrollTrigger: {
        trigger: ".partner-line-trigger",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      yPercent: 100,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
    });

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-background text-foreground">
      <SimpleNavbar scrolled={scrolled} />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[url('/assets/hero%20back.png')] bg-cover bg-center bg-no-repeat opacity-0 hero-overlay pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <p className="hero-title text-[10px] uppercase tracking-[0.5em] font-medium" style={{ color: '#f3ede1', opacity: 0.8 }}>About</p>
            <h1 
              className={`hero-title ${purgatory.className} text-5xl md:text-7xl lg:text-8xl lowercase tracking-tight leading-[0.9]`}
              style={{ color: '#f3ede1' }}
            >
              The Sunset <br/> Sinfonia
            </h1>
            <div className="hero-line w-24 h-[1px] bg-primary/30 mx-auto mt-8 origin-center"></div>
          </div>
          
          <div className="hero-desc space-y-6 text-[#f3ede1]/85 font-light text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            <p>
              <strong className="font-semibold text-[#fff8eb]">THE SUNSET SINFONIA</strong> là nơi hoàng hôn, âm nhạc, nightlife và những kết nối đẹp cùng hòa vào một nhịp cảm xúc.
            </p>
            <p>
              Từ ánh chiều trên mặt hồ Sky Lake Wyndham, những signature mocktail mang tinh thần Ý, đến afterparty bùng nổ giữa âm nhạc và pháo hoa, tất cả được tạo nên như một “symphony” của mùa hè 2026 — nơi mỗi khoảnh khắc đều được chăm chút để trở thành một trải nghiệm đáng nhớ.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Intro */}
      <section className="py-20 md:py-32 px-6 bg-background relative z-20">
        <div className="max-w-4xl mx-auto text-center partner-line-trigger">
          <p className="text-xl md:text-2xl font-display italic text-primary/90 leading-relaxed flex flex-col items-center">
            <span className="block overflow-hidden py-1">
              <span className="partner-line inline-block">Behind every unforgettable experience is a</span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="partner-line inline-block">group of partners who helped shape the</span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="partner-line inline-block">atmosphere, aesthetic and emotions of THE</span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="partner-line inline-block font-bold">SUNSET SINFONIA.</span>
            </span>
          </p>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-12"></div>
        </div>
      </section>

      {/* Vendors List */}
      <section className="pb-32 px-4 md:px-6 bg-background relative z-20">
        <div className="vendors-grid-container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          <VendorCard 
            delay={0}
            role="Website & Digital Experience"
            title="Glow Website"
            logo="glow_logo.webp"
            isSpecial={true}
            link="https://www.facebook.com/profile.php?id=61560901527827"
            description={
              <>
                <p className="mb-4">
                  THE SUNSET SINFONIA gửi lời cảm ơn đặc biệt đến Glow Website, một trong những đơn vị đồng hành đầu tiên của chương trình.
                </p>
                <p className="mb-4">
                  Với tinh thần classic, old-money đầy tinh tế, website invitation không chỉ truyền tải đầy đủ thông tin sự kiện mà còn mở ra cảm xúc ngay từ “first touch” đầu tiên với khách mời.
                </p>
                <p>
                  Sự chỉn chu trong thẩm mỹ, tốc độ triển khai và tinh thần đồng hành từ đội ngũ Glow Website đã góp phần tạo nên một hành trình chuẩn bị đầy cảm hứng cho chương trình.
                </p>
              </>
            }
          />

          <VendorCard 
            delay={1}
            role="Invitation Design Partner"
            title="Light Wedding"
            logo="light_wedding_logo.webp"
            link="https://www.facebook.com/ThiepCuoiLight"
            description={
              <>
                <p className="mb-4">
                  BTC trân trọng cảm ơn Light Wedding đã đồng hành thiết kế bộ thiệp dành cho THE SUNSET SINFONIA.
                </p>
                <p className="mb-4">
                  Ngay từ những bản thiết kế đầu tiên, bộ thiệp đã gây ấn tượng bởi tinh thần tinh tế, sang trọng và giàu cảm xúc. Từ layout, chất liệu đến kỹ thuật in chìm, mọi chi tiết đều được chăm chút để bộ thiệp không chỉ là invitation, mà còn trở thành một phần của trải nghiệm trước thềm sự kiện.
                </p>
                <div className="mt-6 p-6 bg-primary/5 border border-primary/10 rounded-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-3 font-semibold">Lưu ý dành cho khách mời:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-3"><span className="text-primary">•</span> Bộ thiệp sẽ được gửi đến khách mời và các đối tác collab trước sự kiện 5 ngày</li>
                    <li className="flex gap-3"><span className="text-primary">•</span> Thiệp cứng đồng thời là ticket check-in tại Sky Lake Wyndham</li>
                  </ul>
                </div>
              </>
            }
          />

          <VendorCard 
            delay={2}
            role="Mocktail & Beverage Sponsor"
            title="Nguyên Liệu Bốn Phương"
            logo="nguyenlieubonphuong_logo.webp"
            link="https://www.facebook.com/nguyenlieubonphuongvietnam"
            description={
              <>
                <p className="mb-4">
                  Một trong những “signature moments” của THE SUNSET SINFONIA mùa hè 2026 chính là dòng mocktail lấy cảm hứng từ olive Ý — như chính tinh thần của cái tên Sinfonia.
                </p>
                <p className="mb-4">
                  Khi hoàng hôn dần nhuộm vàng mặt hồ, âm nhạc bắt đầu lên mood và pháo hoa thắp sáng bầu trời Sky Lake, những tầng cảm xúc của buổi tiệc cũng dần hòa vào cùng một nhịp.
                </p>
                <p>
                  Đồng hành cùng hành trình đó, Nguyên Liệu Bốn Phương sẽ là đơn vị tài trợ mocktail & beverage cho toàn bộ sự kiện, mang đến trải nghiệm thưởng thức mang đậm tinh thần sunset chill và nightlife energy.
                </p>
              </>
            }
            quote="Because sometimes, the right drink is the beginning of the best conversations."
          />

          <VendorCard 
            delay={3}
            role="Nightlife Experience Partner"
            title="Entropy"
            logo="entropy_logo.webp"
            link="https://www.facebook.com/entropycocktailclub"
            description={
              <>
                <p className="mb-4">
                  THE SUNSET SINFONIA sẽ chào đón sự đồng hành của Entropy — một trong những dấu ấn nightlife nổi bật tại Hà Nội.
                </p>
                <p className="mb-4">
                  Không chỉ mang âm nhạc và cocktail đến sự kiện, Entropy còn mang theo tinh thần của những đêm tiệc không ngủ: cuồng nhiệt, ngẫu hứng và giàu năng lượng kết nối.
                </p>
                <p>
                  Từ sunset chill bên hồ, pool party rực lửa đến afterparty bùng nổ dưới pháo hoa Sky Lake, toàn bộ không gian sẽ được dẫn dắt như một hành trình cảm xúc xuyên suốt giữa âm nhạc, ánh sáng và crowd energy.
                </p>
              </>
            }
            quote="See you when Sky Lake transforms into one of the most unforgettable nightlife-inspired wedding experiences of the summer."
          />

        </div>
      </section>
      
      {/* Footer / Back home */}
      <section className="py-20 flex flex-col items-center justify-center border-t border-primary/10">
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
