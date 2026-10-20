import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import './leafletFix';
import { ikonTempatLes, ikonUser } from './leafletFix';
import MapClickHandler from './MapClickHandler';
import MapBoundsController from './MapBoundsController';
import { CONFIG } from '../../config';

/**
 * Komponen Peta Utama menggunakan Leaflet & react-leaflet
 * Menampilkan tile OpenStreetMap, marker tempat les, marker user yang dapat digeser,
 * serta polyline rute jalan.
 */
export default function MapComponent({
  titikUtama = CONFIG.TITIK_UTAMA,
  lokasiUser,
  onUserLocationChange,
  rute,
  tahap,
  isPilihDiPetaAktif,
  onMapClick,
}) {
  // Posisi awal peta
  const centerAwal = useMemo(() => [titikUtama.lat, titikUtama.lng], [titikUtama]);

  return (
    <div className="relative w-full h-full min-h-screen">
      <MapContainer
        center={centerAwal}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false} // Posisi zoom bisa disesuaikan atau dimatikan agar tidak tertutup panel
      >
        {/* Layer Peta OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Kontrol Bounds dan Kamera */}
        <MapBoundsController
          titikUtama={titikUtama}
          lokasiUser={lokasiUser}
          rute={rute}
          tahap={tahap}
        />

        {/* Listener Klik Peta untuk Mode "Pilih di peta" */}
        <MapClickHandler
          enabled={isPilihDiPetaAktif || tahap === 2}
          onMapClick={onMapClick}
        />

        {/* Marker Titik Utama (Tempat Les) */}
        <Marker position={[titikUtama.lat, titikUtama.lng]} icon={ikonTempatLes}>
          <Popup>
            <div className="p-1 text-sm font-sans">
              <span className="inline-block px-2 py-0.5 mb-1 text-[11px] font-bold text-blue-800 bg-blue-100 rounded-full">
                Tempat Les
              </span>
              <h4 className="font-bold text-gray-900 text-base">{CONFIG.NAMA_TEMPAT}</h4>
              <p className="text-gray-600 text-xs mt-0.5">{titikUtama.alamat || 'Pusat Belajar'}</p>
            </div>
          </Popup>
        </Marker>

        {/* Marker User (Draggable / Bisa Digeser) */}
        {lokasiUser && (
          <Marker
            position={[lokasiUser.lat, lokasiUser.lng]}
            icon={ikonUser}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                onUserLocationChange({
                  lat: position.lat,
                  lng: position.lng,
                  alamat: lokasiUser.alamat || 'Titik ditentukan di peta',
                });
              },
            }}
          >
            <Tooltip permanent={false} direction="top" offset={[0, -35]}>
              <span className="text-xs font-semibold">Geser marker untuk ubah titik</span>
            </Tooltip>
            <Popup>
              <div className="p-1 text-sm font-sans">
                <span className="inline-block px-2 py-0.5 mb-1 text-[11px] font-bold text-rose-800 bg-rose-100 rounded-full">
                  Lokasi Rumah Anda
                </span>
                <p className="text-gray-800 text-xs font-medium">
                  {lokasiUser.alamat || `${lokasiUser.lat.toFixed(5)}, ${lokasiUser.lng.toFixed(5)}`}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 italic">
                  💡 Marker ini bisa digeser ke posisi yang tepat
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Polyline Rute Perjalanan */}
        {rute && rute.length > 1 && (
          <Polyline
            positions={rute}
            pathOptions={{
              color: '#2563eb', // Biru terang
              weight: 5,
              opacity: 0.85,
              lineJoin: 'round',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
