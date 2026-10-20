'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MapPin, Navigation, RotateCcw, Calendar, Clock,
  Car, Users, User, Phone, ArrowLeftRight, ArrowRight,
  CheckCircle, Loader2, MessageCircle, Locate,
  IndianRupee, AlertCircle, Map as MapIcon,
  Sparkles, ShieldCheck, Building2, Droplets,
  CheckCircle2, ChevronDown, ChevronLeft, Info,
  Package, Timer, AlertTriangle, Star
} from 'lucide-react';
import { VEHICLES, isKolkataLocation, type VehicleCategory } from '@/data/vehicles';
import { ALL_LOCATIONS } from '@/data/locations';
import { getWhatsAppUrl, SITE_CONFIG } from '@/lib/config';
import { getDistanceEstimate, haversineKm, resolvePlaceCoords } from '@/lib/geo-places';
import MapPickerLeaflet from './MapPickerLeaflet';

const TRIP_TYPES = ['one-way', 'round-trip', 'local', 'outstation', 'wedding', 'corporate', 'airport-transfer'] as const;

// One-way trips are limited to these vehicles; other trip types show the full fleet.
const ONE_WAY_VEHICLE_IDS: VehicleCategory[] = ['sedan', 'ertiga'];

export const COUNTRY_CODES = [
  { code: '+91', flag: 'IN', name: 'India' },
  { code: '+1', flag: 'US', name: 'USA/Canada' },
  { code: '+44', flag: 'GB', name: 'UK' },
  { code: '+971', flag: 'AE', name: 'UAE' },
  { code: '+966', flag: 'SA', name: 'Saudi Arabia' },
  { code: '+65', flag: 'SG', name: 'Singapore' },
  { code: '+61', flag: 'AU', name: 'Australia' },
  { code: '+977', flag: 'NP', name: 'Nepal' },
  { code: '+880', flag: 'BD', name: 'Bangladesh' },
  { code: '+974', flag: 'QA', name: 'Qatar' },
] as const;

// ── Vehicle category group for local pricing ─────────────────────────────
// Sedan → 'sedan' | Ertiga → 'ertiga' | Innova / SUV → 'innova' | Tempo → 'tempo'
function getLocalPriceGroup(vehicleId: string): 'sedan' | 'ertiga' | 'innova' | 'tempo' {
  if (vehicleId === 'sedan') return 'sedan';
  if (vehicleId === 'ertiga') return 'ertiga';
  if (vehicleId === 'tempo-traveller' || vehicleId.includes('tempo')) return 'tempo';
  return 'innova'; // innova, luxury
}

// ── Local Package Pricing Matrix ─────────────────────────────────────────
// Rates: Sedan | Ertiga | Innova | Tempo
const LOCAL_BASE_PRICES: Record<string, Record<string, number>> = {
  '4hr': { sedan: 1480, ertiga: 2099, innova: 2099, suv: 2099, tempo: 3500 },
  '8hr': { sedan: 2120, ertiga: 2599, innova: 3399, suv: 3399, tempo: 5199 },
  '10hr': { sedan: 2599, ertiga: 2799, innova: 3499, suv: 3499, tempo: 6499 },
};

interface LocalPackage {
  id: string;
  label: string;
  hrs: number;
  km: number;
  key: '4hr' | '8hr' | '10hr';
}

const LOCAL_PACKAGES: LocalPackage[] = [
  { id: '4hr', label: '4 Hrs / 40 Km', hrs: 4, km: 40, key: '4hr' },
  { id: '8hr', label: '8 Hrs / 80 Km', hrs: 8, km: 80, key: '8hr' },
  { id: '10hr', label: '10 Hrs / 100 Km', hrs: 10, km: 100, key: '10hr' },
];

function getLocalPackagePrice(vehicleId: string, pkgKey: string): number {
  const group = getLocalPriceGroup(vehicleId);
  return LOCAL_BASE_PRICES[pkgKey]?.[group] ?? 1480;
}

const bookingSchema = z.object({
  from: z.string().min(2, 'Please enter a pickup location'),
  to: z.string().optional().or(z.literal('')),
  tripType: z.enum(TRIP_TYPES),
  pickupDate: z.string().min(1, 'Please select a pickup date'),
  pickupTime: z.string().min(1, 'Please select a pickup time'),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  vehicleCategory: z.string().min(1, 'Please select a vehicle'),
  localPackageId: z.string().optional(),
  passengers: z.coerce.number().default(1),
  name: z.string().min(2, 'Please enter your name'),
  countryCode: z.string().default('+91'),
  phone: z.string().min(6, 'Enter a valid mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  notes: z.string().optional(),
  website: z.string().max(300).optional(),
}).refine(
  (data) => data.tripType === 'local' || (data.to || '').trim().length >= 2,
  { message: 'Please enter a drop location', path: ['to'] }
).refine(
  (data) => !(data.tripType === 'round-trip' && !data.returnDate),
  { message: 'Return date is required for round-trip', path: ['returnDate'] }
).refine(
  (data) => {
    const raw = data.phone.replace(/[\s-]/g, '');
    if (data.countryCode === '+91') return /^[6-9]\d{9}$/.test(raw);
    return /^\d{6,14}$/.test(raw);
  },
  { message: 'Enter a valid mobile number for selected country', path: ['phone'] }
);

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  prefillFrom?: string;
  prefillTo?: string;
  prefillTrip?: typeof TRIP_TYPES[number];
  prefillVehicle?: string;
  compact?: boolean;
}


// ── Local (timezone-safe) date string — avoids UTC off-by-one in IST ──────
function getLocalDateISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
// ── Autocomplete hook ────────────────────────────────────────────────────
function useLocationSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<Array<{ name: string; fullAddress: string; lat: number; lng: number }>>([]);
  useEffect(() => {
    const q = query.trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale suggestions when the query is reset
    if (q.length < 2) { setSuggestions([]); return; }
    const lower = q.toLowerCase();
    const timer = setTimeout(async () => {
      const local = ALL_LOCATIONS
        .filter((l) => l.status === 'published' && l.name.toLowerCase().includes(lower))
        .slice(0, 5).map((l) => ({ name: l.name, fullAddress: `${l.name}, ${l.district}, ${l.state}, India`, lat: l.lat, lng: l.lng }));
      setSuggestions(local);
      try {
        const res = await fetch(`/api/places/autocomplete/?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.suggestions?.length > 0) {
            const seen = new Set(local.map((l) => `${l.name.toLowerCase()}|${l.lat}|${l.lng}`));
            const extra = data.suggestions.filter((s: { name: string; lat: number; lng: number }) => !seen.has(`${s.name.toLowerCase()}|${s.lat}|${s.lng}`));
            const merged = [...local, ...extra];
            const unique = merged.filter((s, i) =>
              merged.findIndex((o) => o.name.toLowerCase() === s.name.toLowerCase() && o.lat === s.lat && o.lng === s.lng) === i
            );
            setSuggestions(unique.slice(0, 8));
          }
        }
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  return query.trim().length < 2 ? [] : suggestions;
}

// ─── Location Input Component ────────────────────────────────────────────────
interface LocationInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSelectCoords?: (coords: { lat: number; lng: number } | null) => void;
  onGps?: () => void;
  gpsLoading?: boolean;
  onSwap?: () => void;
  onMapPick?: () => void;
  error?: string;
  placeholder?: string;
  iconColor?: string;
  badge?: string;
}

function LocationInput({ id, label, value, onChange, onSelectCoords, onGps, gpsLoading, onSwap, onMapPick, error, placeholder, iconColor = 'text-emerald-500', badge }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const suggestions = useLocationSuggestions(value);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative flex-1">
      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
        <label htmlFor={id} className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1 m-0 ${iconColor}`}>
          <MapPin size={11} className="shrink-0" /><span>{label}</span>
        </label>
        <div className="flex items-center gap-1 shrink-0">
          {badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{badge}</span>}
          {onGps && (
            <button type="button" onClick={onGps} disabled={gpsLoading}
              className="text-[9px] sm:text-[10px] font-bold text-amber-700 inline-flex items-center gap-1 cursor-pointer transition active:scale-95 bg-amber-500/10 hover:bg-amber-500/20 px-1.5 py-0.5 rounded-md border border-amber-500/25 disabled:opacity-50"
              title="Detect my current GPS location" aria-label="GPS detect">
              {gpsLoading ? <Loader2 size={9} className="animate-spin" /> : <Locate size={9} />}
              <span>GPS</span>
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <input id={id} type="text" role="combobox" placeholder={placeholder || 'Type full address or city...'}
          className={`form-input !min-h-[40px] sm:!min-h-[44px] !py-1.5 !px-3 shadow-xs bg-white/90 font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-amber-500 focus:bg-white transition-all ${onSwap ? 'pr-24' : 'pr-16'} ${error ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onSelectCoords?.(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off" aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-listbox`} />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Map pin button */}
          {onMapPick && (
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMapPick(); }}
              title="Pick location from map" aria-label="Open map picker"
              className="flex items-center gap-0.5 h-7 px-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[9px] sm:text-[10px] font-bold active:scale-90 transition cursor-pointer shadow-xs">
              <MapIcon size={11} /><span className="hidden sm:inline">Map</span>
            </button>
          )}
          {onSwap && (
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSwap(); }}
              className="h-7 px-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-500/30 text-[9px] font-black transition active:scale-90 cursor-pointer"
              title="Swap locations" aria-label="Swap">
              <ArrowLeftRight size={11} />
            </button>
          )}
        </div>
      </div>
      {open && suggestions.length > 0 && (
        <ul id={`${id}-listbox`} className="absolute z-[100] left-0 right-0 mt-1 bg-white border border-slate-200/90 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-50"
          style={{ maxHeight: '220px', overflowY: 'auto' }} role="listbox">
          {suggestions.map((s, i) => {
            const chosenAddress = s.fullAddress || s.name;
            return (
              <li key={`${s.name}-${s.lat}-${s.lng}-${i}`} role="option" aria-selected={value === chosenAddress}
                className="px-3 py-2.5 cursor-pointer hover:bg-amber-50 flex items-start gap-2.5 group transition-colors"
                onMouseDown={() => {
                  onChange(chosenAddress);
                  onSelectCoords?.({ lat: s.lat, lng: s.lng });
                  setOpen(false);
                }}>
                <MapPin size={13} className="shrink-0 text-amber-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-800 truncate">{s.name}</p>
                  {s.fullAddress && <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mt-0.5">{s.fullAddress}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p className="text-[11px] mt-1 font-bold text-red-600 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

// ─── Fare Estimate Types ─────────────────────────────────────────────────────
interface LocalFareEstimate {
  type: 'local';
  pkg: LocalPackage;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  vehicleModels: string;
  seatingCapacity: number;
  basePrice: number;
  priceGroup: string;
  estimatedTotal: number;
}

interface OutstationFareEstimate {
  type: 'outstation';
  tripType: 'one-way' | 'round-trip';
  distanceKm: number;
  durationFormatted?: string;
  ratePerKm: number;
  baseDistanceCharge: number;
  nightHaltCount: number;
  nightHaltCharge: number;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  vehicleModels: string;
  seatingCapacity: number;
  estimatedTotal: number;
}

type FareEstimate = LocalFareEstimate | OutstationFareEstimate;

// ─── Fare Rates Matrix ────────────────────────────────────────────────────────
const FARE_RATES: Record<string, { oneWay: number | null; roundTrip: number; nightHalt: number }> = {
  sedan: { oneWay: 21, roundTrip: 14, nightHalt: 500 },
  ertiga: { oneWay: 26, roundTrip: 20, nightHalt: 1000 },
  innova: { oneWay: null, roundTrip: 35, nightHalt: 1000 },
  'tempo-traveller': { oneWay: null, roundTrip: 28, nightHalt: 1000 },
};



function getNightHaltDays(pickDate: string, retDate?: string): number {
  if (!pickDate || !retDate) return 0;
  const p = new Date(pickDate);
  p.setHours(0, 0, 0, 0);
  const r = new Date(retDate);
  r.setHours(0, 0, 0, 0);
  const diff = Math.round((r.getTime() - p.getTime()) / (24 * 60 * 60 * 1000));
  return Math.max(0, diff);
}

// ─── Local Fare Panel ────────────────────────────────────────────────────────
function LocalPanel({ e }: { e: LocalFareEstimate }) {
  const groupLabel = e.priceGroup === 'sedan' ? 'Sedan' : e.priceGroup === 'tempo' ? 'Tempo Traveller' : 'SUV';
  return (
    <div className="rounded-2xl overflow-hidden border border-emerald-200/60 shadow-lg">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 flex items-center gap-2">
        <Building2 size={16} className="text-white" />
        <span className="text-white font-black text-sm">Local Package — {e.pkg.label}</span>
        <span className="ml-auto bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{groupLabel}</span>
      </div>
      <div className="bg-white p-4">
        <div className="flex gap-3 mb-3">
          <div className="relative w-20 h-14 bg-slate-50 rounded-xl border border-slate-100 shrink-0 overflow-hidden">
            <Image src={e.vehicleImage} alt={e.vehicleName} fill sizes="80px" className="object-contain p-1" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">{e.vehicleName}</p>
            <p className="text-[11px] text-slate-500">{e.vehicleModels}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px]">
              <span className="font-bold text-slate-600 flex items-center gap-0.5"><Users size={10} className="text-emerald-600" /> {e.seatingCapacity}S</span>
              <span className="text-emerald-700 font-bold">100% AC</span>
              <span className="text-blue-700 font-bold flex items-center gap-0.5"><Droplets size={10} className="text-blue-500" /> Water Bottle</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5"><Sparkles size={10} className="text-emerald-500" /> Tissue Paper</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <p className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1"><Timer size={10} />Included Hours</p>
            <p className="text-xl font-black text-slate-900">{e.pkg.hrs}<span className="text-xs font-bold text-slate-500"> hrs</span></p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <p className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1"><Navigation size={10} />Included KMs</p>
            <p className="text-xl font-black text-slate-900">{e.pkg.km}<span className="text-xs font-bold text-slate-500"> km</span></p>
          </div>
        </div>
        <div className="space-y-1.5 text-xs mb-3">
          <div className="flex justify-between py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-600 flex items-center gap-1"><Package size={10} />Package Price</span>
            <span className="font-black text-slate-900">₹{e.basePrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between py-1.5 px-3 rounded-lg bg-orange-50 border border-orange-100">
            <span className="text-orange-700">Extra km (beyond {e.pkg.km} km)</span>
            <span className="font-bold text-orange-800">As applicable</span>
          </div>
          <div className="flex justify-between py-1.5 px-3 rounded-lg bg-orange-50 border border-orange-100">
            <span className="text-orange-700">Extra hrs (beyond {e.pkg.hrs} hrs)</span>
            <span className="font-bold text-orange-800">As applicable</span>
          </div>
          <div className="flex justify-between py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1"><AlertTriangle size={10} className="text-orange-400" />Toll &amp; Parking</span>
            <span className="font-bold text-orange-700">Excluded</span>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3 text-xs">
          <Info size={11} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-slate-500">Km &amp; hours calculated <strong>garage to garage</strong>. Extra charges for usage beyond package limit will be settled at trip end.</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Package Price</span>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5"><CheckCircle2 size={10} />Zero Advance</span>
          </div>
          <span className="text-2xl font-black text-emerald-600 flex items-center">
            <IndianRupee size={18} className="-mr-0.5" />{e.estimatedTotal.toLocaleString('en-IN')}
            <span className="text-[10px] font-bold text-slate-400 ml-1">+ extras*</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Outstation Fare Panel ───────────────────────────────────────────────────
function OutstationPanel({ e }: { e: OutstationFareEstimate }) {
  const isRound = e.tripType === 'round-trip';
  return (
    <div className="rounded-2xl overflow-hidden border border-amber-200/80 shadow-lg">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3 flex items-center gap-2">
        <Car size={16} className="text-white" />
        <span className="text-white font-black text-sm">
          {isRound ? 'Round Trip Fare Estimate' : 'One Way Fare Estimate'}
        </span>
        <span className="ml-auto bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          ~{e.distanceKm} km {e.durationFormatted ? `· ${e.durationFormatted}` : ''} {isRound ? 'one-way' : ''}
        </span>
      </div>
      <div className="bg-white p-4">
        <div className="flex gap-3 mb-3">
          <div className="relative w-20 h-14 bg-slate-50 rounded-xl border border-slate-100 shrink-0 overflow-hidden">
            <Image src={e.vehicleImage} alt={e.vehicleName} fill sizes="80px" className="object-contain p-1" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">{e.vehicleName}</p>
            <p className="text-[11px] text-slate-500">{e.vehicleModels}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px]">
              <span className="font-bold text-slate-600 flex items-center gap-0.5"><Users size={10} className="text-amber-600" /> {e.seatingCapacity} Seater</span>
              <span className="text-emerald-700 font-bold">100% AC</span>
              <span className="text-blue-700 font-bold flex items-center gap-0.5"><Droplets size={10} className="text-blue-500" /> Water Bottle</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5"><Sparkles size={10} className="text-emerald-500" /> Tissue Paper</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
            <p className="text-[10px] text-amber-800 font-bold flex items-center justify-center gap-1">
              <Navigation size={10} />Distance
            </p>
            <p className="text-xl font-black text-slate-900">
              ~{e.distanceKm}<span className="text-xs font-bold text-slate-500"> km</span>
            </p>
            {e.durationFormatted && (
              <p className="text-[10px] text-amber-700 font-bold mt-0.5 flex items-center justify-center gap-0.5">
                <Timer size={10} /> ~{e.durationFormatted}
              </p>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <p className="text-[10px] text-emerald-800 font-bold flex items-center justify-center gap-1">
              <ShieldCheck size={10} />Service
            </p>
            <p className="text-base font-black text-emerald-700 mt-0.5">
              Dedicated AC Cab
            </p>
          </div>
        </div>
        <div className="space-y-1.5 text-xs mb-3">
          <div className="flex justify-between py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-600">Base Trip Fare</span>
            <span className="font-black text-slate-900">₹{e.baseDistanceCharge.toLocaleString('en-IN')}</span>
          </div>
          {e.nightHaltCount > 0 && (
            <div className="flex justify-between py-1.5 px-3 rounded-lg bg-blue-50 border border-blue-100">
              <span className="text-blue-700">Night Halt Charges ({e.nightHaltCount} night{e.nightHaltCount > 1 ? 's' : ''})</span>
              <span className="font-bold text-blue-800">₹{e.nightHaltCharge.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1"><AlertTriangle size={10} className="text-orange-400" />Toll &amp; Parking</span>
            <span className="font-bold text-orange-700">Excluded (as per actuals)</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Total</span>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5"><CheckCircle2 size={10} />Zero Advance</span>
          </div>
          <span className="text-2xl font-black text-emerald-600 flex items-center">
            <IndianRupee size={18} className="-mr-0.5" />{e.estimatedTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────
export default function EnhancedBookingForm({
  prefillFrom = '', prefillTo = '', prefillTrip = 'one-way', prefillVehicle = '', compact = false,
}: BookingFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [referenceId, setReferenceId] = useState('');
  const [minDate, setMinDate] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [fareEstimate, setFareEstimate] = useState<FareEstimate | null>(null);
  const [mapPickerFor, setMapPickerFor] = useState<'from' | 'to' | null>(null);
  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(() => {
    if (prefillFrom) {
      const p = resolvePlaceCoords(prefillFrom);
      if (p) return { lat: p.lat, lng: p.lng };
    }
    return null;
  });
  const [toCoords, setToCoords] = useState<{ lat: number; lng: number } | null>(() => {
    if (prefillTo) {
      const p = resolvePlaceCoords(prefillTo);
      if (p) return { lat: p.lat, lng: p.lng };
    }
    return null;
  });
  const [roadDistanceKm, setRoadDistanceKm] = useState<number | null>(null);
  const [roadDurationText, setRoadDurationText] = useState<string | null>(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  // Mobile-only 3-step wizard (desktop always shows every section).
  const [mobileStep, setMobileStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const formTopRef = useRef<HTMLDivElement | null>(null);
  // Visibility helper: on mobile only the active step is shown, at md+ all sections show.
  const stepVis = (step: number, active = 'block') => (mobileStep === step ? active : 'hidden');

  const initialTrip: 'one-way' | 'round-trip' | 'local' =
    prefillTrip === 'one-way' || prefillTrip === 'round-trip' || prefillTrip === 'local' ? prefillTrip : 'one-way';

  useEffect(() => { setMinDate(getLocalDateISO()); }, []);

  const { register, handleSubmit, watch, getValues, setValue, trigger, setError, clearErrors, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      from: prefillFrom,
      to: prefillTo,
      tripType: initialTrip,
      vehicleCategory: prefillVehicle || 'sedan',
      passengers: 1,
      countryCode: '+91',
      localPackageId: '8hr',
      pickupDate: getLocalDateISO(),
      pickupTime: '09:00',
    },
  });

  // react-hook-form's watch() is intentionally used to drive reactive fare/vehicle UI.
  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form watch() subscription is intended here
  const tripType = watch('tripType');
  const fromValue = watch('from');
  const toValue = watch('to');
  const vehicleCategory = watch('vehicleCategory');
  const pickupDate = watch('pickupDate');
  const pickupTime = watch('pickupTime');
  const returnDate = watch('returnDate');
  const localPackageId = watch('localPackageId');
  const nameValue = watch('name');
  const phoneValue = watch('phone');

  const isLocal = tripType === 'local';
  const isRoundTrip = tripType === 'round-trip';
  const isOneWay = tripType === 'one-way';
  const priceGroup = getLocalPriceGroup(vehicleCategory);

  // One-way shows only a subset of the fleet
  const visibleVehicles = isOneWay ? VEHICLES.filter((v) => ONE_WAY_VEHICLE_IDS.includes(v.id)) : VEHICLES;
  const selectedVehicle = visibleVehicles.find((v) => v.id === vehicleCategory) || visibleVehicles[0] || VEHICLES[0];

  // The 4hr/40km package is offered for Sedan only
  const availableLocalPackages = vehicleCategory === 'sedan' ? LOCAL_PACKAGES : LOCAL_PACKAGES.filter((p) => p.id !== '4hr');

  // Keep localPackageId valid: default to 8hr, and drop 4hr when a non-Sedan is chosen
  useEffect(() => {
    if (!isLocal) return;
    if (!localPackageId || (vehicleCategory !== 'sedan' && localPackageId === '4hr')) {
      setValue('localPackageId', '8hr', { shouldValidate: true });
    }
  }, [isLocal, vehicleCategory, localPackageId, setValue]);

  // Keep the selected vehicle valid for the current trip type
  useEffect(() => {
    if (isOneWay && !ONE_WAY_VEHICLE_IDS.includes(vehicleCategory as VehicleCategory)) {
      setValue('vehicleCategory', ONE_WAY_VEHICLE_IDS[0], { shouldValidate: true });
    }
  }, [isOneWay, vehicleCategory, setValue]);

  // Auto-default return date for round trip if empty
  useEffect(() => {
    if (isRoundTrip && !returnDate && pickupDate) {
      setValue('returnDate', pickupDate, { shouldValidate: true });
    }
  }, [isRoundTrip, returnDate, pickupDate, setValue]);

  // ── Road Routing via OSRM (same as Fare Calculator) ────────────────────────
  useEffect(() => {
    if (isLocal || !fromValue || fromValue.trim().length < 2 || !toValue || toValue.trim().length < 2) {
      setRoadDistanceKm(null);
      setRoadDurationText(null);
      setIsRoutingLoading(false);
      return;
    }

    let isMounted = true;
    setIsRoutingLoading(true);

    const timer = setTimeout(async () => {
      try {
        const body: Record<string, unknown> = {
          pickupQuery: fromValue.trim(),
          dropQuery: toValue.trim(),
          pickupName: fromValue.trim(),
          dropName: toValue.trim(),
          tripType,
          pickupDate: pickupDate || getLocalDateISO(),
          returnDate: isRoundTrip && returnDate ? returnDate : undefined,
        };
        if (fromCoords?.lat && fromCoords?.lng) {
          body.pickupLat = fromCoords.lat;
          body.pickupLng = fromCoords.lng;
        }
        if (toCoords?.lat && toCoords?.lng) {
          body.dropLat = toCoords.lat;
          body.dropLng = toCoords.lng;
        }

        const res = await fetch('/api/places/route/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          if (data.ok && typeof data.distanceKm === 'number') {
            setRoadDistanceKm(data.distanceKm);
            setRoadDurationText(data.durationFormatted || null);
            setIsRoutingLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Road routing error in booking form:', err);
      }
      if (isMounted) {
        setIsRoutingLoading(false);
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [fromValue, toValue, isLocal, tripType, pickupDate, returnDate, isRoundTrip, fromCoords, toCoords]);

  // ── Missing route & customer fields for fare readiness ─────────────────────
  // Estimated fare will strictly NOT show until the entire form (including Name & Phone) is filled!
  const getMissingRouteFields = useCallback((): string[] => {
    const m: string[] = [];
    if (!fromValue || fromValue.trim().length < 3) m.push('Pickup location');
    if (!isLocal && (!toValue || toValue.trim().length < 3)) m.push('Destination');
    if (!pickupDate) m.push('Pickup date');
    if (!pickupTime) m.push('Pickup time');
    if (isRoundTrip && !returnDate) m.push('Return date');
    if (isLocal && !localPackageId) m.push('Package');
    if (!nameValue || nameValue.trim().length < 2) m.push('Full name');
    const cleanPhone = (phoneValue || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) m.push('Mobile number');
    return m;
  }, [fromValue, isLocal, toValue, pickupDate, pickupTime, isRoundTrip, returnDate, localPackageId, nameValue, phoneValue]);

  const missing = getMissingRouteFields();
  const fallbackDist = (!isLocal ? getDistanceEstimate(fromValue || '', toValue || '') : 0) ?? 0;
  const effectiveDistance = roadDistanceKm ?? (fallbackDist > 0 ? fallbackDist : null);
  const isFareReady = missing.length === 0 && (!isLocal ? Boolean(effectiveDistance) : true);
  const showNudge = missing.length > 0 && ((fromValue?.trim().length || 0) >= 2 || !!toValue || !!nameValue || !!phoneValue);

  // ── Fare Calculation — computes strictly when all required inputs are filled ──
  useEffect(() => {
    setFareEstimate(null);
    if (!isFareReady) return;

    if (isLocal) {
      const vehicle = VEHICLES.find((v) => v.id === vehicleCategory) || VEHICLES[0];
      const pkg = LOCAL_PACKAGES.find((p) => p.id === localPackageId) || LOCAL_PACKAGES[1];
      const group = getLocalPriceGroup(vehicleCategory);
      const price = LOCAL_BASE_PRICES[pkg.key]?.[group] ?? 1480;
      setFareEstimate({
        type: 'local',
        pkg,
        vehicleId: vehicleCategory,
        vehicleName: vehicle.name,
        vehicleImage: vehicle.image,
        vehicleModels: vehicle.models.join(', '),
        seatingCapacity: vehicle.seatingCapacity,
        basePrice: price,
        priceGroup: group,
        estimatedTotal: price,
      });
    } else {
      // Outstation (One-Way or Round-Trip) — uses exact road distance from OSRM
      const dist = roadDistanceKm ?? getDistanceEstimate(fromValue || '', toValue || '');
      if (!dist) return;

      const vehicle = VEHICLES.find((v) => v.id === vehicleCategory) || VEHICLES[0];
      const rates = FARE_RATES[vehicleCategory] || { oneWay: 21, roundTrip: 14, nightHalt: 500 };

      // Rule: Bidirectional Kolkata route exception vs > 200 km
      // If one-way distance > 200 km and not a Kolkata route,
      // cab has to return empty, so fare is charged as round-trip base distance running cost,
      // but customer sees the trip as One-Way.
      const isKolkataRoute = isKolkataLocation(fromValue) || isKolkataLocation(toValue);
      const requiresReturnFare = isOneWay && dist > 200 && !isKolkataRoute;

      const rate = requiresReturnFare ? rates.roundTrip : (isOneWay && rates.oneWay !== null ? rates.oneWay : rates.roundTrip);
      const factor = isRoundTrip || requiresReturnFare ? 2 : 1;
      const baseCharge = Math.round(dist * rate * factor);
      const nights = isRoundTrip ? getNightHaltDays(pickupDate, returnDate) : 0;
      const nightHaltCharge = nights * rates.nightHalt;
      const total = baseCharge + nightHaltCharge;

      setFareEstimate({
        type: 'outstation',
        tripType: isRoundTrip ? 'round-trip' : 'one-way',
        distanceKm: dist,
        durationFormatted: roadDurationText || undefined,
        ratePerKm: rate,
        baseDistanceCharge: baseCharge,
        nightHaltCount: nights,
        nightHaltCharge,
        vehicleId: vehicleCategory,
        vehicleName: vehicle.name,
        vehicleImage: vehicle.image,
        vehicleModels: vehicle.models.join(', '),
        seatingCapacity: vehicle.seatingCapacity,
        estimatedTotal: total,
      });
    }
  }, [isFareReady, isLocal, isOneWay, isRoundTrip, fromValue, toValue, pickupDate, pickupTime, returnDate, vehicleCategory, localPackageId, nameValue, phoneValue, roadDistanceKm, roadDurationText]);

  // ── GPS Geolocation with Reverse Geocoding & Network Fallback for Mobile ──
  const detectGps = useCallback(async () => {
    setGpsLoading(true);
    setGpsError('');

    const fetchReverseAddress = async (lat: number, lng: number): Promise<boolean> => {
      try {
        const res = await fetch(`/api/places/reverse/?lat=${lat}&lng=${lng}`);
        if (res.ok) {
          const data = await res.json();
          if (data.fullAddress) {
            setValue('from', data.fullAddress, { shouldValidate: true });
            setGpsError('');
            return true;
          }
        }
      } catch (err) {
        console.warn('Reverse geocoding error:', err);
      }
      return false;
    };

    const fetchIpFallback = async (): Promise<boolean> => {
      try {
        const res = await fetch('/api/places/live-location/');
        if (res.ok) {
          const data = await res.json();
          if (data.fullAddress) {
            setValue('from', data.fullAddress, { shouldValidate: true });
            return true;
          }
        }
      } catch (err) {
        console.warn('Live location IP fallback error:', err);
      }
      return false;
    };

    const handleSuccess = async (pos: GeolocationPosition) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setFromCoords({ lat, lng });
      const ok = await fetchReverseAddress(lat, lng);
      if (!ok) {
        setValue('from', `Live Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`, { shouldValidate: true });
      }
      setGpsError('');
      setGpsLoading(false);
    };

    const handleGpsError = async (err: GeolocationPositionError) => {
      console.warn('Browser GPS error:', err.code, err.message);

      // Fallback to real network location so the pickup input is not left empty
      const fallbackOk = await fetchIpFallback();

      if (err.code === 1) {
        // PERMISSION_DENIED
        setGpsError(
          fallbackOk
            ? 'Fetched via network location. To use precise phone GPS, please allow location access in your browser (tap 🔒 in address bar).'
            : 'Location permission denied. Please allow location access in your browser settings (tap 🔒 in address bar).'
        );
      } else if (err.code === 2) {
        // POSITION_UNAVAILABLE
        setGpsError(
          fallbackOk
            ? 'Phone GPS unavailable; filled from network location.'
            : 'Phone GPS signal unavailable. Please search or type your location manually.'
        );
      } else if (err.code === 3) {
        // TIMEOUT
        setGpsError(
          fallbackOk
            ? 'GPS request timed out; filled from network location.'
            : 'GPS request timed out. Please try again or type manually.'
        );
      } else {
        setGpsError(fallbackOk ? '' : 'Could not detect GPS location. Please type manually.');
      }
      setGpsLoading(false);
    };

    if (typeof window === 'undefined' || !navigator.geolocation) {
      const fallbackOk = await fetchIpFallback();
      if (!fallbackOk) {
        setGpsError('Geolocation is not supported by your browser. Please type location manually.');
      }
      setGpsLoading(false);
      return;
    }

    // Call device GPS with high accuracy and maximumAge: 0
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      (err) => {
        // If high accuracy timed out or failed, try low accuracy once before falling back
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
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  }, [setValue]);

  const handleSwap = () => {
    const f = fromValue; const t = toValue;
    setValue('from', t || '', { shouldValidate: true });
    setValue('to', f, { shouldValidate: true });
    const fc = fromCoords; const tc = toCoords;
    setFromCoords(tc);
    setToCoords(fc);
  };

  const onSubmit = async (data: BookingFormData) => {
    // Honeypot: a real user never fills this hidden field. Pretend success
    // and skip the network request so bots get no feedback and do not retry.
    if (data.website && data.website.trim().length > 0) {
      setStatus('success');
      return;
    }
    setStatus('loading');
    try {
      const payload = {
        ...data,
        clientDistanceKm: fareEstimate?.type === 'outstation' ? fareEstimate.distanceKm : undefined,
        clientTotalFare: fareEstimate?.estimatedTotal,
        fareEstimate,
      };
      const r = await fetch('/api/booking/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error('failed');
      const res = await r.json();
      setReferenceId(res.referenceId ?? '');
      setStatus('success');
    } catch { setStatus('error'); }
  };

  const handleWhatsApp = () => {
    const data = getValues();
    let fareInfo = '';
    if (fareEstimate) {
      if (fareEstimate.type === 'local') {
        fareInfo = `\n*Local Package:* ${fareEstimate.pkg.label} (${fareEstimate.vehicleName})\n*Package Price:* Rs.${fareEstimate.estimatedTotal}\n*Extra km/hrs:* As applicable at trip end\n*Toll & Parking:* Excluded. Km from garage-to-garage.`;
      } else {
        fareInfo = `\n*Route Distance:* ~${fareEstimate.distanceKm} km\n*Estimated Total Fare:* Rs.${fareEstimate.estimatedTotal}\n*Toll & Parking:* Excluded (as per actuals)`;
      }
    }
    const msg = [
      `*CAB BOOKING - UMA TRAVELS*`,
      `*Pickup:* ${data.from}`,
      !isLocal ? `*Drop:* ${data.to}` : `*Trip:* Local City Rental`,
      `*Type:* ${data.tripType}`,
      `*Date:* ${data.pickupDate} at ${data.pickupTime}`,
      isRoundTrip && data.returnDate ? `*Return:* ${data.returnDate}` : '',
      `*Vehicle:* ${data.vehicleCategory}`,
      `*Name:* ${data.name}`,
      `*Mobile:* ${data.countryCode} ${data.phone}`,
      fareInfo,
      `\n_Confirm availability please._`
    ].filter(Boolean).join('\n');
    window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  // ── Mobile 3-step wizard navigation ──────────────────────────────────────────
  const MOBILE_STEPS = [
    { title: 'Trip', hint: 'Route & schedule' },
    { title: 'Vehicle', hint: 'Car & package' },
    { title: 'Confirm', hint: 'Your details' },
  ];
  const fieldsForStep = (step: number): (keyof BookingFormData)[] => {
    if (step === 1) {
      const base: (keyof BookingFormData)[] = isLocal
        ? ['from', 'pickupDate', 'pickupTime']
        : ['from', 'to', 'pickupDate', 'pickupTime'];
      if (isRoundTrip) base.push('returnDate');
      return base;
    }
    if (step === 2) {
      return isLocal ? ['vehicleCategory', 'localPackageId'] : ['vehicleCategory'];
    }
    return [];
  };
  const scrollFormTop = () => {
    requestAnimationFrame(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const goToStep = (n: number) => {
    if (n < 1 || n > 3) return;
    if (n > mobileStep && n > maxStep) return;
    setMobileStep(n);
    scrollFormTop();
  };
  const goBack = () => {
    if (mobileStep > 1) {
      setMobileStep((s) => s - 1);
      scrollFormTop();
    }
  };
  const goNext = async () => {
    if (mobileStep === 1) {
      let hasError = false;
      const from = (getValues('from') || '').trim();
      const to = (getValues('to') || '').trim();
      const pDate = getValues('pickupDate');
      const pTime = getValues('pickupTime');
      const rDate = getValues('returnDate');

      if (!from || from.length < 2) {
        setError('from', { type: 'manual', message: 'Please enter a pickup location' });
        hasError = true;
      } else {
        clearErrors('from');
      }

      if (!isLocal && (!to || to.length < 2)) {
        setError('to', { type: 'manual', message: 'Please enter a drop location' });
        hasError = true;
      } else {
        clearErrors('to');
      }

      if (!pDate) {
        setError('pickupDate', { type: 'manual', message: 'Please select a pickup date' });
        hasError = true;
      } else {
        clearErrors('pickupDate');
      }

      if (!pTime) {
        setError('pickupTime', { type: 'manual', message: 'Please select a pickup time' });
        hasError = true;
      } else {
        clearErrors('pickupTime');
      }

      if (isRoundTrip && !rDate) {
        setError('returnDate', { type: 'manual', message: 'Return date is required for round-trip' });
        hasError = true;
      } else if (isRoundTrip) {
        clearErrors('returnDate');
      }

      if (hasError) return;
    } else if (mobileStep === 2) {
      const ok = await trigger(fieldsForStep(2) as unknown as Parameters<typeof trigger>[0]);
      if (!ok) return;
    }

    const next = Math.min(3, mobileStep + 1);
    setMaxStep((m) => Math.max(m, next));
    setMobileStep(next);
    scrollFormTop();
  };

  if (status === 'success') return (
    <div className="text-center py-8 px-5 animate-in fade-in zoom-in-95">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 bg-emerald-500/15 border-2 border-emerald-500/35 text-emerald-600"><CheckCircle size={30} /></div>
      <h3 className="text-lg font-black text-slate-900 mb-1.5">Booking Submitted Successfully!</h3>
      <p className="text-slate-500 mb-5 max-w-xs mx-auto text-xs">Our team will call you shortly with driver details.</p>
      <div className="flex gap-2.5 justify-center">
        <button className="btn-secondary text-xs !py-2 !px-3" onClick={() => { setStatus('idle'); setMobileStep(1); setMaxStep(1); }}>Book Another</button>
        <button className="btn-whatsapp text-xs !py-2 !px-3" onClick={handleWhatsApp}><MessageCircle size={13} /> WhatsApp</button>
      </div>

      {SITE_CONFIG.googleReviewUrl && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 font-medium mb-2">
            Enjoyed our service or travelled with us before?
          </p>
          <a
            href={SITE_CONFIG.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-900 text-xs font-bold transition-all shadow-2xs"
          >
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>Rate us on Google (5★)</span>
            <ArrowRight size={11} />
          </a>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Map Picker Modal */}
      <MapPickerLeaflet
        isOpen={mapPickerFor !== null}
        title={mapPickerFor === 'from' ? 'Select Pickup Location' : 'Select Drop Location'}
        onClose={() => setMapPickerFor(null)}
        onSelect={(name, lat, lng) => {
          if (mapPickerFor === 'from') {
            setValue('from', name, { shouldValidate: true });
            if (lat && lng) setFromCoords({ lat, lng });
          } else {
            setValue('to', name, { shouldValidate: true });
            if (lat && lng) setToCoords({ lat, lng });
          }
          setMapPickerFor(null);
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate id="booking" aria-label="Cab booking form" className="relative">
        {/* Mobile Step Progress Indicator */}
        <div ref={formTopRef} className="md:hidden mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
              Step {mobileStep} of 3
            </span>
            <span className="text-[11px] font-bold text-slate-800">
              {MOBILE_STEPS[mobileStep - 1]?.title}: {MOBILE_STEPS[mobileStep - 1]?.hint}
            </span>
          </div>
          <div className="flex gap-1.5">
            {MOBILE_STEPS.map((s, i) => {
              const n = i + 1;
              const active = n === mobileStep;
              const reached = n <= maxStep;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => goToStep(n)}
                  disabled={!reached && !active}
                  className={`flex-1 h-1.5 rounded-full transition-all focus:outline-none ${
                    active ? 'bg-amber-500' : reached ? 'bg-amber-300 cursor-pointer' : 'bg-slate-200 cursor-not-allowed'
                  }`}
                  aria-label={`Go to ${s.title}`}
                />
              );
            })}
          </div>
        </div>

        <div className={compact ? 'flex flex-col gap-2' : 'flex flex-col gap-2.5'}>

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: RIDE DETAILS & SCHEDULE (Mobile Step 1 | Desktop Normal)
          ═══════════════════════════════════════════════════════════════ */}
          <div className={`${stepVis(1, 'flex flex-col gap-2')} md:contents`}>
            {/* 1. Journey Type */}
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] sm:text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-500 shrink-0" /> Journey Type
                </span>
                <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${isLocal ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : isRoundTrip ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {isRoundTrip ? 'Round Trip' : isLocal ? 'City Packages' : 'One Way'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl sm:rounded-2xl">
                {[
                  { value: 'one-way', label: 'One-Way', sub: 'Point-to-Point', icon: Navigation, color: 'amber' },
                  { value: 'round-trip', label: 'Round-Trip', sub: 'Return Journey', icon: ArrowLeftRight, color: 'blue' },
                  { value: 'local', label: 'Local City', sub: 'Hourly Rental', icon: Building2, color: 'emerald' },
                ].map(({ value, label, sub, icon: Icon, color }) => {
                  const active = tripType === value;
                  const colors: Record<string, string> = {
                    amber: 'ring-amber-400/30 border-amber-300 text-amber-600',
                    blue: 'ring-blue-400/30 border-blue-300 text-blue-600',
                    emerald: 'ring-emerald-400/30 border-emerald-300 text-emerald-600',
                  };
                  return (
                    <label key={value} className={`flex flex-col items-center py-1 sm:py-1.5 px-1 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all select-none ${active ? `bg-white shadow-2xs ring-2 ${colors[color]}` : 'border-transparent hover:bg-white/60'}`}>
                      <input type="radio" value={value} {...register('tripType')} className="sr-only" />
                      <Icon size={12} className={active ? colors[color].split(' ')[2] : 'text-slate-400'} />
                      <span className={`font-black text-[10px] sm:text-xs mt-0.5 ${active ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
                      <span className={`text-[9px] font-bold ${active ? colors[color].split(' ')[2] : 'text-slate-400'}`}>{sub}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Pickup & Drop Locations */}
            <div>
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs">
                <div className="flex items-start gap-1.5">
                  <div className="pt-5 shrink-0 flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shadow-2xs" />
                    {!isLocal && <span className="w-px h-6 border-l-2 border-dashed border-slate-300 my-1" />}
                  </div>
                  <LocationInput id="from" label="Pickup Location" value={fromValue} iconColor="text-emerald-600"
                    onChange={(v) => setValue('from', v, { shouldValidate: true })}
                    onSelectCoords={(c) => setFromCoords(c)}
                    onGps={detectGps} gpsLoading={gpsLoading}
                    onSwap={!isLocal ? handleSwap : undefined}
                    onMapPick={() => setMapPickerFor('from')}
                    error={errors.from?.message}
                    placeholder={isLocal ? 'Your city for local rental' : 'City, station, airport...'} />
                </div>
                {!isLocal && (
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <div className="pt-5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100 shadow-2xs block" />
                    </div>
                    <LocationInput id="to" label="Drop Location" value={toValue || ''} iconColor="text-amber-600"
                      onChange={(v) => setValue('to', v, { shouldValidate: true })}
                      onSelectCoords={(c) => setToCoords(c)}
                      onMapPick={() => setMapPickerFor('to')}
                      error={errors.to?.message}
                      placeholder="Destination city, landmark..." />
                  </div>
                )}
                {!isLocal && (roadDistanceKm || isRoutingLoading) && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Navigation size={11} className="text-amber-600 shrink-0" />
                      {isRoutingLoading ? (
                        <span className="flex items-center gap-1 text-slate-500 font-normal">
                          <Loader2 size={10} className="animate-spin text-amber-500" /> Calculating highway road distance...
                        </span>
                      ) : (
                        <span>
                          Road Distance: <strong className="text-slate-900 font-black">~{roadDistanceKm} km</strong>
                          {roadDurationText ? <span className="text-slate-500 font-medium"> ({roadDurationText})</span> : null}
                        </span>
                      )}
                    </span>
                    {!isRoutingLoading && roadDistanceKm && (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
                        Real Highway
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {gpsError && (
              <p className="text-[10px] text-red-600 font-medium flex items-start gap-1 px-1">
                <AlertCircle size={10} className="shrink-0 mt-0.5" />{gpsError}
              </p>
            )}

            {/* 3. Pickup Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl sm:rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <label htmlFor="pickupDate" className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <Calendar size={11} className="text-amber-500 shrink-0" />Date
                  </label>
                  <div className="flex gap-1 shrink-0">
                    <button type="button" onClick={() => setValue('pickupDate', getLocalDateISO(), { shouldValidate: true })} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 border border-amber-400/25 cursor-pointer hover:bg-amber-500/25 transition">Today</button>
                    <button type="button" onClick={() => setValue('pickupDate', getLocalDateISO(1), { shouldValidate: true })} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-200 transition">Tmrw</button>
                  </div>
                </div>
                <input id="pickupDate" type="date" min={minDate} className={`form-input !min-h-[36px] sm:!min-h-[40px] !py-1 !px-2.5 text-xs shadow-2xs bg-white/90 font-medium ${errors.pickupDate ? 'border-red-400' : ''}`} {...register('pickupDate')} />
                {errors.pickupDate && <p className="text-[10px] text-red-600 font-bold mt-0.5">{errors.pickupDate.message}</p>}
              </div>
              <div className="p-2 rounded-xl sm:rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs">
                <label htmlFor="pickupTime" className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-1">
                  <Clock size={11} className="text-blue-500 shrink-0" />Time
                </label>
                <input id="pickupTime" type="time" className={`form-input !min-h-[36px] sm:!min-h-[40px] !py-1 !px-2.5 text-xs shadow-2xs bg-white/90 font-medium ${errors.pickupTime ? 'border-red-400' : ''}`} {...register('pickupTime')} />
                {errors.pickupTime && <p className="text-[10px] text-red-600 font-bold mt-0.5">{errors.pickupTime.message}</p>}
              </div>
            </div>

            {/* 4. Return Schedule (Round-Trip only) */}
            {isRoundTrip && (
              <div className="p-2 rounded-xl sm:rounded-2xl bg-blue-50/80 border border-blue-200/60 shadow-2xs">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1">
                    <RotateCcw size={10} className="text-blue-600 shrink-0" /> Return Schedule
                  </span>
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full">Cab stays with you</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input id="returnDate" type="date" min={pickupDate || minDate} className={`form-input !min-h-[36px] sm:!min-h-[40px] !py-1 !px-2.5 text-xs shadow-2xs bg-white font-medium ${errors.returnDate ? 'border-red-400' : ''}`} {...register('returnDate')} />
                    {errors.returnDate && <p className="text-[10px] text-red-600 font-bold mt-0.5">{errors.returnDate.message}</p>}
                  </div>
                  <div>
                    <input id="returnTime" type="time" className="form-input !min-h-[36px] sm:!min-h-[40px] !py-1 !px-2.5 text-xs shadow-2xs bg-white font-medium" {...register('returnTime')} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 Mobile Action Button */}
            <div className="md:hidden pt-0.5">
              <button
                type="button"
                onClick={goNext}
                className="btn-primary w-full justify-center !py-2.5 text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Continue: Choose Car</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              STEP 2: VEHICLE & PASSENGERS (Mobile Step 2 | Desktop Normal)
          ═══════════════════════════════════════════════════════════════ */}
          <div className={`${stepVis(2, 'flex flex-col gap-2')} md:contents`}>
            {/* Mobile Back / Subheader */}
            <div className="md:hidden flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                <ChevronLeft size={13} /> Back to Route
              </button>
              <span className="text-[11px] font-bold text-slate-500">
                Step 2: Select Car
              </span>
            </div>

            {/* Vehicle Selection */}
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <label htmlFor="vehicleCategory" className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Car size={12} className="text-amber-500 shrink-0" /> Select Vehicle
                </label>
                <span className="text-[9px] sm:text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                  {fareEstimate ? `₹${fareEstimate.estimatedTotal.toLocaleString('en-IN')} Estimated` : 'Fleet Selection'}
                </span>
              </div>
              <div className={`grid gap-1.5 ${isOneWay ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {visibleVehicles.map((v) => {
                  const active = vehicleCategory === v.id;
                  const group = getLocalPriceGroup(v.id);
                  const localPrice = LOCAL_BASE_PRICES['8hr']?.[group];
                  return (
                    <label key={v.id}
                      className={`flex flex-col items-center p-1.5 rounded-xl border-2 cursor-pointer transition-all select-none text-center ${active ? 'border-amber-400 bg-amber-50 shadow-2xs ring-2 ring-amber-400/20 scale-[1.01]' : 'border-slate-200 bg-white hover:border-amber-300'}`}>
                      <input type="radio" value={v.id} {...register('vehicleCategory')} className="sr-only" />
                      <div className="relative w-12 h-7 sm:w-16 sm:h-9 mb-1">
                        <Image src={v.image} alt={v.name} fill sizes="64px" className="object-contain" />
                      </div>
                      <span className={`text-[10px] sm:text-[11px] font-black leading-tight ${active ? 'text-amber-800' : 'text-slate-700'}`}>{v.name}</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold mt-0.5">{v.seatingCapacity} Seater AC</span>
                      {isLocal && localPrice && (
                        <span className={`text-[9px] sm:text-[10px] font-black mt-0.5 ${active ? 'text-amber-700' : 'text-slate-500'}`}>
                          from ₹{localPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Local Packages (if Local) */}
            {isLocal && (
              <div className="p-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/60 shadow-2xs">
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1">
                    <Package size={12} className="text-emerald-600 shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-black text-emerald-900 uppercase tracking-wider">Choose Package</span>
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
                    {priceGroup === 'sedan' ? 'Sedan' : priceGroup === 'ertiga' ? 'Ertiga' : priceGroup === 'tempo' ? 'Tempo' : 'Innova'} Rates
                  </span>
                </div>
                <div className={`grid gap-1.5 ${vehicleCategory === 'sedan' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {availableLocalPackages.map((pkg) => {
                    const price = getLocalPackagePrice(vehicleCategory, pkg.key);
                    const active = localPackageId === pkg.id;
                    return (
                      <label key={pkg.id}
                        className={`flex flex-col items-center p-1.5 rounded-xl border-2 cursor-pointer transition-all select-none text-center ${active ? 'border-emerald-500 bg-emerald-500/10 shadow-2xs ring-2 ring-emerald-400/20 scale-[1.01]' : 'border-slate-200 bg-white hover:border-emerald-300'}`}>
                        <input type="radio" value={pkg.id} {...register('localPackageId')} className="sr-only" />
                        <span className={`text-[10px] font-black ${active ? 'text-emerald-800' : 'text-slate-700'}`}>{pkg.hrs} Hrs • {pkg.km} Km</span>
                        <span className={`text-[11px] font-black mt-0.5 ${active ? 'text-emerald-700' : 'text-slate-800'}`}>
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2 Mobile Action Buttons */}
            <div className="md:hidden flex gap-2 pt-0.5">
              <button
                type="button"
                onClick={goBack}
                className="btn-secondary !py-2.5 px-3 text-xs font-bold cursor-pointer"
              >
                <ChevronLeft size={13} /> Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="btn-primary flex-1 justify-center !py-2.5 text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Continue: Your Details</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              STEP 3: CONTACT & CONFIRMATION (Mobile Step 3 | Desktop Normal)
          ═══════════════════════════════════════════════════════════════ */}
          <div className={`${stepVis(3, 'flex flex-col gap-2')} md:contents`}>
            {/* Mobile Back / Subheader */}
            <div className="md:hidden flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                <ChevronLeft size={13} /> Change Car
              </button>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Final Step
              </span>
            </div>

            {/* Ride Summary Chip (Mobile only) */}
            <div className="md:hidden p-2 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <p className="font-black text-slate-900 text-xs truncate">
                  {fromValue || 'Pickup'} {isLocal ? '(Local Rental)' : `→ ${toValue || 'Drop'}`}
                </p>
                <p className="text-[10px] text-slate-600 font-medium truncate">
                  {selectedVehicle.name} • {pickupDate || 'Date'} at {pickupTime || 'Time'}
                </p>
              </div>
              {fareEstimate ? (
                <span className="text-[10px] font-black text-amber-800 bg-white px-2 py-1 rounded-md border border-amber-200 shadow-2xs shrink-0">
                  ₹{fareEstimate.estimatedTotal.toLocaleString('en-IN')}
                </span>
              ) : null}
            </div>

            {/* Contact Details (Full Name & Phone) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs">
                <label htmlFor="name" className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-1">
                  <User size={11} className="text-amber-500" />Full Name
                </label>
                <input id="name" type="text" placeholder="e.g. Rajesh Kumar" className={`form-input !min-h-[36px] sm:!min-h-[40px] !py-1 !px-2.5 text-xs sm:text-sm shadow-2xs bg-white/90 font-medium ${errors.name ? 'border-red-400' : ''}`} {...register('name')} autoComplete="name" />
                {errors.name && <p className="text-[10px] text-red-600 font-bold mt-0.5">{errors.name.message}</p>}
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs">
                <label htmlFor="phone" className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-1">
                  <Phone size={11} className="text-emerald-500" />Mobile / WhatsApp
                </label>
                <div className={`flex items-center rounded-xl border bg-white/95 transition-all !min-h-[36px] sm:!min-h-[40px] ${errors.phone ? 'border-red-400' : 'border-slate-200 focus-within:border-amber-500'}`}>
                  <div className="relative shrink-0 flex items-center border-r border-slate-200">
                    <select className="h-8 sm:h-9 pl-1.5 pr-4 bg-transparent text-xs font-black text-slate-800 appearance-none cursor-pointer focus:outline-none" {...register('countryCode')}>
                      {COUNTRY_CODES.map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.code}</option>))}
                    </select>
                    <ChevronDown size={10} className="text-slate-400 pointer-events-none absolute right-1" />
                  </div>
                  <input id="phone" type="tel" placeholder={watch('countryCode') === '+91' ? '98765 43210' : 'Mobile number'}
                    className="w-full h-8 sm:h-9 px-2 bg-transparent text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register('phone')} autoComplete="tel-national" maxLength={watch('countryCode') === '+91' ? 10 : 15} />
                </div>
                {errors.phone && <p className="text-[10px] text-red-600 font-bold mt-0.5">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Fare Estimate Panels */}
            {isLocal && fareEstimate && fareEstimate.type === 'local' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                <LocalPanel e={fareEstimate} />
              </div>
            )}
            {!isLocal && fareEstimate && fareEstimate.type === 'outstation' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                <OutstationPanel e={fareEstimate} />
              </div>
            )}
            {!fareEstimate && showNudge && (
              <div className="rounded-2xl p-2.5 border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                <Car size={16} className="text-slate-300 mx-auto mb-1" />
                <p className="text-[11px] text-slate-500 font-semibold mb-1">Fill all required journey details to calculate estimated price:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {missing.map((f) => (<span key={f} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-400/30">{f}</span>))}
                </div>
              </div>
            )}

            {/* Honeypot anti-spam field */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] top-0 h-0 w-0 opacity-0 pointer-events-none"
              {...register('website')}
            />

            {/* Action Buttons: Confirm & Book Cab + WhatsApp */}
            <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
              <button type="submit" disabled={status === 'loading'}
                className="btn-primary flex-1 justify-center !py-2.5 sm:!py-3 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer">
                {status === 'loading' ? (
                  <><Loader2 size={15} className="animate-spin" /><span>Submitting...</span></>
                ) : (
                  <><span>Confirm &amp; Book Cab{fareEstimate ? ` (₹${fareEstimate.estimatedTotal.toLocaleString('en-IN')})` : ''}</span><ArrowRight size={14} /></>
                )}
              </button>
              <button type="button" onClick={handleWhatsApp}
                className="btn-whatsapp justify-center !py-2.5 sm:!py-3 text-xs sm:text-sm font-extrabold cursor-pointer">
                <MessageCircle size={15} /><span>WhatsApp</span>
              </button>
            </div>

            {/* Trust bar */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-5 text-[10px] text-slate-500 flex-wrap font-semibold pt-0.5">
              <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-emerald-600" />Verified Drivers</span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1"><Star size={11} className="text-amber-500" />{SITE_CONFIG.rating}★ Rated</span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1"><CheckCircle size={11} className="text-emerald-600" />Zero Advance</span>
            </div>

            {status === 'error' && (
              <div role="alert" className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                Submission failed. Please WhatsApp us or call +91 {SITE_CONFIG.phone}.
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

