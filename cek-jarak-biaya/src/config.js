/**
 * File Konfigurasi Utama
 * Mengatur parameter tempat les, koordinat titik utama, tarif, serta batasan jarak.
 */

export const CONFIG = {
  // Nama tempat les yang ditampilkan pada popup marker dan judul
  NAMA_TEMPAT: "Nurman Course",

  // Koordinat lokasi tempat les (titik awal keberangkatan tentor)
  TITIK_UTAMA: {
    lat: -7.7285,
    lng: 109.0145,
    alamat: "Jl. Kolonel Sugiono No. 24, Cilacap Kota",
  },

  // Tarif per kilometer dalam satuan Rupiah
  TARIF_PER_KM: 3000,

  // Biaya minimum transport dalam satuan Rupiah
  BIAYA_MINIMUM: 10000,

  // Batas maksimal jarak layanan (dalam kilometer)
  JARAK_MAKSIMAL_KM: 15,

  // API Key OpenRouteService dari environment variable (VITE_ORS_API_KEY)
  ORS_API_KEY: import.meta.env.VITE_ORS_API_KEY || "",
};
