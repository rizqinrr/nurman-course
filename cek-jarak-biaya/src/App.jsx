import React, { useState } from 'react';
import {
  Navigation,
  Loader2,
  AlertCircle,
  MapPin,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import MapComponent from './components/Map/MapComponent';
import PanelLokasi from './components/PanelLokasi/PanelLokasi';
import KartuHasil from './components/KartuHasil/KartuHasil';
import { CONFIG } from './config';
import { getDirections } from './services/ors';
import { hitungBiayaTransport } from './utils/biaya';

export default function App() {
  // Tahap aplikasi: 1 = Halaman awal, 2 = Menentukan lokasi, 3 = Tampilan hasil
  const [tahap, setTahap] = useState(1);

  // State data lokasi user
  const [lokasiUser, setLokasiUser] = useState(null); // { lat, lng, alamat }

  // State hasil perhitungan rute & biaya
  const [dataRute, setDataRute] = useState(null); // { jarakKm, durasiDetik, koordinatRute, biaya }

  // State loading & error rute
  const [sedangHitungRute, setSedangHitungRute] = useState(false);
  const [errorRute, setErrorRute] = useState('');

  // Mode "Pilih di peta" aktif atau tidak
  const [isPilihDiPetaAktif, setIsPilihDiPetaAktif] = useState(false);

  /**
   * Memulai alur (dari Tahap 1 menuju Tahap 2)
   */
  const handleMulaiCek = () => {
    setErrorRute('');
    setTahap(2);
    setIsPilihDiPetaAktif(false);
  };

  /**
   * Menghitung rute dan estimasi biaya ke titik lokasi user yang dipilih
   */
  const prosesHitungRute = async (titikUser) => {
    if (!titikUser || !titikUser.lat || !titikUser.lng) return;

    setSedangHitungRute(true);
    setErrorRute('');

    try {
      // Panggil endpoint directions OpenRouteService (profile driving-car)
      const hasilOrs = await getDirections(CONFIG.TITIK_UTAMA, {
        lat: titikUser.lat,
        lng: titikUser.lng,
      });

      // Hitung biaya transport berdasarkan rumus tarif
      const estimasiBiaya = hitungBiayaTransport(hasilOrs.jarakKm);

      setDataRute({
        jarakKm: hasilOrs.jarakKm,
        jarakMeter: hasilOrs.jarakMeter,
        durasiDetik: hasilOrs.durasiDetik,
        koordinatRute: hasilOrs.koordinatRute,
        biaya: estimasiBiaya,
      });

      // Pindah ke Tahap 3 (Hasil)
      setTahap(3);
      setIsPilihDiPetaAktif(false);
    } catch (err) {
      setErrorRute(err.message || 'Gagal menghitung rute.');
      // Tetap di tahap 2 agar user bisa memilih lokasi lain
      setTahap(2);
    } finally {
      setSedangHitungRute(false);
    }
  };

  /**
   * Handler saat user memilih lokasi (via GPS, ketik alamat, atau klik peta)
   */
  const handlePilihLokasi = (lokasi) => {
    setLokasiUser(lokasi);
    prosesHitungRute(lokasi);
  };

  /**
   * Handler saat marker user digeser (draggable dragend)
   */
  const handleUserLocationChange = (lokasiBaru) => {
    setLokasiUser(lokasiBaru);
    prosesHitungRute(lokasiBaru);
  };

  /**
   * Handler klik langsung pada peta
   */
  const handleMapClick = (coords) => {
    const lokasiBaru = {
      lat: coords.lat,
      lng: coords.lng,
      alamat: 'Titik dipilih pada peta',
    };
    setLokasiUser(lokasiBaru);
    prosesHitungRute(lokasiBaru);
  };

  /**
   * Toggle mode "Pilih di peta"
   */
  const handleTogglePilihDiPeta = () => {
    setIsPilihDiPetaAktif((prev) => !prev);
  };

  /**
   * Mengulang tahap 2 (Ubah lokasi)
   */
  const handleUbahLokasi = () => {
    setErrorRute('');
    setTahap(2);
    setIsPilihDiPetaAktif(false);
  };

  /**
   * Reset seluruh alur kembali ke Tahap 1
   */
  const handleReset = () => {
    setTahap(1);
    setLokasiUser(null);
    setDataRute(null);
    setErrorRute('');
    setIsPilihDiPetaAktif(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100 font-sans">
      {/* Peta Utama Leaflet (Full Screen) */}
      <MapComponent
        titikUtama={CONFIG.TITIK_UTAMA}
        lokasiUser={lokasiUser}
        onUserLocationChange={handleUserLocationChange}
        rute={dataRute?.koordinatRute || null}
        tahap={tahap}
        isPilihDiPetaAktif={isPilihDiPetaAktif}
        onMapClick={handleMapClick}
      />

      {/* Floating Header Info Tempat Les */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-gray-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            NC
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">
              {CONFIG.NAMA_TEMPAT}
            </h1>
            <p className="text-[11px] text-gray-500">Kalkulator Jarak & Biaya Kunjungan</p>
          </div>
        </div>
      </div>

      {/* Banner Mode "Pilih di Peta" Aktif */}
      {isPilihDiPetaAktif && tahap === 2 && (
        <div className="absolute top-4 inset-x-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-20 pointer-events-auto">
          <div className="bg-blue-600 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold animate-bounce">
            <MapPin className="h-4 w-4" />
            <span>Ketuk di jalan pada peta untuk meletakkan titik rumah Anda</span>
          </div>
        </div>
      )}

      {/* TAHAP 1: Tombol Besar "Cek Jarak & Biaya" di Bawah Layar */}
      {tahap === 1 && (
        <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
          <button
            type="button"
            onClick={handleMulaiCek}
            className="pointer-events-auto w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-2xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 border-2 border-white/20"
          >
            <Navigation className="h-5 w-5" />
            <span>Cek Jarak & Biaya</span>
          </button>
        </div>
      )}

      {/* TAHAP 2: Panel Menentukan Lokasi User (Bottom Sheet / Side Panel) */}
      {tahap === 2 && (
        <PanelLokasi
          onPilihLokasi={handlePilihLokasi}
          onBatal={handleReset}
          isPilihDiPetaAktif={isPilihDiPetaAktif}
          onTogglePilihDiPeta={handleTogglePilihDiPeta}
          pesanErrorEksternal={errorRute}
          onCobaLagiRute={lokasiUser ? () => prosesHitungRute(lokasiUser) : null}
        />
      )}

      {/* TAHAP 3: Kartu Hasil Perhitungan & Rute */}
      {tahap === 3 && dataRute && lokasiUser && (
        <KartuHasil
          lokasiUser={lokasiUser}
          jarakKm={dataRute.jarakKm}
          durasiDetik={dataRute.durasiDetik}
          biaya={dataRute.biaya}
          onUbahLokasi={handleUbahLokasi}
          onReset={handleReset}
        />
      )}

      {/* Loading Overlay Saat Menghitung Rute */}
      {sedangHitungRute && (
        <div className="absolute inset-0 z-40 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 flex flex-col items-center max-w-sm text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-3" />
            <h4 className="font-bold text-base text-gray-900">Menghitung Rute Jalan...</h4>
            <p className="text-xs text-gray-500 mt-1">
              Menghubungi OpenRouteService untuk mendapatkan rute jalan darat dan estimasi waktu tempuh.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
