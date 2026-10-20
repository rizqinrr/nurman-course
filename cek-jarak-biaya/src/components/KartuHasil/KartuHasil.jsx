import React from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  RotateCcw,
  Edit3,
  AlertTriangle,
  Receipt,
  Sparkles,
  Info,
} from 'lucide-react';
import { formatRupiah, formatJarak, formatDurasi, getRincianBiaya } from '../../utils/biaya';
import { CONFIG } from '../../config';

/**
 * Kartu Hasil Perhitungan Rute & Biaya Transport (Tahap 3 & 4)
 * Menampilkan ringkasan jarak rute jalan, waktu tempuh, dan estimasi biaya.
 */
export default function KartuHasil({
  lokasiUser,
  jarakKm,
  durasiDetik,
  biaya,
  onUbahLokasi,
  onReset,
}) {
  const isLuarArea = jarakKm > CONFIG.JARAK_MAKSIMAL_KM;

  return (
    <div
      className="fixed inset-x-0 bottom-0 md:inset-auto md:top-4 md:left-4 z-30
                 w-full md:w-[420px] max-h-[85vh] md:max-h-[calc(100vh-2rem)]
                 bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border border-gray-200
                 flex flex-col overflow-hidden transition-all duration-300"
    >
      {/* Header Kartu */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/90 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
            <Sparkles className="h-3 w-3" />
            Hasil Perhitungan Rute
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1">
            Estimasi Kunjungan Les
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-gray-200/60 transition"
          title="Reset ke awal"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Konten Utama */}
      <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
        {/* Alamat Titik User */}
        <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-200/80">
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Titik Rumah Anda
              </span>
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug mt-0.5">
                {lokasiUser.alamat || `${lokasiUser.lat.toFixed(5)}, ${lokasiUser.lng.toFixed(5)}`}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Koordinat: {lokasiUser.lat.toFixed(5)}, {lokasiUser.lng.toFixed(5)}
              </p>
            </div>
          </div>
        </div>

        {/* Kondisi Jarak Melebihi Batas Maksimal */}
        {isLuarArea ? (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <h4 className="font-bold text-sm">Lokasi di luar area layanan</h4>
            </div>
            <p className="text-xs leading-relaxed text-amber-800">
              Jarak tempuh rute menuju rumah Anda adalah <strong>{formatJarak(jarakKm)}</strong>, melebihi batas maksimal layanan les tatap muka kami (<strong>{CONFIG.JARAK_MAKSIMAL_KM} km</strong>).
            </p>
            <div className="rounded-lg bg-white/70 p-2.5 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Untuk lokasi ini, Anda dapat memilih opsi bimbingan belajar secara <strong>Online (1-on-1)</strong>.</span>
            </div>
          </div>
        ) : (
          /* Kondisi Normal (Dalam Jangkauan) */
          <>
            {/* Kartu Rangkuman Jarak & Waktu Tempuh */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100">
                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold">
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Jarak Tempuh</span>
                </div>
                <div className="mt-1 font-extrabold text-xl text-gray-900 font-mono">
                  {formatJarak(jarakKm)}
                </div>
                <span className="text-[10px] text-gray-500">Jalur jalan darat (ORS)</span>
              </div>

              <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100">
                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Estimasi Tiba</span>
                </div>
                <div className="mt-1 font-extrabold text-xl text-gray-900 font-mono">
                  {formatDurasi(durasiDetik)}
                </div>
                <span className="text-[10px] text-gray-500">Kondisi lalu lintas normal</span>
              </div>
            </div>

            {/* Kotak Estimasi Biaya */}
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <Receipt className="h-4 w-4 text-emerald-700" />
                  Estimasi Biaya Transport
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Per Kunjungan
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-extrabold text-2xl sm:text-3xl text-gray-900 font-mono tracking-tight">
                  {formatRupiah(biaya)}
                </span>
              </div>

              <div className="mt-3 border-t border-emerald-200/70 pt-2.5 text-[11px] text-emerald-900/80 space-y-1">
                <div className="flex justify-between">
                  <span>Tarif dasar per km:</span>
                  <span className="font-bold">{formatRupiah(CONFIG.TARIF_PER_KM)} / km</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya minimum layanan:</span>
                  <span className="font-bold">{formatRupiah(CONFIG.BIAYA_MINIMUM)}</span>
                </div>
                <div className="mt-2 rounded-lg bg-white/80 p-2 text-[11px] font-medium text-emerald-950 border border-emerald-200">
                  💡 {getRincianBiaya(jarakKm).penjelasan}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Petunjuk Interaktif Drag Marker */}
        <div className="text-center bg-gray-50 py-2 px-3 rounded-xl border border-gray-200 text-[11px] text-gray-600">
          💡 <strong>Tips:</strong> Geser pin merah di peta untuk menyempurnakan titik rumah Anda secara tepat.
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            onClick={onUbahLokasi}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm
                       bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition shadow-xs"
          >
            <Edit3 className="h-4 w-4 text-gray-600" />
            <span>Ubah Lokasi</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm
                       bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            <RotateCcw className="h-4 w-4 text-gray-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
