import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Mengontrol pergerakan kamera dan zoom peta secara otomatis (fitBounds / flyTo)
 * saat rute berubah atau ketika titik lokasi user diperbarui.
 */
export default function MapBoundsController({ titikUtama, lokasiUser, rute, tahap }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Jika ada koordinat rute, lakukan fitBounds agar seluruh jalur terlihat
    if (rute && rute.length > 1) {
      const bounds = L.latLngBounds(rute);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 16,
        animate: true,
      });
      return;
    }

    // Jika hanya lokasi user yang ada (tanpa rute)
    if (lokasiUser && lokasiUser.lat && lokasiUser.lng) {
      const bounds = L.latLngBounds([
        [titikUtama.lat, titikUtama.lng],
        [lokasiUser.lat, lokasiUser.lng],
      ]);
      map.fitBounds(bounds, {
        padding: [80, 80],
        maxZoom: 15,
        animate: true,
      });
      return;
    }

    // Jika tahap kembali ke 1 (halaman awal), kembalikan posisi ke titik utama
    if (tahap === 1) {
      map.flyTo([titikUtama.lat, titikUtama.lng], 14, {
        duration: 1,
      });
    }
  }, [map, rute, lokasiUser, titikUtama, tahap]);

  return null;
}
