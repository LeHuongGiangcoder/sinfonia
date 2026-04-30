"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { amsterdam } from "@/lib/fonts";

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
  const [isCaptured, setIsCaptured] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startSequence = () => {
    if (isCaptured) return; // Guard against multiple clicks

    if (videoRef.current) {
      // Fade out the interactive hint as soon as the user clicks
      gsap.to(".pointing-hint", { opacity: 0, duration: 0.3 });

      videoRef.current.play();

      videoRef.current.onended = () => {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsCaptured(true);
            runMainAnimation();
          }
        });

        // 2. The Flash (Instant capture immediately after breathing video ends)
        tl.to(flashRef.current, {
          opacity: 1,
          duration: 0.1,
          ease: "power2.in",
        })
          .to(flashRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          });

        // 3. Scale down and fade out camera as loading begins
        tl.to(cameraRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in"
        }, "-=0.4");
      };
    }
  };

  const runMainAnimation = () => {
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
    tl.to({}, { duration: 0.8 });
    tl.to(messageRef.current, { opacity: 0, duration: 0.4 });

    // Phase 3: Logos (80 -> 99%)
    const logoSequenceStartTime = tl.duration();

    tl.to(progressProxy, {
      value: 99,
      duration: LOGOS.length * 0.4 + 1.6,
      ease: "power1.inOut"
    }, logoSequenceStartTime);

    tl.to("#logo-showcase-container", { display: "flex", opacity: 1, duration: 0.3 }, logoSequenceStartTime);

    LOGOS.forEach((src, index) => {
      tl.to({}, {
        duration: 0.25,
        onStart: () => {
          const container = document.getElementById("active-logo-container");
          if (container) {
            container.innerHTML = `<img src="${src}" class="h-full w-auto object-contain" id="current-logo" style="opacity: 0;" />`;
            gsap.to("#current-logo", { opacity: 1, duration: 0.15 });
          }
        }
      }, logoSequenceStartTime + 0.3 + (index * 0.25));
    });

    // Final Grid Transition
    const finalGridStartTime = logoSequenceStartTime + 0.3 + (LOGOS.length * 0.25);
    tl.to("#logo-showcase-container", { opacity: 0, duration: 0.2 }, finalGridStartTime);

    tl.to(logoContainerRef.current, {
      duration: 1.5,
      onStart: () => {
        if (logoContainerRef.current) {
          logoContainerRef.current.style.display = "flex";
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

    tl.to(progressProxy, { value: 100, duration: 0.4 });
    tl.to({}, { duration: 0.8 });
  };

  useEffect(() => {
    // Initial camera entrance
    gsap.fromTo(cameraRef.current,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#fff8eb] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Interactive Camera Section */}
      {!isCaptured && (
        <div
          ref={cameraRef}
          onClick={startSequence}
          className="relative z-20 flex items-center justify-center cursor-pointer -translate-y-6"
        >
          <div className="relative flex items-center justify-center group w-fit h-fit">
            <video
              ref={videoRef}
              src="/assets/camera motion.mp4"
              className="w-[90vw] md:w-[55rem] h-auto transition-transform duration-300 ease-out group-hover:scale-105"
              muted
              playsInline
              preload="auto"
            />

            {/* Refined 1-Finger Pointing Hint - Positioned Near Right Corner */}
            <div className="pointing-hint absolute top-20 right-0 md:top-36 md:right-0 pointer-events-none animate-bounce-slow flex flex-col items-center gap-2">
              <div className="relative w-12 h-12 md:w-20 md:h-20">
                {/* Delicate Sparkle Lines at Fingertip */}
                <div className="absolute -bottom-1 -left-1 flex gap-1 opacity-60 rotate-[225deg]">
                  <div className="w-[1px] h-2 bg-primary rounded-full"></div>
                  <div className="w-[1px] h-3 bg-primary rounded-full"></div>
                  <div className="w-[1px] h-2 bg-primary rounded-full"></div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-primary rotate-[225deg]">
                  <path d="M12 10V4a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v7" />
                  <path d="M12 10a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
                  <path d="M16 12a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
                  <path d="M20 14a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
                  <path d="M12 22h4a8 8 0 0 0 8-8v-2" />
                  <path d="M6 10l-3 3a2 2 0 0 0 0 2.8l4 4a8 8 0 0 0 5 2.2" />
                </svg>
              </div>
              <p className="subheading !opacity-100 text-primary tracking-[0.4em] uppercase text-[10px] md:text-xs whitespace-nowrap">
                Click to capture
              </p>
            </div>

            {/* Pulsing Hint Overlay - Simplified */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
          </div>
        </div>
      )}

      {/* Camera Flash */}
      <div
        ref={flashRef}
        className="fixed inset-0 bg-white z-[100] opacity-0 pointer-events-none"
      />

      <div ref={imageContainerRef} className="absolute inset-0 flex items-center justify-center">
        {/* Photo Stack */}
      </div>

      <div ref={messageRef} className="absolute inset-0 flex items-center justify-center text-primary font-display text-4xl md:text-6xl opacity-0">
        {/* "Bạn gần tới rồi" */}
      </div>

      <div id="logo-showcase-container" className="hidden absolute inset-0 items-center justify-center opacity-0">
        <div className="flex flex-col items-center justify-center">
          <div id="active-logo-container" className="h-32 md:h-48 flex items-center justify-center"></div>
          <p className="subheading mt-8 !opacity-100 text-primary tracking-[0.2em] uppercase text-xs">Chúng tôi là 1 đội</p>
        </div>
      </div>

      <div ref={logoContainerRef} className="hidden absolute inset-0 items-center justify-center">
        {/* Final Grid */}
      </div>

      {/* Progress Counter */}
      <div className={`absolute bottom-12 right-12 text-primary font-display text-6xl md:text-8xl select-none pointer-events-none tabular-nums flex items-baseline transition-opacity duration-500 ${isCaptured ? 'opacity-10' : 'opacity-0'}`}>
        {progress.toString().padStart(2, "0")}
        <span className="text-3xl md:text-4xl ml-2 opacity-60">%</span>
      </div>

      {/* Brand Name */}
      <div className={`absolute bottom-12 left-12 pointer-events-none transition-opacity duration-500 ${isCaptured ? 'opacity-20' : 'opacity-0'}`}>
        <h1 className="font-brand text-4xl text-primary lowercase">The Sinfonia</h1>
      </div>
    </div>
  );
}
