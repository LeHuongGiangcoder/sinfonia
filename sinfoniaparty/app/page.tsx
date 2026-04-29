"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { amsterdam } from "@/lib/fonts";

gsap.registerPlugin(useGSAP);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

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
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="hero-content">
          <h2 className="text-sm uppercase tracking-[0.3em] mb-4 opacity-80">You are invited to</h2>
          <h1 className={`${amsterdam.className} text-6xl md:text-8xl lg:text-9xl mb-8 lowercase`}>The Sinfonia</h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto font-sans">
            A gathering of elegance and heritage for the wedding industry in Vietnam.
          </p>
        </div>
      </section>

      {/* 3. Time & Places */}
      <section className="min-h-screen flex items-center justify-center bg-[#f3ede1] py-20">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-5xl mb-16">Time & Places</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-6">
              <h3 className="text-sm uppercase tracking-[0.3em] opacity-70">The Date</h3>
              <div className="space-y-1">
                <p className="text-3xl font-light">Tuesday & Wednesday</p>
                <p className="text-4xl font-normal text-primary">02 & 03 June 2026</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm uppercase tracking-[0.3em] opacity-70">The Venue</h3>
              <div className="space-y-2">
                <p className="text-3xl font-light leading-snug">Wyndham Sky Lake <br /> Resort & Villas</p>
              </div>
              <a 
                href="https://maps.app.goo.gl/joX5qdMXjJcBBuwVA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm uppercase tracking-widest border-b border-primary pb-1 hover:opacity-60 transition-opacity"
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Agendas */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl mb-6">Agendas</h2>
          <p>Coming soon...</p>
        </div>
      </section>

      {/* 5. RSVP */}
      <section className="min-h-screen flex items-center justify-center bg-[#f3ede1] py-20">
        <div className="w-full max-w-2xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl mb-4">RSVP</h2>
            <p className="font-light italic">Will you join us in this symphony of elegance?</p>
          </div>
          
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="block text-sm uppercase tracking-widest opacity-70">Your distinguished name</label>
              <input type="text" className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30" placeholder="Full name" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm uppercase tracking-widest opacity-70">You are representing (The business name)</label>
              <input type="text" className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30" placeholder="Your business or brand" />
            </div>

            <div className="space-y-4">
              <label className="block text-sm uppercase tracking-widest opacity-70">Will you grace us with your presence?</label>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="radio" name="confirmation" className="w-4 h-4 accent-primary" />
                  <span className="font-light group-hover:opacity-100 opacity-70 transition-opacity">Absolutely! Can't wait.</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="radio" name="confirmation" className="w-4 h-4 accent-primary" />
                  <span className="font-light group-hover:opacity-100 opacity-70 transition-opacity">Maybe next time.</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm uppercase tracking-widest opacity-70">Number of attendants</label>
                <input type="number" min="1" className="w-full bg-transparent border-b border-primary py-2 focus:outline-none" defaultValue="1" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm uppercase tracking-widest opacity-70">Meal preferences</label>
                <input type="text" className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30" placeholder="e.g. Vegetarian, Allergies..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm uppercase tracking-widest opacity-70">A note for the host</label>
              <textarea rows={3} className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30 resize-none" placeholder="Anything else you'd like to share?"></textarea>
            </div>

            <div className="text-center pt-8">
              <button type="submit" className="px-12 py-4 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-500 uppercase tracking-[0.2em] text-sm">
                Send Response
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 6. Dresscode */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl mb-6">Dresscode</h2>
          <p>European Vintage</p>
        </div>
      </section>

      {/* 7. Contact Us */}
      <section className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center w-full max-w-5xl px-4">
          <h2 className="text-5xl mb-16">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <h3 className="text-2xl mb-2">Vendor Name 1</h3>
              <p className="font-light text-lg">Representative 1</p>
              <a href="mailto:rep1@example.com" className="text-sm opacity-60 mt-2 hover:opacity-100 transition-opacity">rep1@example.com</a>
              <p className="text-sm opacity-60 mt-1">+84 123 456 789</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl mb-2">Vendor Name 2</h3>
              <p className="font-light text-lg">Representative 2</p>
              <a href="mailto:rep2@example.com" className="text-sm opacity-60 mt-2 hover:opacity-100 transition-opacity">rep2@example.com</a>
              <p className="text-sm opacity-60 mt-1">+84 123 456 789</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl mb-2">Vendor Name 3</h3>
              <p className="font-light text-lg">Representative 3</p>
              <a href="mailto:rep3@example.com" className="text-sm opacity-60 mt-2 hover:opacity-100 transition-opacity">rep3@example.com</a>
              <p className="text-sm opacity-60 mt-1">+84 123 456 789</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Thank you note */}
      <section className="py-32 flex flex-col items-center justify-center text-center bg-[#f3ede1]">
        <h2 className="text-5xl mb-6">Thank You</h2>
        <p className="text-lg font-light max-w-lg mx-auto">
          We look forward to sharing this elegant experience with you at The Sinfonia.
        </p>
      </section>
    </div>
  );
}
