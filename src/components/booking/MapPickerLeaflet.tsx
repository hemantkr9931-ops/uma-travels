'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Locate, MapPin, Search, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';

interface MapPickerLeafletProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (name: string, lat: number, lng: number) => void;
  title: string;
  defaultLat?: number;
  defaultLng?: number;
}

// Nominatim reverse geocode via our autocomplete proxy or direct
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12&addressdetails=1`,
      { headers: { 'User-Agent': 'UmaTravels-CabBooking/1.0' } }
    );
    if (res.ok) {
      const d = await res.json();
      const addr = d.address || {};
      return (
        addr.city || addr.town || addr.village || addr.county ||
        addr.state_district || addr.state || d.display_name?.split(',')[0] || `${lat.toFixed(4)},${lng.toFixed(4)}`
      );
    }
  } catch { /* ignore */ }
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

const POPULAR_CITIES = [
  { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
  { name: 'Bokaro', lat: 23.6693, lng: 86.1511 },
  { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Patna', lat: 25.5941, lng: 85.1376 },
  { name: 'Hazaribagh', lat: 23.9934, lng: 85.3637 },
  { name: 'Asansol', lat: 23.6842, lng: 86.9625 },
];

export default function MapPickerLeaflet({ isOpen, onClose, onSelect, title, defaultLat = 23.7957, defaultLng = 86.4304 }: MapPickerLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<import('leaflet').Map | null>(null);
  const markerRef = useRef<import('leaflet').Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [pinLat, setPinLat] = useState<number | null>(null);
  const [pinLng, setPinLng] = useState<number | null>(null);
  const [pinName, setPinName] = useState('');
  const [resolving, setResolving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; fullAddress: string; lat: number; lng: number }>>([]);
  const [searching, setSearching] = useState(false);
  const [tab, setTab] = useState<'map' | 'search'>('search');

  // Search locations
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale results when the query is reset
    if (searchQ.trim().length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(searchQ.trim())}`);
        if (res.ok) {
          const d = await res.json();
          setSearchResults(d.suggestions || []);
        }
      } catch { /* ignore */ }
      setSearching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQ]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!isOpen || tab !== 'map') return;
    if (leafletMapRef.current) return; // already init

    let cleanup: (() => void) | undefined;

    import('leaflet').then((L) => {
      if (!mapRef.current) return;

      // Fix default icon path issue in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [defaultLat, defaultLng],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom pin icon
      const pinIcon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:42px;display:flex;flex-direction:column;align-items:center;">
          <div style="width:28px;height:28px;background:#f59e0b;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>
          <div style="width:4px;height:14px;background:#f59e0b;margin-top:-2px;border-radius:0 0 2px 2px;"></div>
        </div>`,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
      });

      const marker = L.marker([defaultLat, defaultLng], { icon: pinIcon, draggable: true }).addTo(map);
      markerRef.current = marker;
      leafletMapRef.current = map;

      // On map click — move pin
      const handleMapClick = async (e: import('leaflet').LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setPinLat(lat);
        setPinLng(lng);
        setResolving(true);
        const name = await reverseGeocode(lat, lng);
        setPinName(name);
        setResolving(false);
      };
      map.on('click', handleMapClick);

      // On marker drag
      const handleDragEnd = async () => {
        const pos = marker.getLatLng();
        setPinLat(pos.lat);
        setPinLng(pos.lng);
        setResolving(true);
        const name = await reverseGeocode(pos.lat, pos.lng);
        setPinName(name);
        setResolving(false);
      };
      marker.on('dragend', handleDragEnd);

      setMapReady(true);

      cleanup = () => {
        map.off('click', handleMapClick);
        marker.off('dragend', handleDragEnd);
        map.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
        setMapReady(false);
      };
    });

    return () => { cleanup?.(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tab]);

  // Pan map to city
  const panTo = useCallback((lat: number, lng: number, name: string) => {
    const map = leafletMapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    map.setView([lat, lng], 13);
    marker.setLatLng([lat, lng]);
    setPinLat(lat);
    setPinLng(lng);
    setPinName(name);
  }, []);

  // GPS
  const handleGps = useCallback(async () => {
    setGpsLoading(true);
    setGpsError('');

    const fetchIpFallback = async (): Promise<{ lat: number; lng: number; name: string } | null> => {
      try {
        const res = await fetch('/api/places/live-location/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.lat && data.lng) {
            return {
              lat: Number(data.lat),
              lng: Number(data.lng),
              name: data.fullAddress || data.name || `${data.lat}, ${data.lng}`,
            };
          }
        }
      } catch (err) {
        console.warn('Map picker IP fallback error:', err);
      }
      return null;
    };

    const handleSuccess = async (pos: GeolocationPosition) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setResolving(true);
      const name = await reverseGeocode(lat, lng);
      setPinLat(lat);
      setPinLng(lng);
      setPinName(name);
      setResolving(false);
      if (tab === 'map') panTo(lat, lng, name);
      setGpsError('');
      setGpsLoading(false);
    };

    const handleGpsError = async (err: GeolocationPositionError) => {
      console.warn('Map picker GPS error:', err.code, err.message);

      // Attempt real network IP fallback
      const fallback = await fetchIpFallback();
      if (fallback) {
        setPinLat(fallback.lat);
        setPinLng(fallback.lng);
        setPinName(fallback.name);
        if (tab === 'map') panTo(fallback.lat, fallback.lng, fallback.name);
      }

      if (err.code === 1) {
        // PERMISSION_DENIED
        setGpsError(
          fallback
            ? 'Loaded your area via network. For exact building GPS, please allow location access in your browser (tap 🔒 in address bar).'
            : 'Location permission denied. Please allow location access in your browser settings (tap 🔒 in address bar).'
        );
      } else if (err.code === 2) {
        setGpsError(
          fallback
            ? 'Phone GPS signal unavailable; loaded from network.'
            : 'Location unavailable. Please search or pick on map manually.'
        );
      } else if (err.code === 3) {
        setGpsError(
          fallback
            ? 'GPS request timed out; loaded from network.'
            : 'Location request timed out. Please try again or pick on map.'
        );
      } else {
        setGpsError(fallback ? '' : 'Could not detect location. Please search manually.');
      }
      setGpsLoading(false);
    };

    if (typeof window === 'undefined' || !navigator.geolocation) {
      const fallback = await fetchIpFallback();
      if (fallback) {
        setPinLat(fallback.lat);
        setPinLng(fallback.lng);
        setPinName(fallback.name);
        if (tab === 'map') panTo(fallback.lat, fallback.lng, fallback.name);
      } else {
        setGpsError('Geolocation is not supported by your browser.');
      }
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      (err) => {
        if (err.code === 3) {
          navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleGpsError,
            { timeout: 7000, enableHighAccuracy: false, maximumAge: 60000 }
          );
        } else {
          handleGpsError(err);
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  }, [tab, panTo]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset transient picker state when the dialog closes
      setPinLat(null); setPinLng(null); setPinName('');
      setGpsError(''); setSearchQ(''); setSearchResults([]);
      setTab('search');
      // Destroy map
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
        setMapReady(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canConfirm = pinName.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(10,15,30,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true"
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-100 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <MapPin size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Choose Location</p>
            <p className="text-sm font-black text-slate-900">{title}</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer" aria-label="Close">
            <X size={15} className="text-slate-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 shrink-0">
          {[
            { id: 'search', label: 'Search City', icon: Search },
            { id: 'map', label: 'Pin on Map', icon: MapPin },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} type="button"
              onClick={() => setTab(id as 'map' | 'search')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${tab === id ? 'border-amber-500 text-amber-700 bg-amber-500/5' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        {/* GPS Button */}
        <div className="px-4 pt-3 pb-2 shrink-0">
          <button type="button" onClick={handleGps} disabled={gpsLoading}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-dashed border-amber-400/50 bg-amber-500/5 hover:bg-amber-500/10 transition cursor-pointer active:scale-[0.99] disabled:opacity-60">
            {gpsLoading ? <Loader2 size={16} className="animate-spin text-amber-600 shrink-0" /> : <Locate size={16} className="text-amber-600 shrink-0" />}
            <span className="text-amber-800 font-bold text-sm">{gpsLoading ? 'Detecting your location...' : 'Use My Current Location (GPS)'}</span>
          </button>
          {gpsError && (
            <p className="text-xs text-red-600 font-medium mt-1.5 flex items-start gap-1">
              <span className="shrink-0 mt-0.5">⚠</span>{gpsError}
            </p>
          )}
        </div>

        {/* GPS / Pin Result Preview */}
        {(pinName || resolving) && (
          <div className="mx-4 mb-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center gap-2 shrink-0">
            {resolving ? <Loader2 size={14} className="animate-spin text-emerald-600 shrink-0" /> : <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-emerald-800 truncate">{resolving ? 'Resolving address...' : pinName}</p>
              {pinLat && !resolving && <p className="text-[10px] text-emerald-600 font-medium">{pinLat.toFixed(5)}, {pinLng?.toFixed(5)}</p>}
            </div>
          </div>
        )}

        {/* SEARCH TAB */}
        {tab === 'search' && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                {searching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-spin" />}
                <input type="text" placeholder="Type city, area, landmark..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                  className="w-full h-11 pl-9 pr-9 rounded-xl border border-slate-200 bg-slate-50/80 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition" autoFocus />
              </div>
            </div>

            <div className="px-4 pb-4">
              {searchResults.length > 0 ? (
                <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
                  {searchResults.map((r, i) => (
                    <button key={`${r.name}-${r.lat}-${r.lng}-${i}`} type="button"
                      onClick={() => { onSelect(r.name, r.lat, r.lng); onClose(); }}
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-amber-50 text-left transition cursor-pointer group bg-white">
                      <MapPin size={14} className="text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-amber-800 truncate">{r.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{r.fullAddress}</p>
                      </div>
                      <ChevronRight size={13} className="text-slate-300 group-hover:text-amber-500 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              ) : searchQ.length >= 2 && !searching ? (
                <p className="text-center text-sm text-slate-400 font-medium py-4">No results found for &ldquo;{searchQ}&rdquo;</p>
              ) : (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Popular Cities</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {POPULAR_CITIES.map((city) => (
                      <button key={city.name} type="button"
                        onClick={() => { onSelect(city.name, city.lat, city.lng); onClose(); }}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-white hover:border-amber-400/50 hover:bg-amber-50 text-left transition cursor-pointer group">
                        <MapPin size={12} className="text-amber-400 shrink-0" />
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-amber-700">{city.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAP TAB */}
        {tab === 'map' && (
          <div className="flex-1 flex flex-col min-h-0">
            <p className="text-[11px] text-slate-500 font-medium px-4 py-1.5 shrink-0">
              Tap/click on the map or drag the pin to set your location
            </p>
            {/* Leaflet CSS */}
            <style>{`
              .leaflet-container { font-family: inherit; }
              .leaflet-control-attribution { font-size: 9px !important; }
            `}</style>
            {/* Map container */}
            <div ref={mapRef} className="flex-1 min-h-[250px]" style={{ zIndex: 0 }} />
            {!mapReady && (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <Loader2 size={24} className="animate-spin text-amber-500" />
              </div>
            )}
          </div>
        )}

        {/* Footer — Confirm Button */}
        <div className="px-4 py-3 border-t border-slate-100 shrink-0 bg-white">
          <button type="button"
            disabled={!canConfirm && !pinName}
            onClick={() => {
              if (pinName && pinLat !== null && pinLng !== null) {
                onSelect(pinName, pinLat, pinLng);
                onClose();
              } else if (pinName) {
                onSelect(pinName, 0, 0);
                onClose();
              }
            }}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            {canConfirm ? `Confirm — ${pinName}` : 'Select a location to confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
