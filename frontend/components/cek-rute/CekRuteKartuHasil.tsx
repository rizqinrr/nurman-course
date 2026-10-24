"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  Clock,
  Edit3,
  Info,
  MapPin,
  MessageCircle,
  Navigation,
  Receipt,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  RUTE_CONFIG,
  formatDurasi,
  formatJarak,
  formatRupiah,
  getRincianBiaya,
} from "@/lib/rute-biaya";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { LatLng } from "@/lib/ors-client";

interface Props {
  lokasiUser: LatLng & { alamat?: string };
  jarakKm: number;
  durasiDetik: number;
  biaya: number;
  onUbahLokasi: () => void;
  onReset: () => void;
}

export default function CekRuteKartuHasil({
  lokasiUser,
  jarakKm,
  durasiDetik,
  biaya,
  onUbahLokasi,
  onReset,
}: Props) {
  const isLuarArea = jarakKm > RUTE_CONFIG.JARAK_MAKSIMAL_KM;
  const rincian = useMemo(() => getRincianBiaya(jarakKm), [jarakKm]);

  // Pesan WhatsApp otomatis untuk pendaftaran les
  const waUrl = useMemo(() => {
    const alamatText = lokasiUser.alamat || `${lokasiUser.lat.toFixed(5)}, ${lokasiUser.lng.toFixed(5)}`;
    const textLines = [
      "Halo *nCourse* 👋",
      "Saya ingin daftar les privat dengan rincian titik lokasi saya:",
      "",
      `📍 *Titik Lokasi:* ${alamatText}`,
      `🚗 *Jarak Tempuh Rute:* ${formatJarak(jarakKm)}`,
      `⏱️ *Estimasi Waktu Tiba:* ${formatDurasi(durasiDetik)}`,
      ...(isLuarArea
        ? ["🌐 *Kategori Layanan:* Sesi Bimbingan Online (1-on-1)"]
        : [`💰 *Estimasi Biaya Transport:* ${formatRupiah(biaya)} / kunjungan`]),
      "",
      "Mohon informasi ketersediaan jadwal tentor. Terima kasih 🙏",
    ];

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textLines.join("\n"))}`;
  }, [lokasiUser, jarakKm, durasiDetik, biaya, isLuarArea]);

  return (
    <div
      className="fixed inset-x-0 bottom-0 md:inset-auto md:top-4 md:left-4 z-30
                 w-full md:w-[410px] max-h-[85vh] md:max-h-[calc(100vh-2rem)]
                 bg-[#fffdf9] rounded-t-3xl md:rounded-2xl shadow-[0_16px_36px_rgba(27,48,77,0.25)] border-2 border-[#d9d2c2]
                 flex flex-col overflow-hidden transition-all duration-300"
    >
      {/* Header Kartu */}
      <div className="p-4 sm:p-5 border-b-2 border-[#e6dfd1] bg-[#f7f5ef] flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#eaf0f9] text-[#2e4b7a] border border-[#4a70a9]/30">
            <Sparkles className="h-3 w-3 text-[#4a70a9]" />
            Hasil Perhitungan Rute
          </span>
          <h3 className="font-display text-base font-extrabold text-[#14233a] mt-1">
            Estimasi Kunjungan Les
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold text-[#627894] hover:text-[#14233a] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#eae4d3] transition"
          title="Reset ke awal"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Konten Utama */}
      <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
        {/* Alamat Titik User */}
        <div className="rounded-xl bg-[#f7f5ef] p-3.5 border-2 border-[#e6dfd1]">
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[11px] font-bold text-[#627894] uppercase tracking-wider">
                Titik Rumah Anda
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#14233a] leading-snug mt-0.5">
                {lokasiUser.alamat || `${lokasiUser.lat.toFixed(5)}, ${lokasiUser.lng.toFixed(5)}`}
              </p>
              <p className="font-mono text-[10px] text-[#8da3bd] mt-1">
                Koordinat: {lokasiUser.lat.toFixed(5)}, {lokasiUser.lng.toFixed(5)}
              </p>
            </div>
          </div>
        </div>

        {/* Kondisi Jarak > 15 KM */}
        {isLuarArea ? (
          <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-900 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <h4 className="font-bold text-sm">Lokasi di luar area layanan tatap muka</h4>
            </div>
            <p className="text-xs leading-relaxed text-amber-800">
              Jarak tempuh rute menuju rumah Anda adalah <strong>{formatJarak(jarakKm)}</strong>, melebihi batas maksimal layanan les tatap muka kami (<strong>{RUTE_CONFIG.JARAK_MAKSIMAL_KM} km</strong>).
            </p>
            <div className="rounded-lg bg-white/80 p-2.5 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Untuk lokasi ini, Anda dapat memilih bimbingan belajar secara <strong>Online (1-on-1)</strong>.</span>
            </div>
          </div>
        ) : (
          /* Kondisi Normal */
          <>
            {/* Metrik Jarak & Durasi */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#eaf0f9] p-3.5 border border-[#4a70a9]/30">
                <div className="flex items-center gap-1.5 text-[#2e4b7a] text-xs font-bold">
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Jarak Tempuh</span>
                </div>
                <div className="mt-1 font-extrabold text-xl text-[#14233a] font-mono">
                  {formatJarak(jarakKm)}
                </div>
                <span className="text-[10px] text-[#627894]">Rute jalan darat (ORS)</span>
              </div>

              <div className="rounded-xl bg-[#eaf0f9] p-3.5 border border-[#4a70a9]/30">
                <div className="flex items-center gap-1.5 text-[#2e4b7a] text-xs font-bold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Estimasi Tiba</span>
                </div>
                <div className="mt-1 font-extrabold text-xl text-[#14233a] font-mono">
                  {formatDurasi(durasiDetik)}
                </div>
                <span className="text-[10px] text-[#627894]">Lalu lintas normal</span>
              </div>
            </div>

            {/* Kotak Estimasi Biaya */}
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-[#ecfdf5] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <Receipt className="h-4 w-4 text-emerald-700" />
                  Estimasi Biaya Transport
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Per Kunjungan
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-extrabold text-2xl sm:text-3xl text-[#14233a] font-mono tracking-tight">
                  {formatRupiah(biaya)}
                </span>
              </div>

              <div className="mt-3 border-t border-emerald-200/80 pt-2.5 text-[11px] text-emerald-950 space-y-1">
                <div className="flex justify-between">
                  <span>Tarif per km:</span>
                  <span className="font-bold">{formatRupiah(RUTE_CONFIG.TARIF_PER_KM)} / km</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya minimum layanan:</span>
                  <span className="font-bold">{formatRupiah(RUTE_CONFIG.BIAYA_MINIMUM)}</span>
                </div>
                <div className="mt-2 rounded-lg bg-white/90 p-2 text-[11px] font-medium text-emerald-950 border border-emerald-200">
                  💡 {rincian.penjelasan}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Petunjuk Drag Marker */}
        <div className="text-center bg-[#f7f5ef] py-2 px-3 rounded-xl border border-[#d9d2c2] text-[11px] text-[#50647a]">
          💡 <strong>Tips:</strong> Geser pin merah di peta untuk menyempurnakan titik rumah Anda secara tepat.
        </div>

        {/* CTA WhatsApp Pendaftaran */}
        <div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#166534] bg-[#22c55e] py-3 text-sm font-extrabold text-white shadow-[0_4px_0_#15803d] transition hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Daftar Les dengan Rute Ini</span>
          </a>
          <p className="mt-1 text-center text-[0.68rem] text-[#627894]">
            Pesan WhatsApp otomatis terisi koordinat, jarak, dan estimasi transport.
          </p>
        </div>

        {/* Tombol Ubah Lokasi & Reset */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onUbahLokasi}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs
                       bg-[#fffdf9] text-[#14233a] border-2 border-[#d9d2c2] hover:border-[#4a70a9] hover:bg-[#eaf0f9] transition"
          >
            <Edit3 className="h-3.5 w-3.5 text-[#4a70a9]" />
            <span>Ubah Lokasi</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs
                       bg-[#f7f5ef] text-[#50647a] border-2 border-[#d9d2c2] hover:bg-[#eae4d3] transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
