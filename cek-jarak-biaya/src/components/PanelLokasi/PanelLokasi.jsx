import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Loader2,
  AlertCircle,
  X,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { searchAddress } from '../../services/ors';

/**
 * Panel Menentukan Lokasi User (Tahap 2)
 * Ditampilkan sebagai Bottom Sheet di mobile dan Side Panel di desktop.
 */
export default function PanelLokasi({
  onPilihLokasi,
  onBatal,
  isPilihDiPetaAktif,
  onTogglePilihDiPeta,
  pesanErrorEksternal,
  onCobaLagiRute,
}) {
  const [statusGps, setStatusGps] = useState('idle'); // 'idle' | 'meminta' | 'sukses' | 'gagal'
  const [pesanGps, setPesanGps] = useState('');

  // State pencarian alamat
  const [kataKunci, setKataKunci] = useState('');
  const [daftarSaran, setDaftarSaran] = useState([]);
  const [sedangMencari, setSedangMencari] = useState(false);
  const [errorPencarian, setErrorPencarian] = useState('');

  // Ref untuk debounce
  const debounceTimerRef = useRef(null);

  // Minta izin GPS otomatis saat panel pertama kali terbuka
  useEffect(() => {
    mintaLokasiGps();
  }, []);

  /**
   * Meminta koordinat GPS user melalui navigator.geolocation
   */
  const mintaLokasiGps = () => {
    if (!navigator.geolocation) {
      setStatusGps('gagal');
      setPesanGps('Browser Anda tidak mendukung deteksi GPS. Silakan ketik alamat Anda di bawah.');
      return;
    }

    setStatusGps('meminta');
    setPesanGps('Sedang mendeteksi lokasi GPS Anda...');

    navigator.geolocation.getCurrentPosition(
      (posisi) => {
        const { latitude, longitude } = posisi.coords;
        setStatusGps('sukses');
        setPesanGps('Lokasi GPS berhasil didapatkan.');
        // Pasang marker dan hitung rute otomatis
        onPilihLokasi({
          lat: latitude,
          lng: longitude,
          alamat: 'Lokasi Anda (Deteksi GPS)',
        });
      },
      (error) => {
        setStatusGps('gagal');
        let pesan = 'Tidak dapat mengakses GPS. Silakan ketik alamat rumah Anda atau pilih di peta.';
        if (error.code === error.PERMISSION_DENIED) {
          pesan = 'Izin akses GPS ditolak. Jangan khawatir, Anda tetap bisa mengetik alamat atau memilih langsung di peta.';
        } else if (error.code === error.TIMEOUT) {
          pesan = 'Waktu pencarian GPS habis. Silakan gunakan kolom pencarian alamat atau pilih di peta.';
        }
        setPesanGps(pesan);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /**
   * Debounce pencarian alamat (500ms) menggunakan OpenRouteService geocoding
   */
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!kataKunci || kataKunci.trim().length < 3) {
      setDaftarSaran([]);
      setSedangMencari(false);
      setErrorPencarian('');
      return;
    }

    setSedangMencari(true);
    setErrorPencarian('');

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const hasil = await searchAddress(kataKunci);
        setDaftarSaran(hasil);
        if (hasil.length === 0) {
          setErrorPencarian('Alamat tidak ditemukan. Coba ketikkan nama jalan atau kecamatan lain.');
        }
      } catch (err) {
        setErrorPencarian(err.message || 'Gagal mencari alamat.');
        setDaftarSaran([]);
      } finally {
        setSedangMencari(false);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [kataKunci]);

  // Handler saat salah satu saran alamat dipilih
  const handlePilihSaran = (saran) => {
    onPilihLokasi({
      lat: saran.lat,
      lng: saran.lng,
      alamat: saran.label,
    });
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 md:inset-auto md:top-4 md:left-4 z-30
                 w-full md:w-[420px] max-h-[85vh] md:max-h-[calc(100vh-2rem)]
                 bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border border-gray-200
                 flex flex-col overflow-hidden transition-all duration-300 ease-out"
    >
      {/* Header Panel */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gray-50/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">
              Tentukan Lokasi Rumah
            </h3>
            <p className="text-xs text-gray-500">Pilih metode penentuan titik lokasi</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBatal}
          aria-label="Tutup panel lokasi"
          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200/60 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Konten Scrollable */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
        {/* Pesan Error Eksternal (misal: API limit / Rute gagal) */}
        {pesanErrorEksternal && (
          <div className="flex items-start gap-3 rounded-xl bg-rose-50 p-3.5 border border-rose-200 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <p className="font-semibold">{pesanErrorEksternal}</p>
              {onCobaLagiRute && (
                <button
                  type="button"
                  onClick={onCobaLagiRute}
                  className="mt-2 font-bold text-rose-700 underline hover:text-rose-900"
                >
                  Coba lagi
                </button>
              )}
            </div>
          </div>
        )}

        {/* Status Deteksi GPS */}
        {statusGps === 'meminta' && (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3.5 border border-blue-100 text-xs text-blue-800 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600 shrink-0" />
            <span>{pesanGps}</span>
          </div>
        )}

        {statusGps === 'gagal' && (
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <div className="flex-1">
              <span>{pesanGps}</span>
              <button
                type="button"
                onClick={mintaLokasiGps}
                className="block mt-1 font-bold text-amber-900 underline hover:text-black"
              >
                Coba aktifkan GPS kembali
              </button>
            </div>
          </div>
        )}

        {/* Kolom Ketik Alamat */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Ketik Alamat Rumah
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              {sedangMencari ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
            <input
              type="text"
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              placeholder="Contoh: Jl. Rinjani, Sidanegara, Cilacap"
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl
                         focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {kataKunci && (
              <button
                type="button"
                onClick={() => setKataKunci('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-gray-500">
            Ketik minimal 3 huruf untuk menampilkan saran alamat (wilayah Indonesia).
          </p>
        </div>

        {/* Daftar Saran Alamat (Maksimal 5) */}
        {daftarSaran.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm divide-y divide-gray-100">
            <div className="bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Pilih Alamat yang Cocok:
            </div>
            {daftarSaran.map((saran) => (
              <button
                key={saran.id}
                type="button"
                onClick={() => handlePilihSaran(saran)}
                className="w-full text-left px-3.5 py-2.5 text-xs text-gray-800 hover:bg-blue-50 hover:text-blue-900
                           flex items-start gap-2.5 transition"
              >
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{saran.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Pesan saat alamat tidak ditemukan */}
        {errorPencarian && (
          <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
            {errorPencarian}
          </p>
        )}

        {/* Pembatas Opsi */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-3 text-gray-400 text-xs font-semibold uppercase">atau</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Tombol Opsi: Pilih di Peta */}
        <div>
          <button
            type="button"
            onClick={onTogglePilihDiPeta}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm border transition shadow-sm ${
              isPilihDiPetaAktif
                ? 'bg-blue-600 text-white border-blue-700 shadow-blue-200'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <MapPin className={`h-4 w-4 ${isPilihDiPetaAktif ? 'text-white animate-bounce' : 'text-blue-600'}`} />
            <span>{isPilihDiPetaAktif ? 'Mode Klik Peta Aktif (Ketuk Peta)' : 'Pilih Langsung di Peta'}</span>
          </button>
          <p className="text-[11px] text-center text-gray-500 mt-1.5">
            Ketuk di sembarang jalan pada peta untuk meletakkan titik rumah Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
