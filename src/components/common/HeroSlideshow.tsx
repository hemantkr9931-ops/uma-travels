'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const SLIDES = [
  { src: '/uma-travels-bg1.webp', alt: 'UMA TRAVELS — Premium Cab Service from Dhanbad' },
  { src: '/uma-travels-bg2.webp', alt: 'UMA TRAVELS — Outstation & Airport Taxi Jharkhand' },
  { src: '/uma-travels-bg3.webp', alt: 'UMA TRAVELS — Corporate & Wedding Car Rental' },
];

const INTERVAL_MS = 4000;

interface HeroSlideshowProps {
  className?: string;
  overlayClassName?: string;
}

export default function HeroSlideshow({ className = '', overlayClassName = '' }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  const advance = useCallback(() => {
    setCurrent((c) => {
      setPrev(c);
      return (c + 1) % SLIDES.length;
    });
  }, []);

  useEffect(() => {
    const t = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(t);
  }, [advance]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: idx === current ? 1 : idx === prev ? 0 : 0,
            zIndex: idx === current ? 2 : idx === prev ? 1 : 0,
          }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            preload={idx === 0}
            quality={95}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      ))}

      {/* Clean overlay: only applied if explicitly passed, no hardcoded milky-white fade */}
      {overlayClassName && (
        <div className={`absolute inset-0 z-10 ${overlayClassName}`} />
      )}
    </div>
  );
}
