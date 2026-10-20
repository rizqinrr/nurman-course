import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import gambar ikon bawaan Leaflet agar dibundle dengan benar oleh Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Hapus fungsi default Leaflet yang memuat path otomatis dari CSS
delete L.Icon.Default.prototype._getIconUrl;

// Daftarkan path ikon yang sudah di-bundle oleh Vite
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

/**
 * Ikon khusus untuk Titik Utama (Tempat Les)
 * Menggunakan gaya pin biru tua dengan aksen elegan
 */
export const ikonTempatLes = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Ikon khusus untuk Lokasi Rumah User / Murid
 * Menggunakan warna merah/oranye terang agar mudah dibedakan dan mencolok
 */
export const ikonUser = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
