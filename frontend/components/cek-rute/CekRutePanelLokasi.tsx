"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Compass,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { fetchAddressSuggestions, type AddressSuggestion, type LatLng } from "@/lib/ors-client";

interface Props {
  onPilihLokasi: (lokasi: LatLng & { alamat?: string }) => void;
  onBatal: () => void;
  isPilihDiPetaAktif: boolean;
  onTogglePilihDiPeta: () => void;
  pesanErrorEksternal?: string;
  onCobaLagiRute?: (() => void) | null;
}

export default function CekRutePanelLokasi({
  onPilihLokasi,
  onBatal,
  isPilihDiPetaAktif,
  onTogglePilihDiPeta,
  pesanErrorEksternal,
  onCobaLagiRute,
}: Props) {
  const [statusGps, setStatusGps] = useState<"idle" | "meminta" | "sukses" | "gagal">(() => {
    if (typeof window !== "undefined" && !navigator.geolocation) {
      return "gagal";
    }
    return "meminta";
  });
  const [pesanGps, setPesanGps] = useState(() => {
    if (typeof window !== "undefined" && !navigator.geolocation) {
      return "Browser Anda tidak mendukung deteksi GPS. Silakan ketik alamat Anda di bawah.";
    }
    return "Sedang mendeteksi titik koordinat GPS Anda...";
  });

  const [kataKunci, setKataKunci] = useState("");
  const [daftarSaran, setDaftarSaran] = useState<AddressSuggestion[]>([]);
  const [sedangMencari, setSedangMencari] = useState(false);
  const [errorPencarian, setErrorPencarian] = useState("");

  const onPilihLokasiRef = useRef(onPilihLokasi);
  useEffect(() => {
    onPilihLokasiRef.current = onPilihLokasi;
  });

  const mintaLokasiGps = () => {
    if (!navigator.geolocation) {
      setStatusGps("gagal");
      setPesanGps("Browser Anda tidak mendukung deteksi GPS. Silakan ketik alamat Anda di bawah.");
      return;
    }

    setStatusGps("meminta");
    setPesanGps("Sedang mendeteksi titik koordinat GPS Anda...");

    navigator.geolocation.getCurrentPosition(
      (posisi) => {
        const { latitude, longitude } = posisi.coords;
        setStatusGps("sukses");
        setPesanGps("Lokasi GPS berhasil didapatkan.");
        onPilihLokasiRef.current({
          lat: latitude,
          lng: longitude,
          alamat: "Titik Lokasi Saya (Deteksi GPS)",
        });
      },
      (error) => {
        setStatusGps("gagal");
        let pesan = "Tidak dapat mengakses GPS. Silakan ketik alamat rumah Anda atau pilih di peta.";
        if (error.code === error.PERMISSION_DENIED) {
          pesan = "Izin akses GPS ditolak. Anda tetap bisa mengetik alamat atau memilih langsung di peta.";
        } else if (error.code === error.TIMEOUT) {
          pesan = "Waktu pencarian GPS habis. Silakan gunakan kolom pencarian alamat atau pilih di peta.";
        }
        setPesanGps(pesan);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (posisi) => {
        const { latitude, longitude } = posisi.coords;
        setStatusGps("sukses");
        setPesanGps("Lokasi GPS berhasil didapatkan.");
        onPilihLokasiRef.current({
          lat: latitude,
          lng: longitude,
          alamat: "Titik Lokasi Saya (Deteksi GPS)",
        });
      },
      (error) => {
        setStatusGps("gagal");
        let pesan = "Tidak dapat mengakses GPS. Silakan ketik alamat rumah Anda atau pilih di peta.";
        if (error.code === error.PERMISSION_DENIED) {
          pesan = "Izin akses GPS ditolak. Anda tetap bisa mengetik alamat atau memilih langsung di peta.";
        } else if (error.code === error.TIMEOUT) {
          pesan = "Waktu pencarian GPS habis. Silakan gunakan kolom pencarian alamat atau pilih di peta.";
        }
        setPesanGps(pesan);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (!kataKunci || kataKunci.trim().length < 3) return;

    const timer = setTimeout(async () => {
      setSedangMencari(true);
      setErrorPencarian("");
      try {
        const hasil = await fetchAddressSuggestions(kataKunci);
        setDaftarSaran(hasil);
        if (hasil.length === 0) {
          setErrorPencarian("Alamat tidak ditemukan. Coba ketikkan nama jalan atau kecamatan lain.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal mencari alamat.";
        setErrorPencarian(msg);
        setDaftarSaran([]);
      } finally {
        setSedangMencari(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [kataKunci]);

  return (
    <div
      className="fixed inset-x-0 bottom-0 md:inset-auto md:top-4 md:left-4 z-30
                 w-full md:w-[410px] max-h-[85vh] md:max-h-[calc(100vh-2rem)]
                 bg-[#fffdf9] rounded-t-3xl md:rounded-2xl shadow-[0_16px_36px_rgba(27,48,77,0.25)] border-2 border-[#d9d2c2]
                 flex flex-col overflow-hidden transition-all duration-300 ease-out"
    >
      {/* Header Panel */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-[#e6dfd1] bg-[#f7f5ef]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2e4b7a] text-white shadow-xs">
            <Compass className="h-5 w-5 text-[#f2c14e]" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-[#14233a] text-base leading-tight">
              Tentukan Lokasi Rumah
            </h3>
            <p className="text-xs text-[#50647a]">Pilih metode penentuan titik lokasi</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBatal}
          aria-label="Tutup panel lokasi"
          className="p-1.5 text-[#627894] hover:text-[#14233a] rounded-lg hover:bg-[#eae4d3] transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Konten Scrollable */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
        {/* Pesan Error Eksternal */}
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

        {/* Status GPS */}
        {statusGps === "meminta" && (
          <div className="flex items-center gap-3 rounded-xl bg-[#eaf0f9] p-3.5 border border-[#4a70a9]/30 text-xs text-[#2e4b7a] animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-[#4a70a9] shrink-0" />
            <span>{pesanGps}</span>
          </div>
        )}

        {statusGps === "gagal" && (
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <div className="flex-1">
              <span>{pesanGps}</span>
              <button
                type="button"
                onClick={mintaLokasiGps}
                className="block mt-1 font-bold text-amber-900 underline hover:text-black"
              >
                Coba deteksi GPS kembali
              </button>
            </div>
          </div>
        )}

        {/* Input Ketik Alamat */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#50647a] uppercase tracking-wider">
            Ketik Alamat Rumah
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8da3bd]">
              {sedangMencari ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#4a70a9]" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
            <input
              type="text"
              value={kataKunci}
              onChange={(e) => {
                const val = e.target.value;
                setKataKunci(val);
                if (val.trim().length < 3) {
                  setDaftarSaran([]);
                  setSedangMencari(false);
                  setErrorPencarian("");
                }
              }}
              placeholder="Contoh: Jl. Rinjani, Sidanegara, Cilacap"
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#f7f5ef] border-2 border-[#d9d2c2] rounded-xl text-[#14233a] font-medium
                         focus:bg-white focus:outline-hidden focus:border-[#4a70a9] transition"
            />
            {kataKunci && (
              <button
                type="button"
                onClick={() => {
                  setKataKunci("");
                  setDaftarSaran([]);
                  setSedangMencari(false);
                  setErrorPencarian("");
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8da3bd] hover:text-[#14233a]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#627894]">
            Ketik minimal 3 karakter untuk menampilkan saran alamat (wilayah Indonesia).
          </p>
        </div>

        {/* Saran Alamat */}
        {daftarSaran.length > 0 && (
          <div className="rounded-xl border-2 border-[#d9d2c2] bg-white overflow-hidden shadow-xs divide-y divide-[#e6dfd1]">
            <div className="bg-[#f7f5ef] px-3 py-1.5 text-[11px] font-bold text-[#50647a] uppercase tracking-wider">
              Pilih Alamat yang Sesuai:
            </div>
            {daftarSaran.map((saran) => (
              <button
                key={saran.id}
                type="button"
                onClick={() =>
                  onPilihLokasi({
                    lat: saran.lat,
                    lng: saran.lng,
                    alamat: saran.label,
                  })
                }
                className="w-full text-left px-3.5 py-2.5 text-xs text-[#203652] hover:bg-[#eaf0f9] hover:text-[#2e4b7a]
                           flex items-start gap-2.5 transition"
              >
                <MapPin className="h-4 w-4 text-[#4a70a9] shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{saran.label}</span>
              </button>
            ))}
          </div>
        )}

        {errorPencarian && (
          <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            {errorPencarian}
          </p>
        )}

        {/* Pembatas */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t-2 border-[#e6dfd1]"></div>
          <span className="flex-shrink mx-3 text-[#8da3bd] text-xs font-bold uppercase">atau</span>
          <div className="flex-grow border-t-2 border-[#e6dfd1]"></div>
        </div>

        {/* Tombol Pilih di Peta */}
        <div>
          <button
            type="button"
            onClick={onTogglePilihDiPeta}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition shadow-xs ${
              isPilihDiPetaAktif
                ? "bg-[#2e4b7a] text-white border-[#14233a]"
                : "bg-[#fffdf9] text-[#2e4b7a] border-[#d9d2c2] hover:border-[#4a70a9] hover:bg-[#eaf0f9]"
            }`}
          >
            <MapPin className={`h-4 w-4 ${isPilihDiPetaAktif ? "text-[#f2c14e] animate-bounce" : "text-[#4a70a9]"}`} />
            <span>{isPilihDiPetaAktif ? "Mode Klik Peta Aktif (Ketuk Peta)" : "Pilih Langsung di Peta"}</span>
          </button>
          <p className="text-[11px] text-center text-[#627894] mt-1.5">
            Ketuk pada sembarang jalan di peta untuk menentukan titik rumah Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
