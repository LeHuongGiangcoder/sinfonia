"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { purgatory } from "@/lib/fonts";

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

interface PhotoItem {
  id: number;
  src: string;
  rotation: number;
}

export default function Entrance({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isCaptured, setIsCaptured] = useState(false);
  const [activePhotos, setActivePhotos] = useState<PhotoItem[]>([]);
  const [activeLogo, setActiveLogo] = useState<string | null>(null);
  const [showFinalGrid, setShowFinalGrid] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const startSequence = () => {
    if (isCaptured) return;
    
    gsap.to(".pointing-hint", { opacity: 0, duration: 0.3 });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsCaptured(true);
        runMainAnimation();
      }
    });

    tl.to(cameraRef.current, {
      scale: 1.03,
      duration: 0.4,
      ease: "power2.inOut",
    })
    .to(cameraRef.current, {
      x: 1,
      y: -1,
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      ease: "none"
    }, "-=0.1")
    .to(cameraRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });

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

    tl.to(cameraRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    }, "-=0.4");
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
          const rotation = (Math.random() - 0.5) * 15;
          setActivePhotos(prev => {
            const newList = [...prev, { id: Date.now() + index, src, rotation }];
            return newList.length > 5 ? newList.slice(1) : newList;
          });
        }
      }, index * photoDuration);
    });

    // Phase 2: Pause at 80% with Message
    tl.to(".photo-stack-container", { opacity: 0, scale: 1.2, duration: 0.6, ease: "power3.in" });
    tl.to({}, {
      duration: 1.3,
      onStart: () => setCurrentMessage("Bạn gần tới rồi"),
      onComplete: () => setCurrentMessage("")
    });
    tl.to({}, { duration: 0.5 });

    // Phase 3: Logos (80 -> 99%)
    const logoSequenceStartTime = tl.duration();

    tl.to(progressProxy, {
      value: 99,
      duration: LOGOS.length * 0.4 + 1.6,
      ease: "power1.inOut"
    }, logoSequenceStartTime);

    LOGOS.forEach((src, index) => {
      tl.to({}, {
        duration: 0.25,
        onStart: () => setActiveLogo(src)
      }, logoSequenceStartTime + 0.3 + (index * 0.25));
    });

    // Final Grid Transition - Added 0.5s pause after individual logos
    const finalGridStartTime = logoSequenceStartTime + 0.3 + (LOGOS.length * 0.25) + 0.5;
    tl.to({}, {
      duration: 0.2,
      onStart: () => {
        setActiveLogo(null);
        setShowFinalGrid(true);
      }
    }, finalGridStartTime);

    tl.to(progressProxy, { value: 100, duration: 0.4 });
    tl.to({}, { duration: 0.8 });
  };

  useEffect(() => {
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
            <img
              src="/assets/camera.png"
              alt="Vintage Camera"
              className="w-[90vw] md:w-[55rem] h-auto transition-transform duration-300 ease-out group-hover:scale-105"
            />

            <div className="pointing-hint absolute top-20 right-0 md:top-36 md:right-0 pointer-events-none animate-bounce-slow flex flex-col items-center gap-2">
              <div className="relative w-12 h-12 md:w-20 md:h-20">
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
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
          </div>
        </div>
      )}

      {/* Camera Flash */}
      <div
        ref={flashRef}
        className="fixed inset-0 bg-white z-[100] opacity-0 pointer-events-none"
      />

      {/* Photo Stack */}
      <div className="photo-stack-container absolute inset-0 flex items-center justify-center">
        {activePhotos.map((photo) => (
          <div key={photo.id} className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in">
            <img 
              src={photo.src} 
              className="w-[280px] md:w-[420px] aspect-[3/4] object-cover shadow-2xl border-[10px] border-white"
              style={{ transform: `rotate(${photo.rotation}deg)` }}
            />
          </div>
        ))}
      </div>

      {/* Message Reveal */}
      {currentMessage && (
        <div className="absolute inset-0 flex items-center justify-center text-primary font-display text-4xl md:text-6xl animate-fade-in -translate-y-12">
          {currentMessage}
        </div>
      )}

      {/* Active Logo Sequence */}
      {activeLogo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in">
          <div className="h-32 md:h-48 flex items-center justify-center">
            <img src={activeLogo} className="h-full w-auto object-contain" />
          </div>
          <p className="subheading mt-8 !opacity-100 text-primary tracking-[0.2em] uppercase text-xs">Chúng tôi là 1 đội</p>
        </div>
      )}

      {/* Final Logo Grid */}
      {showFinalGrid && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center gap-16 max-w-5xl px-8">
            <div className="grid grid-cols-3 gap-x-12 md:gap-x-20 gap-y-8 md:gap-y-12 items-center justify-items-center">
              {LOGOS.map((src, i) => (
                <img key={i} src={src} className="h-10 md:h-16 w-auto object-contain" />
              ))}
            </div>
            <p className="subheading !opacity-100 text-primary tracking-[0.4em] uppercase text-sm">Để cùng mang đến</p>
          </div>
        </div>
      )}

      {/* Progress Counter */}
      <div className={`absolute bottom-12 right-12 text-primary font-display text-6xl md:text-8xl select-none pointer-events-none tabular-nums flex items-baseline transition-opacity duration-500 ${isCaptured ? 'opacity-10' : 'opacity-0'}`}>
        {progress.toString().padStart(2, "0")}
        <span className="text-3xl md:text-4xl ml-2 opacity-60">%</span>
      </div>

      {/* Brand Name */}
      <div className={`absolute top-12 left-12 md:top-auto md:bottom-12 pointer-events-none transition-opacity duration-500 ${isCaptured ? 'opacity-20' : 'opacity-0'}`}>
        <h1 className={`${purgatory.className} font-brand text-3xl md:text-4xl text-primary lowercase`}>The Sunset Sinfonia</h1>
      </div>
    </div>
  );
}
