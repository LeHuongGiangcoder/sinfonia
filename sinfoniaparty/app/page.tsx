"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { amsterdam } from "@/lib/fonts";
import Entrance from "@/components/Entrance";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const agendaTrigger = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAgenda, setActiveAgenda] = useState<number>(0);
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
    }
  }, { scope: container, dependencies: [isLoading] });

  return (
    <>
      {isLoading && <Entrance onComplete={() => setIsLoading(false)} />}
      <div ref={container} className={`min-h-screen ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}>
      {/* 1 & 2. Opening & Hero Section */}
      <section className="section-container">
        <div className="hero-content content-wrapper">
          <h2 className="subheading mb-4">Trân trọng kính mời</h2>
          <h1 className={`${amsterdam.className} heading-xl mb-8 lowercase`}>The Sinfonia</h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            Nơi hội ngộ của sự sang trọng và di sản ngành cưới Việt Nam.
          </p>
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
            <div className="group relative p-12 md:p-16 bg-background/40 backdrop-blur-sm border border-primary/10 rounded-xs shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col items-center justify-center overflow-hidden">
              {/* Decorative Corner Frames */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-primary/20 transition-all duration-500 group-hover:w-16 group-hover:h-16"></div>
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-primary/20 transition-all duration-500 group-hover:w-16 group-hover:h-16"></div>
              
              <div className="space-y-8 relative z-10">
                <h3 className="subheading">Thời gian diễn ra</h3>
                <div className="text-center space-y-2">
                  <p className="text-xl md:text-2xl font-light tracking-wide italic opacity-80">Thứ Ba & Thứ Tư</p>
                  <p className={`${amsterdam.className} text-6xl md:text-7xl text-primary lowercase leading-tight py-2`}>
                    02 & 03 Tháng 6
                  </p>
                  <p className="text-base tracking-[0.4em] font-light opacity-40 uppercase">Mùa hạ năm 2026</p>
                </div>
              </div>
              
              {/* Subtle Background Ornament */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-primary/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
            </div>

            {/* Location Card */}
            <div className="group relative p-12 md:p-16 bg-background/40 backdrop-blur-sm border border-primary/10 rounded-xs shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col items-center justify-center overflow-hidden">
              {/* Decorative Corner Frames */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-primary/20 transition-all duration-500 group-hover:w-16 group-hover:h-16"></div>
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-primary/20 transition-all duration-500 group-hover:w-16 group-hover:h-16"></div>

              <div className="space-y-8 relative z-10 text-center">
                <h3 className="subheading">Địa điểm tổ chức</h3>
                <div className="space-y-4">
                  <p className="text-3xl md:text-4xl font-normal leading-tight text-primary">
                    Wyndham Sky Lake <br /> 
                    <span className="font-light italic text-2xl md:text-3xl opacity-80">Resort & Villas</span>
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-40">Chương Mỹ, Hà Nội, Việt Nam</p>
                </div>

                <div className="pt-6">
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
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-primary group-hover/link:opacity-0 transition-opacity"></div>
                  </a>
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
        <section className="min-h-screen w-full flex items-center overflow-hidden py-24" id="agenda-section">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="mb-16 space-y-4 text-center">
              <h2 className="heading-lg">Chương trình</h2>
              <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
              <p className="text-elegant opacity-60">Dấu ấn của những khoảnh khắc</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-16 items-stretch h-[450px] md:h-[500px]">
            {/* Vertical Timeline Bar - Typographic Minimalist */}
            <div className="w-full lg:w-64 relative flex flex-col order-2 lg:order-1 h-full">
              {/* The items container itself will define the height for the line */}
              <div className="relative flex flex-row lg:flex-col justify-between h-full pl-8 lg:pl-12">
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
                    className={`flex lg:flex-row flex-col items-center lg:items-start group relative z-10 transition-all duration-700 ${activeAgenda === idx ? 'opacity-100' : 'opacity-20'}`}
                  >
                    {/* Time Label */}
                    <div className="lg:w-16 lg:mr-8 mb-2 lg:mb-0">
                      <span className={`text-xs md:text-sm font-light tabular-nums transition-colors duration-500 ${activeAgenda === idx ? 'text-primary' : ''}`}>
                        {item.time}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <div className="transition-all duration-700">
                      <h3 className={`text-[11px] md:text-xs font-medium tracking-[0.15em] uppercase transition-colors ${activeAgenda === idx ? 'text-primary' : ''}`}>
                        {item.title}
                      </h3>
                      <p className={`text-[9px] md:text-[10px] font-light mt-1 transition-all duration-500 ${activeAgenda === idx ? 'opacity-60 block' : 'opacity-0 hidden'}`}>
                        {item.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Overview - Right */}
            <div className="flex-1 relative aspect-video lg:aspect-auto min-h-[400px] lg:min-h-0 overflow-hidden rounded-sm border border-primary/10 bg-accent/10 shadow-2xl group/map order-1 lg:order-2">
              {/* The Map Image */}
              <img 
                src="/assets/map%201.png" 
                alt="Sinfonia Overview Map" 
                className="w-full h-full object-cover opacity-80 saturate-[0.7]"
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
            <div className="text-center py-12 space-y-4">
              <h3 className="heading-md">Cảm ơn bạn đã phản hồi</h3>
              <p className="text-elegant">Chúng tôi đã nhận được thông tin và rất mong được đón tiếp bạn.</p>
              <button onClick={() => setFormStatus("idle")} className="text-sm underline opacity-60 hover:opacity-100">Gửi phản hồi khác</button>
            </div>
          ) : (
            <form className="space-y-8 text-left" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="subheading block opacity-100">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className="space-y-2">
                <label className="subheading block opacity-100">Tên đơn vị / Thương hiệu</label>
                <input
                  type="text"
                  name="business"
                  required
                  value={formData.business}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30"
                  placeholder="Nhập tên doanh nghiệp"
                />
              </div>

              <div className="space-y-4">
                <label className="subheading block opacity-100">Bạn sẽ tham dự cùng chúng tôi chứ?</label>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="confirmation"
                      required
                      value="absolutely! cant wait"
                      checked={formData.confirmation === "absolutely! cant wait"}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="font-light group-hover:opacity-100 opacity-70 transition-opacity">Chắc chắn rồi! Rất mong chờ.</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="confirmation"
                      value="Maybe next time"
                      checked={formData.confirmation === "Maybe next time"}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="font-light group-hover:opacity-100 opacity-70 transition-opacity">Hẹn dịp khác nhé.</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="subheading block opacity-100">Số lượng người tham dự</label>
                  <input
                    type="number"
                    name="attendants"
                    min="1"
                    value={formData.attendants}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-primary py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="subheading block opacity-100">Yêu cầu về thực đơn</label>
                  <input
                    type="text"
                    name="meal_preference"
                    value={formData.meal_preference}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30"
                    placeholder="Dị ứng, ăn chay..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="subheading block opacity-100">Lời nhắn gửi đến Ban tổ chức</label>
                <textarea
                  name="note"
                  rows={3}
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30 resize-none"
                  placeholder="Bạn có muốn nhắn nhủ điều gì không?"
                ></textarea>
              </div>

              {formStatus === "error" && (
                <p className="text-red-800 text-sm italic">Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp với chúng tôi.</p>
              )}

              <div className="text-center pt-8">
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="btn-secondary disabled:opacity-50"
                >
                  {formStatus === "submitting" ? "Đang gửi..." : "Gửi phản hồi"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 6. Dresscode */}
      <section className="section-container">
        <div className="content-wrapper max-w-4xl">
          <div className="mb-16 space-y-4">
            <h2 className="heading-lg">Quy chuẩn trang phục</h2>
            <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
            <p className="text-elegant opacity-60">Dresscode for an Elegant Atmosphere</p>
          </div>
          
          <div className="border border-primary/10 rounded-sm overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_2fr] bg-primary/[0.03] border-b border-primary/10">
              <div className="p-6 hidden md:block"></div>
              <div className="p-6 text-center border-l border-primary/10">
                <h4 className="subheading !opacity-100 text-primary">Dành cho Nữ</h4>
              </div>
              <div className="p-6 text-center border-l border-primary/10">
                <h4 className="subheading !opacity-100 text-primary">Dành cho Nam</h4>
              </div>
            </div>

            {/* Activities Rows */}
            {[
              {
                activity: "Đón khách",
                eng: "Welcoming",
                women: "Váy lụa màu Pastel (Pastel silk dress)",
                men: "Vest hoặc Blazer (Đen hoặc có màu)"
              },
              {
                activity: "Tiệc tối",
                eng: "Dinner",
                women: "Đầm dạ hội sang trọng (Tông màu Olive hoặc Đen)",
                men: "Suit / Tuxedo lịch lãm (Tông màu Olive hoặc Đen)"
              },
              {
                activity: "Tiệc hồ bơi",
                eng: "After Party",
                women: "Trang phục hồ bơi / Bikini (Pool Party Chic)",
                men: "Quần short / Trang phục bơi thoải mái"
              }
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_2fr] border-b last:border-b-0 border-primary/10 items-stretch">
                <div className="p-6 bg-primary/[0.01] flex flex-col justify-center">
                  <h3 className="text-xl font-medium">{item.activity}</h3>
                  <p className="text-xs uppercase tracking-widest opacity-40 mt-1">{item.eng}</p>
                </div>
                
                {/* Mobile Labels are shown only on small screens */}
                <div className="p-8 border-t md:border-t-0 md:border-l border-primary/10 flex flex-col justify-center">
                  <span className="md:hidden subheading mb-2 block">Nữ</span>
                  <p className="font-light">{item.women}</p>
                </div>
                <div className="p-8 border-t md:border-t-0 md:border-l border-primary/10 flex flex-col justify-center">
                  <span className="md:hidden subheading mb-2 block">Nam</span>
                  <p className="font-light">{item.men}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-elegant">"Sự thanh lịch là vẻ đẹp không bao giờ phai nhạt."</p>
          </div>
        </div>
      </section>

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

      {/* 8. Thank you note */}
      <section className="py-32 section-accent border-t border-primary/10">
        <div className="content-wrapper">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="heading-lg">Cảm ơn bạn</h2>
            <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
            <p className="text-elegant opacity-60">Hẹn gặp bạn tại The Sinfonia</p>
          </div>
          <p className="text-elegant max-w-lg mx-auto">
            Chúng tôi rất mong được chia sẻ trải nghiệm tuyệt vời này cùng bạn tại The Sinfonia.
          </p>
        </div>
      </section>
      </div>
    </>
  );
}
