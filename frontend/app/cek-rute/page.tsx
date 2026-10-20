"use client";

import { useState } from "react";
import { Loader2, Navigation } from "lucide-react";
import { Bricolage_Grotesque, JetBrains_Mono, Public_Sans } from "next/font/google";
import CekRuteNav from "@/components/cek-rute/CekRuteNav";
import CekRuteMap from "@/components/cek-rute/CekRuteMap";
import CekRutePanelLokasi from "@/components/cek-rute/CekRutePanelLokasi";
import CekRuteKartuHasil from "@/components/cek-rute/CekRuteKartuHasil";
import { RUTE_CONFIG, hitungBiayaTransport } from "@/lib/rute-biaya";
import { fetchDirections, type LatLng, type RouteResult } from "@/lib/ors-client";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-learn-display" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-learn-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-learn-mono" });

export default function CekRutePage() {
  const [tahap, setTahap] = useState(1);
  const [lokasiUser, setLokasiUser] = useState<(LatLng & { alamat?: string }) | null>(null);
  const [dataRute, setDataRute] = useState<(RouteResult & { biaya: number }) | null>(null);
  const [sedangHitungRute, setSedangHitungRute] = useState(false);
  const [errorRute, setErrorRute] = useState("");
  const [isPilihDiPetaAktif, setIsPilihDiPetaAktif] = useState(false);

  const handleMulaiCek = () => {
    setErrorRute("");
    setTahap(2);
    setIsPilihDiPetaAktif(false);
  };

  const prosesHitungRute = async (titikUser: LatLng & { alamat?: string }) => {
    if (!titikUser?.lat || !titikUser?.lng) return;

    setSedangHitungRute(true);
    setErrorRute("");

    try {
      const hasil = await fetchDirections(RUTE_CONFIG.TITIK_UTAMA, {
        lat: titikUser.lat,
        lng: titikUser.lng,
      });

      const biaya = hitungBiayaTransport(hasil.jarakKm);

      setDataRute({
        ...hasil,
        biaya,
      });

      setTahap(3);
      setIsPilihDiPetaAktif(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghitung rute.";
      setErrorRute(msg);
      setTahap(2);
    } finally {
      setSedangHitungRute(false);
    }
  };

  const handlePilihLokasi = (lokasi: LatLng & { alamat?: string }) => {
    setLokasiUser(lokasi);
    prosesHitungRute(lokasi);
  };

  const handleUserLocationChange = (lokasiBaru: LatLng & { alamat?: string }) => {
    setLokasiUser(lokasiBaru);
    prosesHitungRute(lokasiBaru);
  };

  const handleMapClick = (coords: LatLng) => {
    const lokasiBaru = {
      lat: coords.lat,
      lng: coords.lng,
      alamat: "Titik dipilih di peta",
    };
    setLokasiUser(lokasiBaru);
    prosesHitungRute(lokasiBaru);
  };

  const handleTogglePilihDiPeta = () => {
    setIsPilihDiPetaAktif((prev) => !prev);
  };

  const handleUbahLokasi = () => {
    setErrorRute("");
    setTahap(2);
    setIsPilihDiPetaAktif(false);
  };

  const handleReset = () => {
    setTahap(1);
    setLokasiUser(null);
    setDataRute(null);
    setErrorRute("");
    setIsPilihDiPetaAktif(false);
  };

  return (
    <main
      className={`landing-hybrid ${display.variable} ${body.variable} ${mono.variable} relative h-screen w-screen overflow-hidden text-[#2b3a4a] antialiased flex flex-col`}
    >
      <CekRuteNav />

      {/* Kontainer Peta Full Screen */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <CekRuteMap
          titikUtama={RUTE_CONFIG.TITIK_UTAMA}
          lokasiUser={lokasiUser}
          onUserLocationChange={handleUserLocationChange}
          rute={dataRute?.koordinatRute || null}
          tahap={tahap}
          isPilihDiPetaAktif={isPilihDiPetaAktif}
          onMapClick={handleMapClick}
        />

        {/* TAHAP 1: Tombol Besar di Bawah */}
        {tahap === 1 && (
          <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
            <button
              type="button"
              onClick={handleMulaiCek}
              className="pointer-events-auto w-full max-w-md bg-[#2e4b7a] hover:bg-[#233a60] text-white font-display font-extrabold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-[0_12px_28px_rgba(46,75,122,0.35)] transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 border-2 border-[#f2c14e]"
            >
              <Navigation className="h-5 w-5 text-[#f2c14e]" />
              <span>Cek Jarak & Biaya Kunjungan</span>
            </button>
          </div>
        )}

        {/* TAHAP 2: Panel Menentukan Lokasi */}
        {tahap === 2 && (
          <CekRutePanelLokasi
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
          <CekRuteKartuHasil
            lokasiUser={lokasiUser}
            jarakKm={dataRute.jarakKm}
            durasiDetik={dataRute.durasiDetik}
            biaya={dataRute.biaya}
            onUbahLokasi={handleUbahLokasi}
            onReset={handleReset}
          />
        )}

        {/* Loading Overlay */}
        {sedangHitungRute && (
          <div className="absolute inset-0 z-40 bg-[#14233a]/30 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#fffdf9] rounded-2xl p-6 shadow-2xl border-2 border-[#d9d2c2] flex flex-col items-center max-w-sm text-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#4a70a9] mb-3" />
              <h4 className="font-display font-bold text-base text-[#14233a]">
                Menghitung Rute Jalan...
              </h4>
              <p className="text-xs text-[#50647a] mt-1">
                Menghubungi OpenRouteService untuk mendapatkan rute jalan darat dan estimasi waktu tempuh.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
