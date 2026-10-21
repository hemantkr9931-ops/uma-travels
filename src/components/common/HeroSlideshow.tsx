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
  const [canLoadSecondary, setCanLoadSecondary] = useState(false);

  useEffect(() => {
    // Delay loading secondary slides (2 & 3) so they don't consume bandwidth during initial page load
    const timer = setTimeout(() => {
      setCanLoadSecondary(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const advance = useCallback(() => {
    setCurrent((c) => {
      setPrev(c);
      return (c + 1) % SLIDES.length;
    });
  }, []);

  useEffect(() => {
    if (!canLoadSecondary) return;
    const t = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(t);
  }, [advance, canLoadSecondary]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {SLIDES.map((slide, idx) => {
        if (idx > 0 && !canLoadSecondary) return null;
        return (
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
              priority={idx === 0}
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchPriority={idx === 0 ? 'high' : 'low'}
              quality={75}
              sizes="(max-width: 768px) 100vw, 100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        );
      })}

      {/* Clean overlay: only applied if explicitly passed, no hardcoded milky-white fade */}
      {overlayClassName && (
        <div className={`absolute inset-0 z-10 ${overlayClassName}`} />
      )}
    </div>
  );
}
