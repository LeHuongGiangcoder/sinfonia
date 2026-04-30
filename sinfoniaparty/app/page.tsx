"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { amsterdam } from "@/lib/fonts";

gsap.registerPlugin(useGSAP);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    confirmation: "",
    attendants: "1",
    meal_preference: "",
    note: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      const response = await fetch("https://n8n.giangle.site/webhook-test/c61cf4eb-bdec-47fa-bec4-e6e8210c8beb", {
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

  useGSAP(() => {
    // Initial hero fade in
    gsap.from(".hero-content", {
      y: 30,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      stagger: 0.2,
    });
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen">
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

      {/* 3. Time & Places */}
      <section className="section-container section-accent">
        <div className="content-wrapper">
          <h2 className="heading-lg mb-16">Thời gian & Địa điểm</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 text-center">
            <div className="space-y-6">
              <h3 className="subheading">Ngày diễn ra</h3>
              <div className="space-y-1">
                <p className="text-3xl font-light">Thứ Ba & Thứ Tư</p>
                <p className="text-4xl font-normal text-primary">02 & 03 Tháng 6, 2026</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="subheading">Địa điểm</h3>
              <div className="space-y-2">
                <p className="text-3xl font-light leading-snug">Wyndham Sky Lake <br /> Resort & Villas</p>
              </div>
              <a
                href="https://maps.app.goo.gl/joX5qdMXjJcBBuwVA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm uppercase tracking-widest border-b border-primary pb-1 hover:opacity-60 transition-opacity"
              >
                Xem trên Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Agendas */}
      <section className="section-container">
        <div className="content-wrapper max-w-4xl">
          <h2 className="heading-lg mb-16">Chương trình</h2>
          
          <div className="space-y-0 border-t border-primary/20">
            {[
              { time: "12:00", title: "CHECK IN", location: "Lobby Lounge", details: [] },
              { time: "14:30", title: "TEA BREAK", location: "Sinfonia Garden", details: [] },
              { 
                time: "15:00", 
                title: "WELCOME + WORKSHOP", 
                location: "Grand Ballroom", 
                details: ["Khai mạc", "Workshop"] 
              },
              { 
                time: "16:30", 
                title: "CATCH THE SUN", 
                location: "Sunset Terrace", 
                details: ["Cocktail", "Live music"] 
              },
              { 
                time: "18:30", 
                title: "A SKY FULL OF STARS", 
                location: "Starlight Dining", 
                details: ["Dinner", "Drinking game"] 
              },
              { 
                time: "20:30", 
                title: "MIDNIGHT REVERIE", 
                location: "Infinity Pool", 
                details: ["Fireworks", "DJ", "Pool Party"] 
              },
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 py-8 border-b border-primary/10 gap-8 items-start hover:bg-primary/[0.02] transition-colors px-4">
                <div className="flex items-baseline space-x-6">
                  <span className="text-2xl font-light opacity-50 tabular-nums min-w-[70px]">{item.time}</span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium tracking-wide">{item.title}</h3>
                    {item.details.length > 0 && (
                      <ul className="space-y-1">
                        {item.details.map((detail, dIdx) => (
                          <li key={dIdx} className="text-sm opacity-60 font-light flex items-center">
                            <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-40"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="md:text-right flex flex-col md:items-end justify-center h-full">
                  <span className="subheading !opacity-100 mb-1">Địa điểm</span>
                  <span className="text-lg font-light italic text-primary/80">{item.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 border border-primary/10 bg-primary/[0.02] text-center italic">
            <p className="text-sm opacity-70">
              * Thời gian thay đổi layout (trang phục, makeup) đã được tính toán và tích hợp sẵn trong agenda.
            </p>
          </div>
        </div>
      </section>

      {/* 5. RSVP */}
      <section className="section-container section-accent">
        <div className="content-wrapper max-w-2xl">
          <div className="mb-12">
            <h2 className="heading-lg mb-4">RSVP</h2>
            <p className="text-elegant">Bạn sẽ cùng chúng tôi hòa nhịp trong bản giao hưởng sang trọng này chứ?</p>
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
        <div className="content-wrapper">
          <h2 className="heading-lg mb-6">Trang phục</h2>
          <p className="text-3xl font-light mb-4">European Vintage</p>
          <p className="subheading">Sự thanh lịch là vẻ đẹp không bao giờ phai nhạt.</p>
        </div>
      </section>

      {/* 7. Contact Us */}
      <section className="section-container section-accent">
        <div className="content-wrapper">
          <h2 className="heading-lg mb-16">Liên hệ</h2>
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
          <h2 className="heading-lg mb-6">Cảm ơn bạn</h2>
          <p className="text-elegant max-w-lg mx-auto">
            Chúng tôi rất mong được chia sẻ trải nghiệm tuyệt vời này cùng bạn tại The Sinfonia.
          </p>
        </div>
      </section>
    </div>
  );
}
