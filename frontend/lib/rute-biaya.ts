export const RUTE_CONFIG = {
  NAMA_TEMPAT: "nCourse",
  TITIK_UTAMA: {
    lat: -7.7285,
    lng: 109.0145,
    alamat: "Jl. Kolonel Sugiono No. 24, Cilacap Kota",
  },
  TARIF_PER_KM: 3000,
  BIAYA_MINIMUM: 10000,
  JARAK_MAKSIMAL_KM: 15,
};

/**
 * Menghitung estimasi biaya transport berdasarkan jarak tempuh (km).
 * Rumus: max(BIAYA_MINIMUM, jarak_km * TARIF_PER_KM), dibulatkan ke atas ke kelipatan 1.000.
 */
export function hitungBiayaTransport(jarakKm: number): number {
  if (typeof jarakKm !== "number" || isNaN(jarakKm) || jarakKm <= 0) {
    return RUTE_CONFIG.BIAYA_MINIMUM;
  }

  const biayaKotor = jarakKm * RUTE_CONFIG.TARIF_PER_KM;
  const biayaDenganMinimum = Math.max(RUTE_CONFIG.BIAYA_MINIMUM, biayaKotor);
  return Math.ceil(biayaDenganMinimum / 1000) * 1000;
}

/**
 * Mengembalikan rincian perhitungan biaya secara transparan untuk ditampilkan di UI.
 */
export function getRincianBiaya(jarakKm: number) {
  const km = typeof jarakKm === "number" && !isNaN(jarakKm) ? jarakKm : 0;
  const biayaKotor = km * RUTE_CONFIG.TARIF_PER_KM;
  const isMinimum = biayaKotor < RUTE_CONFIG.BIAYA_MINIMUM;
  const biayaFinal = hitungBiayaTransport(km);

  let penjelasan = "";
  if (isMinimum) {
    penjelasan = `Jarak dekat (${km.toFixed(1).replace(".", ",")} km × ${formatRupiah(RUTE_CONFIG.TARIF_PER_KM)} = ${formatRupiah(biayaKotor)}), dikenakan tarif batas minimum ${formatRupiah(RUTE_CONFIG.BIAYA_MINIMUM)}.`;
  } else {
    penjelasan = `Hasil hitung: ${km.toFixed(1).replace(".", ",")} km × ${formatRupiah(RUTE_CONFIG.TARIF_PER_KM)} = ${formatRupiah(biayaKotor)}, dibulatkan ke atas menjadi ${formatRupiah(biayaFinal)}.`;
  }

  return {
    biayaKotor,
    isMinimum,
    biayaFinal,
    penjelasan,
  };
}

/**
 * Format mata uang Rupiah standar Indonesia.
 */
export function formatRupiah(nominal: number): string {
  if (typeof nominal !== "number" || isNaN(nominal)) {
    return "Rp 0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal).replace(/\s/g, " ");
}

/**
 * Format jarak dalam kilometer dengan 1 desimal koma Indonesia.
 */
export function formatJarak(jarakKm: number): string {
  if (typeof jarakKm !== "number" || isNaN(jarakKm)) {
    return "0 km";
  }
  return `${jarakKm.toFixed(1).replace(".", ",")} km`;
}

/**
 * Format durasi detik menjadi jam dan menit yang ramah pengguna.
 */
export function formatDurasi(durasiDetik: number): string {
  if (!durasiDetik || durasiDetik <= 0) return "0 menit";

  const totalMenit = Math.round(durasiDetik / 60);
  const jam = Math.floor(totalMenit / 60);
  const sisaMenit = totalMenit % 60;

  if (jam > 0) {
    return sisaMenit > 0 ? `${jam} jam ${sisaMenit} menit` : `${jam} jam`;
  }
  return `${totalMenit} menit`;
}
