"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  MessageCircle,
  Navigation,
  Users,
} from "lucide-react";
import {
  COVERAGE_AREAS,
  MAIN_HUBS,
  TUTOR_LOCATIONS,
  type CoverageArea,
} from "@/data/coverage";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface Props {
  selectedAreaId: string | null;
  onSelectArea: (areaId: string | null) => void;
  userCoords: { lat: number; lng: number } | null;
  onSetUserCoords: (coords: { lat: number; lng: number } | null, addressName?: string) => void;
  customAddressName?: string;
}

// Haversine formula
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function CoverageLocationChecker({
  selectedAreaId,
  onSelectArea,
  userCoords,
  onSetUserCoords,
  customAddressName,
}: Props) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const hubPusat = MAIN_HUBS[0];

  // Distance calculation if user has pinpointed or used GPS
  const distanceKm = useMemo(() => {
    if (!userCoords) return null;
    return getDistanceKm(userCoords.lat, userCoords.lng, hubPusat.lat, hubPusat.lng);
  }, [userCoords, hubPusat]);

  // Selected area object
  const activeArea = useMemo(() => {
    if (selectedAreaId) {
      return COVERAGE_AREAS.find((a) => a.id === selectedAreaId) || null;
    }
    // If user pinpointed, find nearest area
    if (userCoords) {
      let nearest: CoverageArea | null = null;
      let minDistance = Infinity;
      COVERAGE_AREAS.forEach((area) => {
        const d = getDistanceKm(userCoords.lat, userCoords.lng, area.lat, area.lng);
        if (d < minDistance) {
          minDistance = d;
          nearest = area;
        }
      });
      return nearest;
    }
    return null;
  }, [selectedAreaId, userCoords]);

  // Tutors assigned to this area
  const activeTutors = useMemo(() => {
    if (!activeArea) return TUTOR_LOCATIONS;
    return TUTOR_LOCATIONS.filter((tutor) =>
      activeArea.tutors.some((tName) => tutor.nickname.toLowerCase().includes(tName.toLowerCase()) || tName.toLowerCase().includes(tutor.nickname.toLowerCase()))
    );
  }, [activeArea]);

  // Handle GPS location click
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Browser kamu belum mendukung deteksi lokasi otomatis.");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const { latitude, longitude } = position.coords;
        onSetUserCoords({ lat: latitude, lng: longitude }, "Lokasi Saya (GPS)");

        // Find closest area
        let closestArea: CoverageArea | null = null;
        let shortestDist = Infinity;
        COVERAGE_AREAS.forEach((area) => {
          const dist = getDistanceKm(latitude, longitude, area.lat, area.lng);
          if (dist < shortestDist) {
            shortestDist = dist;
            closestArea = area;
          }
        });

        if (closestArea) {
          onSelectArea((closestArea as CoverageArea).id);
        }
      },
      (error) => {
        setGeoLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError("Izin akses lokasi ditolak. Silakan pilih kecamatan secara manual dari daftar.");
        } else {
          setGeoError("Gagal mendeteksi lokasi. Silakan pilih kecamatan secara manual.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Construct WhatsApp direct message
  const waRegistrationUrl = useMemo(() => {
    const areaName = activeArea?.name || customAddressName || "Cilacap";
    const distText = distanceKm ? ` (jarak perkiraan: ~${distanceKm} km dari Hub Pusat)` : "";
    const text = [
      "Halo *nCourse* 👋",
      "Saya ingin tanya ketersediaan tentor les privat untuk lokasi saya:",
      `📍 *Area/Alamat:* ${areaName}${distText}`,
      "",
      "Apakah saat ini ada jadwal tentor yang bisa datang ke rumah saya?",
      "Terima kasih 🙏",
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [activeArea, customAddressName, distanceKm]);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border-2 border-[#d9d2c2] bg-[#fffdf9] p-5 shadow-[0_12px_28px_-16px_rgba(27,48,77,0.18)] sm:p-6">
      {/* Title & Badge */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#4a70a9]/30 bg-[#eaf0f9] px-3 py-0.5 font-mono text-xs font-bold text-[#2e4b7a]">
          <Compass className="h-3.5 w-3.5 text-[#4a70a9]" />
          Cek Jangkauan Mandiri
        </div>
        <h3 className="mt-2 font-display text-xl font-black text-[#14233a] sm:text-2xl">
          Cek Lokasi Rumah Anda
        </h3>
        <p className="mt-1 text-xs text-[#50647a] sm:text-sm">
          Pilih kecamatan atau gunakan titik GPS untuk melihat status layanan tentor datang ke rumah.
        </p>
      </div>

      {/* Select Subdistrict Dropdown */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#50647a]">
          Pilih Kecamatan / Kelurahan
        </label>
        <select
          value={selectedAreaId || ""}
          onChange={(e) => {
            const val = e.target.value;
            onSelectArea(val || null);
            if (val) {
              const matched = COVERAGE_AREAS.find((a) => a.id === val);
              if (matched) {
                onSetUserCoords({ lat: matched.lat, lng: matched.lng }, matched.name);
              }
            }
          }}
          className="w-full rounded-xl border-2 border-[#d9d2c2] bg-[#f7f5ef] px-3.5 py-3 text-sm font-bold text-[#14233a] shadow-inner transition focus:border-[#4a70a9] focus:bg-white focus:outline-hidden"
        >
          <option value="">-- Pilih Wilayah / Kecamatan --</option>
          <optgroup label="Zona 1 — Cilacap Kota (Gratis Transport)">
            {COVERAGE_AREAS.filter((a) => a.zone === 1).map((area) => (
              <option key={area.id} value={area.id}>
                📍 {area.name} (Kelurahan: {area.subdistricts.slice(0, 3).join(", ")}...)
              </option>
            ))}
          </optgroup>
          <optgroup label="Zona 2 — Wilayah Sekitar Cilacap">
            {COVERAGE_AREAS.filter((a) => a.zone === 2).map((area) => (
              <option key={area.id} value={area.id}>
                🚗 {area.name} (Desa/Kel: {area.subdistricts.slice(0, 3).join(", ")}...)
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* GPS Button */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={geoLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#d9d2c2] bg-[#f7f5ef] py-2.5 text-xs font-extrabold text-[#2e4b7a] transition-all hover:border-[#4a70a9] hover:bg-white hover:shadow-xs active:translate-y-0.5"
        >
          <Navigation className={`h-4 w-4 ${geoLoading ? "animate-spin text-[#4a70a9]" : "text-[#4a70a9]"}`} />
          {geoLoading ? "Mendeteksi Lokasi GPS..." : "Gunakan Titik GPS Rumah Saya"}
        </button>

        {geoError && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{geoError}</span>
          </div>
        )}
      </div>

      {/* Coverage Result Card */}
      {activeArea ? (
        <div className="space-y-4 rounded-xl border-2 border-[#b5cce6] bg-[#f0f5fc] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.7rem] font-black uppercase tracking-wider ${
                  activeArea.zone === 1
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
                {activeArea.zone === 1 ? "Tercover Zona Inti" : "Tercover Zona Reguler"}
              </span>
              <h4 className="mt-1 font-display text-lg font-bold text-[#14233a]">
                {activeArea.name}
              </h4>
            </div>

            {distanceKm !== null && (
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#4a70a9]">
                  ~{distanceKm} km
                </span>
                <span className="block text-[0.65rem] text-[#627894]">dari Hub Pusat</span>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white p-2.5 border border-[#d9e2ec]">
              <span className="text-[0.7rem] font-semibold text-[#627894] block">Biaya Transport</span>
              <span className="font-extrabold text-[#14233a]">
                {activeArea.transportFee === 0 ? "Gratis (Rp 0)" : `Rp ${activeArea.transportFee.toLocaleString("id-ID")}`}
              </span>
            </div>
            <div className="rounded-lg bg-white p-2.5 border border-[#d9e2ec]">
              <span className="text-[0.7rem] font-semibold text-[#627894] block">Estimasi Tiba</span>
              <span className="font-extrabold text-[#14233a] flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#4a70a9]" />
                {activeArea.estimatedTravelTime}
              </span>
            </div>
          </div>

          {/* Kelurahan included */}
          <div>
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#50647a] block mb-1">
              Kelurahan / Desa Tercakup:
            </span>
            <div className="flex flex-wrap gap-1">
              {activeArea.subdistricts.map((sub) => (
                <span
                  key={sub}
                  className="rounded-md bg-white px-2 py-0.5 text-[0.7rem] font-semibold text-[#203652] border border-[#d9e2ec]"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Standby Tutors */}
          <div>
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#50647a] block mb-1.5 flex items-center gap-1">
              <Users className="h-3 w-3 text-[#4a70a9]" />
              Tentor Standby di Area Ini:
            </span>
            <div className="flex flex-col gap-1.5">
              {activeTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex items-center justify-between rounded-lg bg-white p-2 border border-[#d9e2ec]"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[#2e4b7a] text-white flex items-center justify-center font-bold text-xs">
                      {tutor.nickname.slice(4, 5)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#14233a] block leading-tight">
                        {tutor.nickname}
                      </span>
                      <span className="text-[0.68rem] text-[#627894] block leading-tight">
                        {tutor.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-[0.65rem] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Action */}
          <div className="pt-2">
            <a
              href={waRegistrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#166534] bg-[#22c55e] py-3 text-sm font-extrabold text-white shadow-[0_4px_0_#15803d] transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="h-4 w-4" />
              Daftar Les untuk Area Ini
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-1.5 text-center text-[0.68rem] text-[#627894]">
              Format pesan otomatis terisi sesuai area yang kamu pilih.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-[#d9d2c2] bg-[#f7f5ef] p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-[#8da3bd] animate-bounce" />
          <h4 className="mt-2 font-display text-sm font-bold text-[#14233a]">
            Belum Ada Wilayah Terpilih
          </h4>
          <p className="mt-1 text-xs text-[#627894]">
            Pilih salah satu kecamatan di atas, klik marker di peta, atau ketuk tombol GPS untuk memeriksa jangkauan.
          </p>
        </div>
      )}
    </div>
  );
}
