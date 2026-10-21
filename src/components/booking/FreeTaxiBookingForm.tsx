'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  MapPin, Navigation, ArrowLeftRight, Calendar,
  Car, Users, Phone, ArrowRight, CheckCircle,
  Loader2, MessageCircle, Locate, IndianRupee,
  AlertCircle, AlertTriangle, ChevronLeft,
  RotateCcw, Info, Star, ShieldCheck, CheckCircle2,
  ArrowDown, X, Search, RefreshCw, Clock, Sparkles, Droplets
} from 'lucide-react';
import { getWhatsAppUrl, SITE_CONFIG } from '@/lib/config';
import { resolvePlaceCoords } from '@/lib/geo-places';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LocationSuggestion {
  id: string;
  name: string;
  fullAddress: string;
  lat: number;
  lng: number;
}

interface SelectedLocation {
  name: string;
  lat: number;
  lng: number;
}

interface VehicleFare {
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  seatingCapacity: number;
  models: string[];
  tripType: 'one-way' | 'round-trip';
  oneWayDistanceKm: number;
  ratePerKm: number;
  baseDistanceCharge: number;
  shortDistanceRental?: number;
  nightHaltCount: number;
  nightHaltCharge: number;
  perNightHaltRate: number;
  totalFare: number;
}

interface RouteResult {
  distanceKm: number;
  durationFormatted: string;
  tripType: 'one-way' | 'round-trip';
  wasAutoConverted: boolean;
  autoConvertedMessage: string | null;
  nightHaltCount: number;
  pickupName: string;
  dropName: string;
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  vehicleFares: VehicleFare[];
  disclaimer: string;
}

type BookingStep = 'search' | 'prices' | 'form' | 'success';

// ─── Date utilities ────────────────────────────────────────────────────────────

function getLocalDateISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─── Debounced Location Input ─────────────────────────────────────────────────

interface LocationInputProps {
  id: string;
  label: string;
  placeholder: string;
  iconColor: string;
  inputColor: string;
  value: string;
  selected: SelectedLocation | null;
  onChange: (text: string) => void;
  onSelect: (loc: SelectedLocation) => void;
  onClear: () => void;
  onSwap?: () => void;
  onGps?: () => void;
  gpsLoading?: boolean;
  error?: string;
}

function LocationInput({
  id, label, placeholder, iconColor, inputColor,
  value, selected, onChange, onSelect, onClear,
  onSwap, onGps, gpsLoading, error
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    const q = value.trim();
    if (q.length < 2 || selected) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      abortRef.current = new AbortController();
      try {
        const res = await fetch(
          `/api/places/autocomplete/?q=${encodeURIComponent(q)}`,
          { signal: abortRef.current.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, selected]);

  const handleSelect = (sug: LocationSuggestion) => {
    onSelect({ name: sug.name, lat: sug.lat, lng: sug.lng });
    onChange(sug.name);
    setSuggestions([]);
    setOpen(false);
  };

  const isLocked = selected !== null;

  return (
    <div ref={wrapRef} className="relative flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${iconColor}`}>
          <MapPin size={12} className="shrink-0" />
          {label}
        </label>
        {isLocked && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-full">
            <CheckCircle2 size={10} /> Verified
          </span>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          placeholder={placeholder}
          value={value}
          readOnly={isLocked}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => !isLocked && setOpen(true)}
          autoComplete="off"
          className={`w-full text-xs sm:text-sm font-semibold rounded-xl border px-3 py-2.5 pr-20 transition-all outline-none shadow-sm
            ${error ? 'border-red-400 ring-2 ring-red-100 bg-red-50/50' : 
              isLocked ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 cursor-default ring-1 ring-emerald-200' : 
              inputColor === 'emerald' ? 'border-slate-200 bg-white/95 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-400' :
              'border-slate-200 bg-white/95 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 placeholder:text-slate-400'}
          `}
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 size={14} className="text-amber-500 animate-spin mr-1" />}
          {isLocked && (
            <button
              type="button"
              onClick={() => { onClear(); onChange(''); setSuggestions([]); }}
              className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 transition cursor-pointer"
              title="Change location"
              aria-label="Change location"
            >
              <X size={11} /> Change
            </button>
          )}
          {onSwap && !isLocked && (
            <button
              type="button"
              onClick={onSwap}
              className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 hover:border-amber-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Swap pickup and destination"
              aria-label="Swap pickup and destination"
            >
              <ArrowLeftRight size={14} />
            </button>
          )}
          {onGps && !isLocked && (
            <button
              type="button"
              onClick={onGps}
              disabled={gpsLoading}
              className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 hover:border-blue-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              title="Use current GPS location"
              aria-label="Detect GPS location"
            >
              {gpsLoading ? <Loader2 size={14} className="animate-spin text-blue-600" /> : <Locate size={14} />}
            </button>
          )}
        </div>
      </div>

      {open && suggestions.length > 0 && !isLocked && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-[250] left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1"
          style={{ maxHeight: '240px', overflowY: 'auto' }}
        >
          <li className="px-3 py-1.5 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Suggested Highway & City Hubs
          </li>
          {suggestions.map((sug) => (
            <li
              key={sug.id}
              role="option"
              aria-selected={false}
              className="px-3.5 py-2.5 cursor-pointer hover:bg-amber-50/90 flex items-start gap-2.5 group transition-colors"
              onMouseDown={(e) => { e.preventDefault(); handleSelect(sug); }}
            >
              <div className="w-6 h-6 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <MapPin size={12} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-900 truncate">{sug.name}</p>
                {sug.fullAddress && sug.fullAddress !== sug.name && (
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{sug.fullAddress}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="text-[11px] mt-1 font-bold text-rose-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Vehicle Fare Card ─────────────────────────────────────────────────────────

interface VehicleFareCardProps {
  fare: VehicleFare;
  isSelected: boolean;
  onSelect: () => void;
}

function VehicleFareCard({ fare, isSelected, onSelect }: VehicleFareCardProps) {
  const isSedan = fare.vehicleId === 'sedan';
  const isErtiga = fare.vehicleId === 'ertiga';
  const isRound = fare.tripType === 'round-trip';

  const headerGradient = isSedan
    ? 'bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700'
    : isErtiga
    ? 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700'
    : 'bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900';

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'border-amber-500 shadow-xl shadow-amber-500/15 ring-4 ring-amber-400/20 scale-[1.01] bg-white'
          : 'border-slate-200/90 hover:border-amber-300 hover:shadow-lg bg-white/95'
      }`}
      onClick={onSelect}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
    >
      {/* Header Banner */}
      <div className={`px-3.5 py-2.5 flex items-center justify-between text-white ${headerGradient}`}>
        <div className="flex items-center gap-2 min-w-0">
          <Car size={15} className="shrink-0" />
          <span className="font-black text-sm truncate">{fare.vehicleName}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white">
            {isRound ? 'Round Trip' : 'One Way'}
          </span>
          {isSelected && (
            <span className="w-5 h-5 rounded-full bg-white text-amber-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 size={13} />
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        {/* Top: Image + Specs */}
        <div>
          <div className="flex gap-3 items-center mb-3">
            <div className="relative w-24 h-14 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200/70 overflow-hidden shrink-0 flex items-center justify-center p-1">
              <Image src={fare.vehicleImage} alt={fare.vehicleName} fill sizes="96px" className="object-contain p-1" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{fare.models.join(' • ')}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                  <Users size={10} className="text-amber-600" /> {fare.seatingCapacity} Seater
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-bold">
                  100% AC
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-1.5 text-xs mb-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <Navigation size={11} className="text-amber-600" />
                Distance ({isRound ? 'one-way' : 'highway'})
              </span>
              <span className="font-bold text-slate-900">{fare.oneWayDistanceKm} km</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-200/60">
              <span className="text-slate-600 font-medium">Base Trip Fare</span>
              <span className="font-bold text-slate-900">₹{fare.baseDistanceCharge.toLocaleString('en-IN')}</span>
            </div>
            {(fare.shortDistanceRental ?? (fare.oneWayDistanceKm < 50 ? 700 : 0)) > 0 && (
              <div className="flex justify-between items-center text-amber-800">
                <span className="font-medium">Rental Charge (&lt; 50 km)</span>
                <span className="font-bold text-amber-900">₹{(fare.shortDistanceRental || 700).toLocaleString('en-IN')}</span>
              </div>
            )}
            {isRound && fare.nightHaltCount > 0 && (
              <div className="flex justify-between items-center text-blue-700">
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> Night Halt ({fare.nightHaltCount}N)
                </span>
                <span className="font-bold">₹{fare.nightHaltCharge.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Toll &amp; Parking</span>
              <span className="font-medium text-orange-600">Excluded (as per actual)</span>
            </div>
          </div>
        </div>

        {/* Bottom Total & CTA */}
        <div>
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Total</p>
              <p className="text-[10px] font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={10} /> Zero Advance Needed
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 flex items-center gap-0.5">
                <IndianRupee size={18} className="text-emerald-600 -mr-0.5" />
                {fare.totalFare.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] ${
              isSelected
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 ring-2 ring-amber-400/40'
                : 'bg-slate-900 hover:bg-amber-500 text-white hover:shadow-md'
            }`}
          >
            <Car size={14} />
            {isSelected ? 'Selected — Proceed to Book' : 'Select This Cab'}
            <ArrowRight size={13} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface BookingFormProps {
  prefillFrom?: string;
  prefillTo?: string;
}

export default function FreeTaxiBookingForm({ prefillFrom = '', prefillTo = '' }: BookingFormProps) {
  const [step, setStep] = useState<BookingStep>('search');

  // ── Search state ───────────────────────────────────────────────────────────
  const [fromText, setFromText] = useState(prefillFrom);
  const [toText, setToText] = useState(prefillTo);
  const [fromSelected, setFromSelected] = useState<SelectedLocation | null>(null);
  const [toSelected, setToSelected] = useState<SelectedLocation | null>(null);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [minDate, setMinDate] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    const today = getLocalDateISO();
    setPickupDate(today);
    setMinDate(today);
  }, []);

  // ── Search errors ──────────────────────────────────────────────────────────
  const [fromError, setFromError] = useState('');
  const [toError, setToError] = useState('');
  const [dateError, setDateError] = useState('');
  const [returnDateError, setReturnDateError] = useState('');

  // ── Route result ───────────────────────────────────────────────────────────
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');

  // ── Vehicle selection ──────────────────────────────────────────────────────
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // ── Booking form ───────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [bookingError, setBookingError] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const formTopRef = useRef<HTMLDivElement>(null);

  // ── Auto-convert trip type when route result changes ───────────────────────
  useEffect(() => {
    if (routeResult?.wasAutoConverted) {
      setTripType('round-trip');
    }
  }, [routeResult]);

  // ── Update return date min when pickup date changes ────────────────────────
  useEffect(() => {
    if (returnDate && returnDate < pickupDate) {
      setReturnDate(pickupDate);
    }
  }, [pickupDate, returnDate]);

  // ── GPS detection ──────────────────────────────────────────────────────────
  const detectGps = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`/api/places/autocomplete/?q=${latitude},${longitude}`);
          if (res.ok) {
            const data = await res.json();
            if (data.suggestions?.length > 0) {
              const sug = data.suggestions[0];
              setFromText(sug.name);
              setFromSelected({ name: sug.name, lat: sug.lat, lng: sug.lng });
            } else {
              setGpsError('Could not identify your location. Please search manually.');
            }
          }
        } catch {
          setGpsError('GPS lookup failed. Please search manually.');
        }
        setGpsLoading(false);
      },
      (err) => {
        const msgs: Record<number, string> = {
          1: 'Location permission denied. Please allow location access and try again.',
          2: 'Location unavailable. Please search manually.',
          3: 'Location timed out. Please try again.',
        };
        setGpsError(msgs[err.code] || 'Location detection failed.');
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  }, []);

  // ── Swap locations ─────────────────────────────────────────────────────────
  const handleSwap = () => {
    const tempText = fromText;
    const tempSel = fromSelected;
    setFromText(toText);
    setFromSelected(toSelected);
    setToText(tempText);
    setToSelected(tempSel);
  };

  // ── Validate search inputs ─────────────────────────────────────────────────
  const validateSearch = (): { valid: boolean; from: SelectedLocation | null; to: SelectedLocation | null } => {
    let valid = true;
    setFromError('');
    setToError('');
    setDateError('');
    setReturnDateError('');

    let activeFrom = fromSelected;
    let activeTo = toSelected;

    if (!activeFrom) {
      if (fromText && fromText.trim().length >= 2) {
        const coords = resolvePlaceCoords(fromText);
        if (coords) {
          activeFrom = { name: coords.name || fromText.trim(), lat: coords.lat, lng: coords.lng };
          setFromSelected(activeFrom);
        } else {
          setFromError('Please select a pickup location from the suggestions.');
          valid = false;
        }
      } else {
        setFromError('Please select a pickup location from the suggestions.');
        valid = false;
      }
    }

    if (!activeTo) {
      if (toText && toText.trim().length >= 2) {
        const coords = resolvePlaceCoords(toText);
        if (coords) {
          activeTo = { name: coords.name || toText.trim(), lat: coords.lat, lng: coords.lng };
          setToSelected(activeTo);
        } else {
          setToError('Please select a destination from the suggestions.');
          valid = false;
        }
      } else {
        setToError('Please select a destination from the suggestions.');
        valid = false;
      }
    }

    if (activeFrom && activeTo &&
      Math.abs(activeFrom.lat - activeTo.lat) < 0.001 &&
      Math.abs(activeFrom.lng - activeTo.lng) < 0.001) {
      setToError('Pickup and destination cannot be the same location.');
      valid = false;
    }
    if (!pickupDate) {
      setDateError('Please select a pickup date.');
      valid = false;
    }
    if (tripType === 'round-trip' && !returnDate) {
      setReturnDateError('Please select a return date for round-trip.');
      valid = false;
    }
    if (tripType === 'round-trip' && returnDate && returnDate < pickupDate) {
      setReturnDateError('Return date cannot be before pickup date.');
      valid = false;
    }
    return { valid, from: activeFrom, to: activeTo };
  };

  // ── See Price ─────────────────────────────────────────────────────────────
  const handleSeePrice = async () => {
    const { valid, from, to } = validateSearch();
    if (!valid || !from || !to) return;

    setRouteLoading(true);
    setRouteError('');
    setRouteResult(null);
    setSelectedVehicleId(null);

    try {
      const res = await fetch('/api/places/route/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLat: from.lat,
          pickupLng: from.lng,
          dropLat: to.lat,
          dropLng: to.lng,
          pickupName: from.name,
          dropName: to.name,
          tripType,
          pickupDate,
          returnDate: returnDate || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRouteError(data.error || 'Could not calculate route. Please try again.');
        setRouteLoading(false);
        return;
      }

      setRouteResult(data);
      setStep('prices');
      setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch {
      setRouteError('Network error. Please check your connection and try again.');
    } finally {
      setRouteLoading(false);
    }
  };

  // ── Select vehicle and proceed to form ─────────────────────────────────────
  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setStep('form');
    setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  // ── Validate booking form ──────────────────────────────────────────────────
  const validateBookingForm = (): boolean => {
    let valid = true;
    setNameError('');
    setPhoneError('');

    if (!name.trim() || name.trim().length < 2) {
      setNameError('Please enter your full name.');
      valid = false;
    }
    const cleanPhone = phone.replace(/[\s\-().]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number.');
      valid = false;
    }
    return valid;
  };

  // ── Submit booking ─────────────────────────────────────────────────────────
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBookingForm() || !routeResult || !selectedVehicleId) return;

    setBookingStatus('loading');
    setBookingError('');

    const selectedFare = routeResult.vehicleFares.find(f => f.vehicleId === selectedVehicleId);

    try {
      const res = await fetch('/api/booking/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupName: routeResult.pickupName,
          dropName: routeResult.dropName,
          pickupLat: routeResult.pickupLat,
          pickupLng: routeResult.pickupLng,
          dropLat: routeResult.dropLat,
          dropLng: routeResult.dropLng,
          tripType: routeResult.tripType,
          pickupDate,
          pickupTime: '09:00',
          returnDate: tripType === 'round-trip' ? returnDate : undefined,
          vehicleId: selectedVehicleId,
          passengers,
          name: name.trim(),
          countryCode: '+91',
          phone: phone.replace(/[\s\-().]/g, ''),
          email: email.trim() || undefined,
          notes: notes.trim() || undefined,
          clientDistanceKm: selectedFare?.oneWayDistanceKm,
          clientTotalFare: selectedFare?.totalFare,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingError(data.error || 'Booking failed. Please try again or contact us directly.');
        setBookingStatus('error');
        return;
      }

      setReferenceId(data.referenceId || '');
      setStep('success');
      setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch {
      setBookingError('Network error. Please try again or contact us via WhatsApp.');
      setBookingStatus('error');
    }
  };

  // ── WhatsApp fallback ──────────────────────────────────────────────────────
  const handleWhatsApp = () => {
    const selectedFare = routeResult?.vehicleFares.find(f => f.vehicleId === selectedVehicleId);
    const lines = [
      '*CAB BOOKING ENQUIRY — UMA TRAVELS*',
      `*From:* ${routeResult?.pickupName || fromText || 'Not specified'}`,
      `*To:* ${routeResult?.dropName || toText || 'Not specified'}`,
      `*Trip Type:* ${routeResult?.tripType === 'round-trip' ? 'Round Trip' : 'One Way'}`,
      `*Pickup Date:* ${pickupDate}`,
      routeResult?.tripType === 'round-trip' && returnDate ? `*Return Date:* ${returnDate}` : '',
      selectedFare ? `*Vehicle:* ${selectedFare.vehicleName}` : '',
      selectedFare ? `*Estimated Fare:* ₹${selectedFare.totalFare.toLocaleString('en-IN')}` : '',
      `*Passengers:* ${passengers}`,
      name ? `*Name:* ${name}` : '',
      phone ? `*Mobile:* +91 ${phone}` : '',
      notes ? `*Notes:* ${notes}` : '',
      '',
      '_Please confirm availability._',
    ].filter(Boolean).join('\n');
    window.open(getWhatsAppUrl(lines), '_blank', 'noopener,noreferrer');
  };

  // ── Selected fare for booking form ────────────────────────────────────────
  const selectedFare = routeResult?.vehicleFares.find(f => f.vehicleId === selectedVehicleId);

  // ═══════════════════════════════════════════════════════════════════════════
  // SUCCESS SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 'success') {
    return (
      <div ref={formTopRef} className="text-center py-8 px-4 sm:px-6 animate-in fade-in zoom-in-95">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 bg-gradient-to-tr from-emerald-500/20 via-emerald-500/10 to-emerald-500/30 border border-emerald-500/40 text-emerald-600 shadow-xl shadow-emerald-500/10">
          <CheckCircle size={40} className="animate-in zoom-in duration-300" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">
          Booking Request Received!
        </h3>

        {referenceId && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-black text-slate-700 mb-3 shadow-xs">
            <span>Booking Ref:</span>
            <span className="text-amber-600 font-mono tracking-wider font-extrabold">{referenceId}</span>
          </div>
        )}

        <p className="text-slate-600 mb-6 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
          Our operations team will call you within <span className="font-bold text-slate-900">10-15 minutes</span> with driver &amp; cab details. Zero advance payment required!
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-xs mx-auto">
          <button
            type="button"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
            onClick={() => {
              setStep('search');
              setRouteResult(null);
              setSelectedVehicleId(null);
              setName('');
              setPhone('');
              setEmail('');
              setNotes('');
              setBookingStatus('idle');
            }}
          >
            Book Another Cab
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            onClick={handleWhatsApp}
          >
            <MessageCircle size={16} /> WhatsApp Us
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-3 text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-600" /> 100% Confirmed Cab</span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1"><CheckCircle2 size={13} className="text-emerald-600" /> Pay Driver at Destination</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={formTopRef} className="flex flex-col gap-3">
      {/* ═══════════════════════════════════════════════════════════════════
          STEP INDICATOR (when beyond search step)
      ═══════════════════════════════════════════════════════════════════ */}
      {step !== 'search' && (
        <div className="flex items-center justify-between gap-2 p-2 bg-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 mb-2">
          {(step === 'prices' || step === 'form') && (
            <button
              type="button"
              onClick={() => {
                if (step === 'form') setStep('prices');
                else if (step === 'prices') setStep('search');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm transition-all hover:-translate-x-0.5 active:translate-x-0 cursor-pointer"
            >
              <ChevronLeft size={14} className="text-amber-500" />
              {step === 'form' ? 'Back to Cabs' : 'Change Route'}
            </button>
          )}

          {/* Stepper Breadcrumb Pills */}
          <div className="flex items-center gap-1.5 ml-auto text-[11px] font-bold">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 bg-white/70 border border-slate-200/60 shadow-xs">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="hidden sm:inline">1.</span> Route
            </span>

            <span className="text-slate-300">→</span>

            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              step === 'prices' ? 'bg-amber-500 text-white font-black shadow-sm' : 'text-slate-700 bg-white/70 border border-slate-200/60'
            }`}>
              {step === 'form' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Car size={12} />}
              <span className="hidden sm:inline">2.</span> Choose Cab
            </span>

            <span className="text-slate-300">→</span>

            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              step === 'form' ? 'bg-amber-500 text-white font-black shadow-sm' : 'text-slate-400'
            }`}>
              <CheckCircle size={12} />
              <span className="hidden sm:inline">3.</span> Confirm
            </span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STEP 1: SEARCH
      ═══════════════════════════════════════════════════════════════════ */}
      {step === 'search' && (
        <>
          {/* Trip type Segmented Control */}
          <div>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/90 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-inner">
              {([
                { 
                  value: 'one-way', 
                  label: 'One-Way Drop', 
                  sub: 'Point-to-Point Drop', 
                  badge: 'Direct Route',
                  icon: Navigation 
                },
                { 
                  value: 'round-trip', 
                  label: 'Round Trip', 
                  sub: 'Return Cab Included', 
                  badge: 'Best Value',
                  icon: RotateCcw 
                },
              ] as const).map(({ value, label, sub, badge, icon: TabIcon }) => {
                const active = tripType === value;
                return (
                  <label
                    key={value}
                    className={`relative flex items-center gap-2.5 py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                      active
                        ? 'bg-white border border-amber-300/80 shadow-md ring-2 ring-amber-400/25 text-amber-900'
                        : 'border border-transparent hover:bg-white/60 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tripType"
                      value={value}
                      checked={tripType === value}
                      onChange={() => setTripType(value)}
                      className="sr-only"
                    />
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      active ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-200/80 text-slate-500'
                    }`}>
                      <TabIcon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black text-xs sm:text-sm tracking-tight truncate ${active ? 'text-slate-900' : 'text-slate-700'}`}>
                          {label}
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border ${
                          active 
                            ? 'bg-amber-100 text-amber-800 border-amber-300' 
                            : 'bg-slate-200/60 text-slate-600 border-slate-300/60'
                        }`}>
                          {badge}
                        </span>
                      </div>
                      <p className={`text-[10px] font-bold ${active ? 'text-amber-600' : 'text-slate-400'}`}>
                        {sub}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 px-2 flex items-center justify-between">
              <span>🚗 Toyota Innova: round-trip only (excl. Kolkata)</span>
              <span className="font-semibold text-emerald-600">Zero Toll in Base Fare</span>
            </p>
          </div>

          {/* Locations Container */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm relative">
            <div className="flex items-stretch gap-2.5 sm:gap-3">
              {/* Route indicator line */}
              <div className="flex flex-col items-center justify-between py-3 shrink-0">
                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shadow-sm" />
                <span className="w-0.5 flex-1 border-l-2 border-dashed border-slate-300 my-1" />
                <span className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100 shadow-sm" />
              </div>

              {/* Location inputs */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                <LocationInput
                  id="pickup-location"
                  label="Pickup Location"
                  placeholder="City, station, airport (e.g. Dhanbad)..."
                  iconColor="text-emerald-600"
                  inputColor="emerald"
                  value={fromText}
                  selected={fromSelected}
                  onChange={setFromText}
                  onSelect={setFromSelected}
                  onClear={() => { setFromSelected(null); setFromText(''); }}
                  onSwap={handleSwap}
                  onGps={detectGps}
                  gpsLoading={gpsLoading}
                  error={fromError}
                />
                
                <LocationInput
                  id="drop-location"
                  label="Drop Destination"
                  placeholder="Destination city (e.g. Kolkata Airport)..."
                  iconColor="text-amber-600"
                  inputColor="amber"
                  value={toText}
                  selected={toSelected}
                  onChange={setToText}
                  onSelect={setToSelected}
                  onClear={() => { setToSelected(null); setToText(''); }}
                  error={toError}
                />
              </div>
            </div>
          </div>

          {gpsError && (
            <p className="text-[11px] text-rose-600 font-semibold flex items-start gap-1.5 px-2 bg-rose-50 py-1.5 rounded-xl border border-rose-200">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />{gpsError}
            </p>
          )}

          {/* Date & Passengers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Pickup date */}
            <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <label htmlFor="pickup-date" className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-500" />
                  Pickup Date
                </label>
                <div className="flex gap-1.5">
                  <button 
                    type="button" 
                    onClick={() => { setPickupDate(getLocalDateISO()); setDateError(''); }} 
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      pickupDate === getLocalDateISO()
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-amber-50 text-amber-800 border-amber-300/60 hover:bg-amber-100'
                    }`}
                  >
                    Today
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setPickupDate(getLocalDateISO(1)); setDateError(''); }} 
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      pickupDate === getLocalDateISO(1)
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
              <input
                id="pickup-date"
                type="date"
                min={minDate}
                value={pickupDate}
                onChange={(e) => { setPickupDate(e.target.value); setDateError(''); }}
                suppressHydrationWarning
                className={`w-full text-xs sm:text-sm font-semibold rounded-xl border px-3 py-2 outline-none transition shadow-sm ${
                  dateError 
                    ? 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-100' 
                    : 'border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-800'
                }`}
              />
              {dateError && <p className="text-[10px] text-rose-600 font-bold mt-1">{dateError}</p>}
            </div>

            {/* Return date OR Passengers */}
            {tripType === 'round-trip' ? (
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-sm">
                <label htmlFor="return-date" className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5 mb-1.5">
                  <RotateCcw size={13} className="text-blue-600" />
                  Return Date *
                </label>
                <input
                  id="return-date"
                  type="date"
                  min={pickupDate || minDate}
                  value={returnDate}
                  onChange={(e) => { setReturnDate(e.target.value); setReturnDateError(''); }}
                  suppressHydrationWarning
                  className={`w-full text-xs sm:text-sm font-semibold rounded-xl border px-3 py-2 outline-none transition shadow-sm ${
                    returnDateError 
                      ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-100 text-rose-900' 
                      : 'border-blue-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800'
                  }`}
                />
                {returnDateError && <p className="text-[10px] text-rose-600 font-bold mt-1">{returnDateError}</p>}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Users size={13} className="text-amber-500" />
                    Passengers
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    {passengers <= 4 ? 'Sedan / Hatch' : 'SUV / Ertiga / Innova'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 bg-slate-50 p-1 rounded-xl border border-slate-200/70">
                  <button 
                    type="button" 
                    onClick={() => setPassengers(Math.max(1, passengers - 1))} 
                    disabled={passengers <= 1}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center disabled:opacity-40 hover:bg-amber-50 hover:text-amber-600 transition cursor-pointer text-slate-700 font-black text-base active:scale-95"
                  >
                    −
                  </button>
                  <div className="text-center flex-1">
                    <span className="font-black text-sm text-slate-900">{passengers}</span>
                    <span className="text-[11px] font-bold text-slate-500 ml-1.5">
                      {passengers === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setPassengers(Math.min(7, passengers + 1))} 
                    disabled={passengers >= 7}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center disabled:opacity-40 hover:bg-amber-50 hover:text-amber-600 transition cursor-pointer text-slate-700 font-black text-base active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Round-trip: passengers row below dates */}
          {tripType === 'round-trip' && (
            <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users size={13} className="text-amber-500" />
                  Passengers Count
                </label>
                <span className="text-[10px] font-bold text-slate-400">
                  {passengers <= 4 ? 'Sedan (Up to 4)' : 'SUV / Ertiga / Innova (5 to 7)'}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200/70">
                <button 
                  type="button" 
                  onClick={() => setPassengers(Math.max(1, passengers - 1))} 
                  disabled={passengers <= 1}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center disabled:opacity-40 hover:bg-amber-50 hover:text-amber-600 transition cursor-pointer text-slate-700 font-black text-lg active:scale-95"
                >
                  −
                </button>
                <span className="font-black text-sm sm:text-base text-slate-900 flex-1 text-center">
                  {passengers} {passengers === 1 ? 'Passenger' : 'Passengers'}
                </span>
                <button 
                  type="button" 
                  onClick={() => setPassengers(Math.min(7, passengers + 1))} 
                  disabled={passengers >= 7}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center disabled:opacity-40 hover:bg-amber-50 hover:text-amber-600 transition cursor-pointer text-slate-700 font-black text-lg active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {routeError && (
            <div role="alert" className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 shadow-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{routeError}</span>
            </div>
          )}

          {/* Primary Action Button: See Live Highway Prices */}
          <button
            type="button"
            onClick={handleSeePrice}
            disabled={routeLoading}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-wait group relative overflow-hidden"
          >
            {/* Shimmer animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />
            
            {routeLoading ? (
              <>
                <Loader2 size={20} className="animate-spin text-white" />
                <span className="tracking-wide">Measuring Live Highway Route...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} className="text-amber-200 animate-pulse" />
                <span className="tracking-wide">Calculate Highway Fares</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Trust bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-slate-500 flex-wrap font-bold pt-1">
            <span className="flex items-center gap-1 text-slate-700 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200/60 shadow-xs">
              <ShieldCheck size={12} className="text-emerald-600" /> Verified Drivers
            </span>
            <span className="flex items-center gap-1 text-slate-700 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200/60 shadow-xs">
              <Star size={12} className="text-amber-500 fill-amber-400" /> {SITE_CONFIG.rating}★ Rated (2,400+ Trips)
            </span>
            <span className="flex items-center gap-1 text-slate-700 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200/60 shadow-xs">
              <CheckCircle2 size={12} className="text-emerald-600" /> Zero Advance
            </span>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STEP 2: PRICES
      ═══════════════════════════════════════════════════════════════════ */}
      {step === 'prices' && routeResult && (
        <>
          {/* Route summary banner — Highway Pass Card */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white border border-slate-700/80 shadow-2xl relative overflow-hidden">
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Navigation size={11} /> Verified Highway Route
                </span>
                <span className={`font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                  routeResult.tripType === 'round-trip'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                }`}>
                  {routeResult.tripType === 'round-trip' ? 'Round Trip Journey' : 'One-Way Drop'}
                </span>
              </div>

              {/* City Names */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 py-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 shrink-0" />
                  <span className="font-black text-sm sm:text-base text-white truncate">{routeResult.pickupName}</span>
                </div>
                <div className="hidden sm:flex items-center text-amber-400 shrink-0">
                  <ArrowRight size={16} />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/30 shrink-0" />
                  <span className="font-black text-sm sm:text-base text-white truncate">{routeResult.dropName}</span>
                </div>
              </div>

              {/* Highway details pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 pt-3 border-t border-slate-800 text-[11px] font-bold">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 text-emerald-300 border border-slate-700">
                  <Navigation size={12} className="text-emerald-400" /> {routeResult.distanceKm} km Highway Distance
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 text-blue-300 border border-slate-700">
                  <Clock size={12} className="text-blue-400" /> ~{routeResult.durationFormatted} Drive
                </span>
                {routeResult.tripType === 'round-trip' && routeResult.nightHaltCount > 0 && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {routeResult.nightHaltCount} Night Halt{routeResult.nightHaltCount > 1 ? 's' : ''} Included
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-400 text-[10px] ml-auto">
                  <Sparkles size={11} className="text-amber-400" /> 100% AC Cabs
                </span>
              </div>
            </div>
          </div>

          {/* Auto-conversion notice */}
          {routeResult.wasAutoConverted && routeResult.autoConvertedMessage && (
            <div role="alert" className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-2.5 shadow-sm">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
              <span>{routeResult.autoConvertedMessage}</span>
            </div>
          )}

          {/* Return date required for round-trip after conversion */}
          {routeResult.wasAutoConverted && !returnDate && (
            <div className="p-3 rounded-2xl bg-blue-50/90 border border-blue-300 shadow-sm">
              <label htmlFor="return-date-prices" className="block text-[11px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5 mb-1.5">
                <RotateCcw size={13} className="text-blue-600" />
                Return Date (required for round-trip quote)
              </label>
              <input
                id="return-date-prices"
                type="date"
                min={pickupDate}
                value={returnDate}
                onChange={(e) => {
                  setReturnDate(e.target.value);
                  handleSeePrice();
                }}
                className="w-full text-xs sm:text-sm font-semibold rounded-xl border border-blue-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm"
              />
            </div>
          )}

          {/* Vehicle fare cards */}
          {routeResult.vehicleFares.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-sm">
              No vehicles available for this route and trip type.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {routeResult.vehicleFares.map((fare) => (
                <VehicleFareCard
                  key={fare.vehicleId}
                  fare={fare}
                  isSelected={selectedVehicleId === fare.vehicleId}
                  onSelect={() => handleSelectVehicle(fare.vehicleId)}
                />
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
            <Info size={14} className="shrink-0 mt-0.5 text-slate-400" />
            <p>{routeResult.disclaimer}</p>
          </div>

          {/* WhatsApp & Modify buttons */}
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setStep('search')}
              className="flex-1 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={13} /> Modify Route
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MessageCircle size={15} /> WhatsApp Us
            </button>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STEP 3: BOOKING FORM
      ═══════════════════════════════════════════════════════════════════ */}
      {step === 'form' && routeResult && selectedFare && (
        <form onSubmit={handleBookingSubmit} noValidate className="flex flex-col gap-3.5">
          {/* Booking summary chip */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-300/80 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500 text-white mb-1 shadow-xs">
                  Selected Cab
                </span>
                <p className="font-black text-slate-900 text-sm sm:text-base truncate">
                  {selectedFare.vehicleName} · {routeResult.pickupName} → {routeResult.dropName}
                </p>
                <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  {selectedFare.tripType === 'round-trip' ? 'Round Trip Journey' : 'One-Way Drop'} · {selectedFare.oneWayDistanceKm} km road distance · Date: {pickupDate}
                  {routeResult.tripType === 'round-trip' && returnDate ? ` → ${returnDate}` : ''}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Est. Fare</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-600">₹{selectedFare.totalFare.toLocaleString('en-IN')}</p>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full inline-block">
                  Zero Advance
                </span>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Name */}
            <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
              <label htmlFor="booking-name" className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
                <Users size={12} className="text-amber-500" />
                Full Name *
              </label>
              <input
                id="booking-name"
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                autoComplete="name"
                className={`w-full text-xs sm:text-sm font-semibold rounded-xl border px-3 py-2 outline-none transition shadow-sm ${
                  nameError ? 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-100' : 'border-slate-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-900'
                }`}
              />
              {nameError && <p className="text-[10px] text-rose-600 font-bold mt-1">{nameError}</p>}
            </div>

            {/* Phone */}
            <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
              <label htmlFor="booking-phone" className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
                <Phone size={12} className="text-emerald-500" />
                Mobile / WhatsApp *
              </label>
              <div className={`flex items-center rounded-xl border transition shadow-sm ${
                phoneError ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-100' : 'border-slate-200 bg-white focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100'
              }`}>
                <span className="px-3 text-xs font-black text-slate-700 border-r border-slate-200 h-full flex items-center py-2 bg-slate-50 rounded-l-xl">+91</span>
                <input
                  id="booking-phone"
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
                  autoComplete="tel-national"
                  maxLength={10}
                  className="flex-1 text-xs sm:text-sm font-semibold px-3 py-2 bg-transparent outline-none text-slate-900"
                />
              </div>
              {phoneError && <p className="text-[10px] text-rose-600 font-bold mt-1">{phoneError}</p>}
            </div>
          </div>

          {/* Email (optional) */}
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
            <label htmlFor="booking-email" className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[9px] font-bold text-slate-400 normal-case">Optional — for instant e-receipt</span>
            </label>
            <input
              id="booking-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition shadow-sm placeholder:text-slate-400"
            />
          </div>

          {/* Notes (optional) */}
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
            <label htmlFor="booking-notes" className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
              <span>Additional Instructions</span>
              <span className="text-[9px] font-bold text-slate-400 normal-case">Optional</span>
            </label>
            <textarea
              id="booking-notes"
              placeholder="Preferred pickup time, flight/train number, luggage details, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={500}
              className="w-full text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition shadow-sm placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Fare Summary Breakdown */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <p className="font-black text-slate-800 text-[11px] uppercase tracking-wider">Fare Summary Breakdown</p>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>
                {selectedFare.tripType === 'round-trip'
                  ? `2 × ${selectedFare.oneWayDistanceKm} km × ₹${selectedFare.ratePerKm}/km`
                  : `${selectedFare.oneWayDistanceKm} km × ₹${selectedFare.ratePerKm}/km`}
              </span>
              <span className="font-black text-slate-900">₹{selectedFare.baseDistanceCharge.toLocaleString('en-IN')}</span>
            </div>
            {selectedFare.nightHaltCount > 0 && (
              <div className="flex justify-between text-blue-700 font-medium">
                <span>{selectedFare.nightHaltCount} night halt{selectedFare.nightHaltCount > 1 ? 's' : ''} × ₹{selectedFare.perNightHaltRate}</span>
                <span className="font-black">₹{selectedFare.nightHaltCharge.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
              <span className="font-black text-slate-900">Total Estimated Fare</span>
              <span className="font-black text-emerald-600 text-base">₹{selectedFare.totalFare.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 pt-0.5">
              <AlertTriangle size={11} className="text-amber-500 shrink-0" />
              Tolls &amp; State Border Taxes to be paid at actual highway toll plazas.
            </p>
          </div>

          {bookingError && (
            <div role="alert" className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 shadow-sm">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{bookingError}</span>
            </div>
          )}

          {/* Submit buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              disabled={bookingStatus === 'loading'}
              className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {bookingStatus === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Submitting Booking...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Confirm &amp; Book Cab (₹{selectedFare.totalFare.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black cursor-pointer transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              title="Book directly on WhatsApp"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>

          {/* Micro Guarantee */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 flex-wrap font-bold pt-1">
            <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-600" /> Verified Drivers</span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600" /> Zero Advance Required</span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1"><Sparkles size={12} className="text-amber-500" /> Pay Driver After Ride</span>
          </div>
        </form>
      )}
    </div>
  );
}
