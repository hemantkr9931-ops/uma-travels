'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          color: '#0f172a',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: 560, textAlign: 'center' }}>
          <p
            style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#b45309',
              marginBottom: 12,
            }}
          >
            UMA TRAVELS — Critical error
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#334155', lineHeight: 1.6, marginBottom: 24 }}>
            A critical error occurred while loading the site. Please try again.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: '#b45309',
              color: '#ffffff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 22px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
