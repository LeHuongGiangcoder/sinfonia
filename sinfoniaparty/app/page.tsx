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
      <section className="section-container">
        <div className="hero-content content-wrapper">
          <h2 className="subheading mb-4">You are invited to</h2>
          <h1 className={`${amsterdam.className} heading-xl mb-8 lowercase`}>The Sinfonia</h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            A gathering of elegance and heritage for the wedding industry in Vietnam.
          </p>
        </div>
      </section>

      {/* 3. Time & Places */}
      <section className="section-container section-accent">
        <div className="content-wrapper">
          <h2 className="heading-lg mb-16">Time & Places</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 text-center">
            <div className="space-y-6">
              <h3 className="subheading">The Date</h3>
              <div className="space-y-1">
                <p className="text-3xl font-light">Tuesday & Wednesday</p>
                <p className="text-4xl font-normal text-primary">02 & 03 June 2026</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="subheading">The Venue</h3>
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
      <section className="section-container">
        <div className="content-wrapper">
          <h2 className="heading-lg mb-6">Agendas</h2>
          <p className="text-elegant">A curation of moments yet to be revealed.</p>
        </div>
      </section>

      {/* 5. RSVP */}
      <section className="section-container section-accent">
        <div className="content-wrapper max-w-2xl">
          <div className="mb-12">
            <h2 className="heading-lg mb-4">RSVP</h2>
            <p className="text-elegant">Will you join us in this symphony of elegance?</p>
          </div>
          
          <form className="space-y-8 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="subheading block opacity-100">Your distinguished name</label>
              <input type="text" className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30" placeholder="Full name" />
            </div>

            <div className="space-y-2">
              <label className="subheading block opacity-100">You are representing</label>
              <input type="text" className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30" placeholder="Your business or brand" />
            </div>

            <div className="space-y-4">
              <label className="subheading block opacity-100">Will you grace us with your presence?</label>
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
                <label className="subheading block opacity-100">Number of attendants</label>
                <input type="number" min="1" className="w-full bg-transparent border-b border-primary py-2 focus:outline-none" defaultValue="1" />
              </div>
              <div className="space-y-2">
                <label className="subheading block opacity-100">Meal preferences</label>
                <input type="text" className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30" placeholder="e.g. Vegetarian, Allergies..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="subheading block opacity-100">A note for the host</label>
              <textarea rows={3} className="w-full bg-transparent border-b border-primary py-2 focus:outline-none placeholder:opacity-30 resize-none" placeholder="Anything else you'd like to share?"></textarea>
            </div>

            <div className="text-center pt-8">
              <button type="submit" className="btn-secondary">
                Send Response
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 6. Dresscode */}
      <section className="section-container">
        <div className="content-wrapper">
          <h2 className="heading-lg mb-6">Dresscode</h2>
          <p className="text-3xl font-light mb-4">European Vintage</p>
          <p className="subheading">Elegance is the only beauty that never fades.</p>
        </div>
      </section>

      {/* 7. Contact Us */}
      <section className="section-container section-accent">
        <div className="content-wrapper">
          <h2 className="heading-lg mb-16">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <h3 className="heading-md mb-2">Vendor Name 1</h3>
              <p className="font-light text-lg">Representative 1</p>
              <a href="mailto:rep1@example.com" className="text-sm opacity-60 mt-2 hover:opacity-100 transition-opacity">rep1@example.com</a>
              <p className="text-sm opacity-60 mt-1">+84 123 456 789</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="heading-md mb-2">Vendor Name 2</h3>
              <p className="font-light text-lg">Representative 2</p>
              <a href="mailto:rep2@example.com" className="text-sm opacity-60 mt-2 hover:opacity-100 transition-opacity">rep2@example.com</a>
              <p className="text-sm opacity-60 mt-1">+84 123 456 789</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="heading-md mb-2">Vendor Name 3</h3>
              <p className="font-light text-lg">Representative 3</p>
              <a href="mailto:rep3@example.com" className="text-sm opacity-60 mt-2 hover:opacity-100 transition-opacity">rep3@example.com</a>
              <p className="text-sm opacity-60 mt-1">+84 123 456 789</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Thank you note */}
      <section className="py-32 section-accent border-t border-primary/10">
        <div className="content-wrapper">
          <h2 className="heading-lg mb-6">Thank You</h2>
          <p className="text-elegant max-w-lg mx-auto">
            We look forward to sharing this elegant experience with you at The Sinfonia.
          </p>
        </div>
      </section>
    </div>
  );
}
