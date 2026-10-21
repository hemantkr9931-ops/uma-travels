// =====================================================================
// UMA TRAVELS — Open Graph / Twitter image renderer (next/og)
// Generates a branded 1200x630 social share card for every route.
// =====================================================================

/* eslint-disable @next/next/no-img-element -- next/og (Satori) requires a plain <img>, not next/image */

import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SITE_CONFIG } from '@/lib/config';

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_ALT =
  'UMA TRAVELS — Premium Cab Service, Car Rental & Corporate Travel from Dhanbad, Jharkhand';

export async function renderOgImage(): Promise<ImageResponse> {
  let logoSrc: string | null = null;
  let bgSrc: string | null = null;
  try {
    const logoData = await readFile(join(process.cwd(), 'public', 'logo.png'), 'base64');
    logoSrc = `data:image/png;base64,${logoData}`;
  } catch {
    logoSrc = null;
  }
  try {
    const bgData = await readFile(join(process.cwd(), 'public', 'uma-travels-bg1.jpg'), 'base64');
    bgSrc = `data:image/jpeg;base64,${bgData}`;
  } catch {
    bgSrc = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0f172a',
          color: '#ffffff',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Background Image: Hero Banner 2 */}
        {bgSrc ? (
          <img
            src={bgSrc}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: 'cover',
            }}
          />
        ) : null}
        {/* Dark Vignette Overlay for readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.72) 50%, rgba(15, 23, 42, 0.90) 100%)',
          }}
        />

        {/* Content relative wrapper */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
          }}
        >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {logoSrc ? (
            <img src={logoSrc} width={84} height={84} alt="" style={{ borderRadius: 9999 }} />
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 1, color: '#f59e0b' }}>
              UMA TRAVELS
            </div>
            <div style={{ fontSize: 20, color: '#94a3b8', letterSpacing: 3 }}>
              CABS · CAR RENTAL · CORPORATE TRAVELS
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
            Premium Cab Service from Dhanbad
          </div>
          <div style={{ fontSize: 30, color: '#cbd5e1', maxWidth: 980, lineHeight: 1.35 }}>
            Local, outstation, one-way & round-trip taxis, airport transfers and corporate travel
            across Jharkhand, West Bengal, Bihar, Odisha, Chhattisgarh & Uttar Pradesh.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(245, 158, 11, 0.35)',
            paddingTop: '26px',
            fontSize: 26,
            color: '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>Call</span>
            <span>{SITE_CONFIG.phone}</span>
          </div>
          <div style={{ display: 'flex' }}>www.uma-travels.com</div>
        </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
