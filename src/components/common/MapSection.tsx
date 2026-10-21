/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Route, ExternalLink, Compass } from 'lucide-react';

interface CityMapProps {
  lat: number;
  lng: number;
  cityName: string;
  zoom?: number;
}

interface RouteMapProps {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  viaPoints?: string[];
}

// ── Safe Leaflet Loader without fragile SRI hashes ───────────────────────────
let leafletLoadPromise: Promise<any> | null = null;

async function loadLeafletSafely(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if ((window as any).L) return (window as any).L;

  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve) => {
    try {
      // 1. Ensure CSS is loaded
      if (!document.querySelector('#leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);
      }

      // 2. Ensure JS is loaded
      if ((window as any).L) {
        resolve((window as any).L);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.async = true;

      script.onload = () => {
        resolve((window as any).L || null);
      };

      script.onerror = () => {
        // Fallback to unpkg if cdnjs fails
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        fallbackScript.async = true;
        fallbackScript.onload = () => {
          resolve((window as any).L || null);
        };
        fallbackScript.onerror = () => {
          // Resolve with null instead of rejecting with an unhandled Event!
          resolve(null);
        };
        document.head.appendChild(fallbackScript);
      };

      document.head.appendChild(script);
    } catch {
      resolve(null);
    }
  });

  return leafletLoadPromise;
}

// ── City Boundary Map ──────────────────────────────────────────────────────
export function CityMap({ lat, lng, cityName, zoom = 12 }: CityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      try {
        const L = await loadLeafletSafely();
        if (!mounted) return;

        if (!L || !containerRef.current) {
          setMapStatus('fallback');
          return;
        }

        // Clean up previous map on container if already initialized
        if (mapRef.current) {
          try {
            mapRef.current.remove();
          } catch {
            // ignore
          }
          mapRef.current = null;
        }

        if ((containerRef.current as any)._leaflet_id) {
          try {
            delete (containerRef.current as any)._leaflet_id;
          } catch {
            // ignore
          }
        }

        const map = L.map(containerRef.current, {
          center: [lat, lng],
          zoom,
          zoomControl: true,
          scrollWheelZoom: false,
          dragging: true,
          doubleClickZoom: true,
        });

        mapRef.current = map;

        // OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        // Highlight circle representing service zone
        L.circle([lat, lng], {
          radius: 10000,
          color: '#b45309',
          fillColor: 'rgba(217,119,6,0.14)',
          weight: 2,
          fillOpacity: 1,
        }).addTo(map);

        // Custom icon
        const icon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${cityName}</strong><br/>UMA TRAVELS Hub & Service Network`)
          .openPopup();

        setMapStatus('ready');
      } catch (err) {
        console.warn('Leaflet map initialization skipped, using fallback view.', err);
        if (mounted) setMapStatus('fallback');
      }
    }

    let observer: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            initMap();
            if (observer && containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        },
        { rootMargin: '300px' }
      );
      observer.observe(containerRef.current);
    } else {
      initMap();
    }

    return () => {
      mounted = false;
      if (observer) observer.disconnect();
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {
          // ignore
        }
        mapRef.current = null;
      }
    };
  }, [lat, lng, cityName, zoom]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-md bg-[var(--color-bg-secondary)]">
      {/* Map DOM Container */}
      <div
        ref={containerRef}
        role="region"
        style={{ height: '380px', width: '100%', zIndex: 1 }}
        className={mapStatus === 'fallback' ? 'hidden' : 'block'}
        aria-label={`Interactive map of ${cityName}`}
      />

      {/* Fallback View if offline or CDN is unreachable */}
      {mapStatus === 'fallback' && (
        <div className="p-8 min-h-[380px] flex flex-col justify-between bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-black/60">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-gold text-xs flex items-center gap-1">
                <Compass size={12} /> Service Coverage Area
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                Coordinates: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
              </span>
            </div>
            <h3 className="text-2xl font-black mb-2 text-[var(--color-text-primary)]">
              {cityName} Cab Operations Zone
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              UMA TRAVELS provides full doorstep pickup and drop-off coverage across all municipal
              sectors, railway stations, bus stands, and outskirts in {cityName} with verified drivers.
            </p>
          </div>

          <div className="pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> 24/7 Active Fleet
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Interstate Outstation Permit
              </span>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold text-xs inline-flex items-center gap-1.5"
            >
              Open in Google Maps <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Route Map ──────────────────────────────────────────────────────────────
export function RouteMap({ origin, destination, viaPoints = [] }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      try {
        const L = await loadLeafletSafely();
        if (!mounted) return;

        if (!L || !containerRef.current) {
          setMapStatus('fallback');
          return;
        }

        if (mapRef.current) {
          try {
            mapRef.current.remove();
          } catch {
            // ignore
          }
          mapRef.current = null;
        }

        if ((containerRef.current as any)._leaflet_id) {
          try {
            delete (containerRef.current as any)._leaflet_id;
          } catch {
            // ignore
          }
        }

        const midLat = (origin.lat + destination.lat) / 2;
        const midLng = (origin.lng + destination.lng) / 2;
        const latDiff = Math.abs(origin.lat - destination.lat);
        const lngDiff = Math.abs(origin.lng - destination.lng);
        const maxDiff = Math.max(latDiff, lngDiff);
        const autoZoom = maxDiff < 1 ? 10 : maxDiff < 3 ? 8 : maxDiff < 6 ? 7 : 6;

        const map = L.map(containerRef.current, {
          center: [midLat, midLng],
          zoom: autoZoom,
          zoomControl: true,
          scrollWheelZoom: false,
          dragging: true,
        });

        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        const defaultIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // Origin marker
        L.marker([origin.lat, origin.lng], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`<strong>🟢 ${origin.name}</strong><br/>Pickup Hub`);

        // Destination marker
        L.marker([destination.lat, destination.lng], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`<strong>🔴 ${destination.name}</strong><br/>Destination`);

        // Route polyline
        L.polyline([[origin.lat, origin.lng], [destination.lat, destination.lng]], {
          color: '#b45309',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 6',
        }).addTo(map);

        const bounds = L.latLngBounds([[origin.lat, origin.lng], [destination.lat, destination.lng]]);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 11 });

        setMapStatus('ready');
      } catch (err) {
        console.warn('Route map initialization skipped, using fallback view.', err);
        if (mounted) setMapStatus('fallback');
      }
    }

    let observer: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            initMap();
            if (observer && containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        },
        { rootMargin: '300px' }
      );
      observer.observe(containerRef.current);
    } else {
      initMap();
    }

    return () => {
      mounted = false;
      if (observer) observer.disconnect();
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {
          // ignore
        }
        mapRef.current = null;
      }
    };
  }, [origin, destination, viaPoints]);

  const googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    origin.name
  )}&destination=${encodeURIComponent(destination.name)}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-md bg-[var(--color-bg-secondary)]">
      <div
        ref={containerRef}
        role="region"
        style={{ height: '400px', width: '100%', zIndex: 1 }}
        className={mapStatus === 'fallback' ? 'hidden' : 'block'}
        aria-label={`Interactive route map from ${origin.name} to ${destination.name}`}
      />

      {mapStatus === 'fallback' && (
        <div className="p-8 min-h-[400px] flex flex-col justify-between bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-black/60">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-gold text-xs flex items-center gap-1">
                <Route size={12} /> Verified Corridor
              </span>
            </div>
            <h3 className="text-2xl font-black mb-2 text-[var(--color-text-primary)]">
              {origin.name} → {destination.name}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-xl leading-relaxed mb-4">
              Regular intercity cab service on this route with verified toll estimation,
              highway stops, and round-the-clock availability.
            </p>
            {viaPoints && viaPoints.length > 0 && (
              <p className="text-xs text-[var(--color-text-muted)]">
                Key Transit Points: <strong className="text-[var(--color-text-secondary)]">{viaPoints.join(' • ')}</strong>
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
              <span>Doorstep Pickup</span>
              <span>•</span>
              <span>Express Highway Routing</span>
            </div>
            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold text-xs inline-flex items-center gap-1.5"
            >
              Open Route in Google Maps <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── City Map Section (server-renderable wrapper) ───────────────────────────
export function CityMapSection({ lat, lng, cityName }: CityMapProps) {
  return (
    <section
      className="section-padding bg-[var(--color-bg-secondary)]"
      aria-labelledby="map-section-heading"
    >
      <div className="container-site">
        <div className="mb-6">
          <span className="section-label">Location Coverage</span>
          <h2 id="map-section-heading" className="text-2xl md:text-3xl font-black flex items-center gap-2">
            <MapPin size={22} className="text-[var(--color-gold-500)]" />
            {cityName} — Service Area Map
          </h2>
          <p className="text-[var(--color-text-secondary)] mt-2 text-sm">
            UMA TRAVELS operates cab service throughout {cityName} and surrounding areas.
            The map highlights our primary operational zone and pickup coverage.
          </p>
        </div>
        <CityMap lat={lat} lng={lng} cityName={cityName} zoom={12} />
      </div>
    </section>
  );
}

// ── Route Map Section ──────────────────────────────────────────────────────
export function RouteMapSection({
  origin,
  destination,
  distanceKm,
  durationMin,
}: {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  distanceKm?: number;
  durationMin?: number;
}) {
  return (
    <section
      className="section-padding bg-[var(--color-bg-secondary)]"
      aria-labelledby="route-map-heading"
    >
      <div className="container-site">
        <div className="mb-6">
          <span className="section-label">Highway Route</span>
          <h2 id="route-map-heading" className="text-2xl md:text-3xl font-black flex items-center gap-2">
            <Route size={22} className="text-[var(--color-gold-500)]" />
            {origin.name} → {destination.name}
          </h2>
          {distanceKm && durationMin && (
            <p className="text-[var(--color-text-secondary)] mt-2 text-sm">
              Approx. road distance: <strong>{distanceKm} km</strong> · Estimated drive time:{' '}
              <strong>{Math.floor(durationMin / 60)}h {durationMin % 60}m</strong>
            </p>
          )}
        </div>
        <RouteMap origin={origin} destination={destination} />
      </div>
    </section>
  );
}
