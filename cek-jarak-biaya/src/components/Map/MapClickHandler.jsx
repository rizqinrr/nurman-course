import { useMapEvents } from 'react-leaflet';

/**
 * Komponen pembantu untuk menangkap event klik pada peta
 * Aktif terutama saat user memilih opsi "Pilih di peta".
 */
export default function MapClickHandler({ enabled, onMapClick }) {
  useMapEvents({
    click(e) {
      if (enabled && onMapClick) {
        onMapClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });

  return null;
}
