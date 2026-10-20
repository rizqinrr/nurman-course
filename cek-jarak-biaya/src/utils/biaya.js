import { CONFIG } from '../config';

/**
 * Menghitung estimasi biaya transport berdasarkan jarak tempuh (km).
 * Rumus: max(BIAYA_MINIMUM, jarak_km * TARIF_PER_KM), dibulatkan ke atas ke kelipatan 1.000.
 *
 * @param {number} jarakKm - Jarak dalam kilometer
 * @returns {number} - Biaya yang sudah dibulatkan ke kelipatan 1.000
 */
export function hitungBiayaTransport(jarakKm) {
  if (typeof jarakKm !== 'number' || isNaN(jarakKm) || jarakKm <= 0) {
    return CONFIG.BIAYA_MINIMUM;
  }

  // Hitung biaya kotor
  const biayaKotor = jarakKm * CONFIG.TARIF_PER_KM;

  // Terapkan batas minimum
  const biayaDenganMinimum = Math.max(CONFIG.BIAYA_MINIMUM, biayaKotor);

  // Bulatkan ke atas ke kelipatan 1.000
  return Math.ceil(biayaDenganMinimum / 1000) * 1000;
}

/**
 * Mengembalikan rincian perhitungan biaya secara transparan untuk ditampilkan di UI.
 *
 * @param {number} jarakKm - Jarak dalam kilometer
 * @returns {{
 *   biayaKotor: number,
 *   isMinimum: boolean,
 *   biayaFinal: number,
 *   penjelasan: string
 * }}
 */
export function getRincianBiaya(jarakKm) {
  const km = typeof jarakKm === 'number' && !isNaN(jarakKm) ? jarakKm : 0;
  const biayaKotor = km * CONFIG.TARIF_PER_KM;
  const isMinimum = biayaKotor < CONFIG.BIAYA_MINIMUM;
  const biayaFinal = hitungBiayaTransport(km);

  let penjelasan = '';
  if (isMinimum) {
    penjelasan = `Jarak dekat (${km.toFixed(1).replace('.', ',')} km × ${formatRupiah(CONFIG.TARIF_PER_KM)} = ${formatRupiah(biayaKotor)}), dikenakan tarif batas minimum ${formatRupiah(CONFIG.BIAYA_MINIMUM)}.`;
  } else {
    penjelasan = `Hasil hitung: ${km.toFixed(1).replace('.', ',')} km × ${formatRupiah(CONFIG.TARIF_PER_KM)} = ${formatRupiah(biayaKotor)}, dibulatkan ke atas menjadi ${formatRupiah(biayaFinal)}.`;
  }

  return {
    biayaKotor,
    isMinimum,
    biayaFinal,
    penjelasan,
  };
}

/**
 * Memformat angka menjadi format mata uang Rupiah standar Indonesia.
 * Contoh: 15000 -> "Rp 15.000"
 *
 * @param {number} nominal - Angka nominal uang
 * @returns {string} - String berformat Rupiah
 */
export function formatRupiah(nominal) {
  if (typeof nominal !== 'number' || isNaN(nominal)) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(nominal).replace(/\s/g, ' ');
}

/**
 * Memformat jarak dalam kilometer dengan 1 angka di belakang koma.
 * Contoh: 5.43 -> "5,4 km"
 *
 * @param {number} jarakKm - Jarak dalam kilometer
 * @returns {string} - String format jarak
 */
export function formatJarak(jarakKm) {
  if (typeof jarakKm !== 'number' || isNaN(jarakKm)) {
    return '0 km';
  }
  return `${jarakKm.toFixed(1).replace('.', ',')} km`;
}

/**
 * Memformat durasi detik dari API ORS menjadi format jam dan menit yang ramah pengguna.
 * Contoh: 900 detik -> "15 menit", 4200 detik -> "1 jam 10 menit"
 *
 * @param {number} durasiDetik - Durasi perjalanan dalam detik
 * @returns {string} - String format waktu tempuh
 */
export function formatDurasi(durasiDetik) {
  if (!durasiDetik || durasiDetik <= 0) return '0 menit';

  const totalMenit = Math.round(durasiDetik / 60);
  const jam = Math.floor(totalMenit / 60);
  const sisaMenit = totalMenit % 60;

  if (jam > 0) {
    return sisaMenit > 0 ? `${jam} jam ${sisaMenit} menit` : `${jam} jam`;
  }
  return `${totalMenit} menit`;
}
