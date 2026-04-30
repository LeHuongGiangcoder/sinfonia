"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

const IMAGES = [
  "/assets/w7.jpeg",
  "/assets/w9.jpg",
  "/assets/w11.jpeg",
  "/assets/w13.jpeg",
  "/assets/w18.jpeg",
  "/assets/w24.jpeg",
  "/assets/w25.jpeg",
];

const LOGOS = [
  "/assets/fancy_logo.jpg",
  "/assets/wyndham logo.jpg",
  "/assets/glow_logo.jpg",
  "/assets/tada_logo.jpg",
  "/assets/entropy_logo.jpg",
  "/assets/marslow_logo.jpg",
  "/assets/win_booth_logo.jpg",
  "/assets/nguyenlieubonphuong_logo.jpg",
  "/assets/light_wedding_logo.jpg",
];

export default function Entrance({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressProxy = { value: 0 };
    const tl = gsap.timeline({
      onUpdate: () => {
        setProgress(Math.floor(progressProxy.value));
      },
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: onComplete,
        });
      },
    });

    // Phase 1: Photos (0 -> 80%)
    const photoDuration = 0.3;
    const totalPhotoTime = IMAGES.length * photoDuration;

    // Animate progress to 80 over the photo sequence
    tl.to(progressProxy, {
      value: 80,
      duration: totalPhotoTime,
      ease: "none"
    }, 0);

    IMAGES.forEach((src, index) => {
      tl.to({}, {
        duration: photoDuration,
        onStart: () => {
          if (imageContainerRef.current) {
            const rotation = (Math.random() - 0.5) * 15;
            const img = document.createElement("div");
            img.className = "absolute inset-0 flex items-center justify-center pointer-events-none";
            img.innerHTML = `<img src="${src}" class="w-[280px] md:w-[420px] aspect-[3/4] object-cover shadow-2xl border-[10px] border-white" style="transform: scale(0.5) rotate(${rotation}deg); opacity: 0;" />`;
            imageContainerRef.current.appendChild(img);

            gsap.to(img.querySelector("img"), {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.4)",
            });

            if (imageContainerRef.current.children.length > 5) {
              const oldImg = imageContainerRef.current.children[0];
              gsap.to(oldImg, {
                opacity: 0,
                scale: 1.2,
                duration: 0.4,
                onComplete: () => oldImg.remove()
              });
            }
          }
        }
      }, index * photoDuration);
    });

    // Phase 2: Pause at 80% with Message
    tl.to(imageContainerRef.current, { opacity: 0, scale: 1.2, duration: 0.6, ease: "power3.in" });
    tl.to(messageRef.current, {
      opacity: 1,
      duration: 0.8,
      onStart: () => {
        if (messageRef.current) messageRef.current.innerText = "Bạn gần tới rồi";
      }
    });
    tl.to({}, { duration: 0.8 }); // Hold at 80%
    tl.to(messageRef.current, { opacity: 0, duration: 0.4 });

    // Phase 3: Logos (80 -> 99%)
    // We start the progress animation and the logo sequence at the same time
    const logoSequenceStartTime = tl.duration();

    tl.to(progressProxy, {
      value: 99,
      duration: LOGOS.length * 0.4 + 1.6,
      ease: "power1.inOut"
    }, logoSequenceStartTime);

    tl.set(logoContainerRef.current, { display: "flex", opacity: 0 }, logoSequenceStartTime);
    tl.to(logoContainerRef.current, { opacity: 1, duration: 0.3 }, logoSequenceStartTime);

    LOGOS.forEach((src, index) => {
      tl.to({}, {
        duration: 0.4,
        onStart: () => {
          if (logoContainerRef.current) {
            logoContainerRef.current.innerHTML = `
              <div class="flex flex-col items-center justify-center" id="logo-showcase-item">
                <img src="${src}" class="h-32 md:h-48 w-auto object-contain" />
                <p class="subheading mt-8 !opacity-100 text-primary tracking-[0.2em] uppercase text-xs">Chúng tôi là 1 đội</p>
              </div>
            `;
            gsap.fromTo("#logo-showcase-item", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
          }
        }
      }, logoSequenceStartTime + 0.3 + (index * 0.4));
    });

    // Final Grid Transition
    const finalGridStartTime = logoSequenceStartTime + 0.3 + (LOGOS.length * 0.4);

    tl.to("#logo-showcase-item", { opacity: 0, y: -10, duration: 0.4 }, finalGridStartTime);

    tl.to(logoContainerRef.current, {
      duration: 1.5,
      onStart: () => {
        if (logoContainerRef.current) {
          logoContainerRef.current.innerHTML = `
            <div class="flex flex-col items-center gap-16 max-w-5xl px-8">
              <div class="grid grid-cols-3 gap-x-12 md:gap-x-20 gap-y-8 md:gap-y-12 items-center justify-items-center" id="final-grid">
                ${LOGOS.map((src, i) => `<img src="${src}" class="h-10 md:h-16 w-auto object-contain logo-grid-item" style="opacity: 0;" />`).join("")}
              </div>
              <p class="subheading !opacity-100 text-primary tracking-[0.4em] uppercase text-sm opacity-0" id="final-text">Để cùng mang đến</p>
            </div>
          `;

          gsap.to(".logo-grid-item", {
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "power2.out"
          });

          gsap.to("#final-text", {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.5,
            ease: "power2.out"
          });
        }
      }
    }, finalGridStartTime + 0.2);

    tl.to(progressProxy, { value: 100, duration: 0.4 }); // Hit 100 at the very end

    tl.to({}, { duration: 0.8 }); // Final breath

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#fff8eb] flex flex-col items-center justify-center overflow-hidden"
    >
      <div ref={imageContainerRef} className="absolute inset-0 flex items-center justify-center">
        {/* Photo Stack */}
      </div>

      <div ref={messageRef} className="absolute inset-0 flex items-center justify-center text-primary font-display text-4xl md:text-6xl opacity-0">
        {/* "Bạn gần tới rồi" */}
      </div>

      <div ref={logoContainerRef} className="hidden absolute inset-0 items-center justify-center">
        {/* Logo Showcase */}
      </div>

      {/* Progress Counter */}
      <div className="absolute bottom-12 right-12 text-primary font-display text-8xl md:text-[10rem] opacity-5 select-none pointer-events-none tabular-nums">
        {progress.toString().padStart(2, "0")}
      </div>

      {/* Brand Name */}
      <div className="absolute bottom-12 left-12 pointer-events-none">
        <h1 className="font-brand text-4xl text-primary opacity-20 lowercase">The Sinfonia</h1>
      </div>
    </div>
  );
}
