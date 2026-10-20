"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { RUTE_CONFIG } from "@/lib/rute-biaya";
import type { LatLng } from "@/lib/ors-client";

interface Props {
  titikUtama?: { lat: number; lng: number; alamat?: string };
  lokasiUser: (LatLng & { alamat?: string }) | null;
  onUserLocationChange: (lokasi: LatLng & { alamat?: string }) => void;
  rute: [number, number][] | null;
  tahap: number;
  isPilihDiPetaAktif: boolean;
  onMapClick: (coords: LatLng) => void;
}

export default function CekRuteMapInner({
  titikUtama = RUTE_CONFIG.TITIK_UTAMA,
  lokasiUser,
  onUserLocationChange,
  rute,
  tahap,
  isPilihDiPetaAktif,
  onMapClick,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null);

  const onUserLocationChangeRef = useRef(onUserLocationChange);
  const onMapClickRef = useRef(onMapClick);

  useEffect(() => {
    onUserLocationChangeRef.current = onUserLocationChange;
    onMapClickRef.current = onMapClick;
  });

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    let isMounted = true;
    if (!mapContainerRef.current) return;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapContainerRef.current, {
        center: [titikUtama.lat, titikUtama.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Kontrol Zoom di pojok kanan bawah
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Tile Layer OpenStreetMap (bebas API key)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Attribution
      L.control
        .attribution({ position: "bottomleft", prefix: false })
        .addAttribution(
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> kontributor'
        )
        .addTo(map);

      // Marker Titik Utama (Tempat Les)
      const hubIcon = L.divIcon({
        className: "hub-marker-pin",
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background-color: #2e4b7a;
            color: #f2c14e;
            border: 3px solid #f2c14e;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(46, 75, 122, 0.35);
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" fill="#f2c14e" stroke="#2e4b7a" stroke-width="1"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const hubMarker = L.marker([titikUtama.lat, titikUtama.lng], {
        icon: hubIcon,
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: inherit; padding: 4px;">
          <span style="display:inline-block; font-size:10px; font-weight:800; background:#eaf0f9; color:#2e4b7a; padding:2px 8px; border-radius:9999px; margin-bottom:4px;">
            Tempat Les
          </span>
          <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:800; color:#14233a;">${RUTE_CONFIG.NAMA_TEMPAT}</h4>
          <p style="margin:0; font-size:11px; color:#50647a;">${titikUtama.alamat || "Pusat Belajar & Koordinasi"}</p>
        </div>
      `;
      hubMarker.bindPopup(popupHtml);

      // Listener Klik Peta
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        onMapClickRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [titikUtama]);

  // Update Marker User (Draggable)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (!lokasiUser) {
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
          userMarkerRef.current = null;
        }
        return;
      }

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([lokasiUser.lat, lokasiUser.lng]);
      } else {
        const userIcon = L.divIcon({
          className: "user-marker-pin",
          html: `
            <div style="
              display: flex;
              align-items: center;
              gap: 5px;
              background-color: #ef4444;
              color: white;
              border: 2px solid white;
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              box-shadow: 0 4px 14px rgba(239, 68, 68, 0.45);
              cursor: grab;
              transform: translate(-50%, -50%);
              white-space: nowrap;
            ">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:white;"></span>
              Rumah Anda
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([lokasiUser.lat, lokasiUser.lng], {
          icon: userIcon,
          draggable: true,
        }).addTo(map);

        marker.on("dragend", (e: { target: { getLatLng: () => { lat: number; lng: number } } }) => {
          const pos = e.target.getLatLng();
          onUserLocationChangeRef.current({
            lat: pos.lat,
            lng: pos.lng,
            alamat: "Titik digeser di peta",
          });
        });

        userMarkerRef.current = marker;
      }
    });
  }, [lokasiUser]);

  // Update Polyline Rute & FitBounds
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Hapus polyline lama
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }

      if (rute && rute.length > 1) {
        const polyline = L.polyline(rute, {
          color: "#2563eb",
          weight: 5,
          opacity: 0.85,
          lineJoin: "round",
        }).addTo(map);

        polylineRef.current = polyline;

        // Auto zoom fit kedua titik
        const bounds = L.latLngBounds(rute);
        map.fitBounds(bounds, {
          padding: [70, 70],
          maxZoom: 16,
          animate: true,
        });
      } else if (tahap === 1) {
        map.flyTo([titikUtama.lat, titikUtama.lng], 14, { duration: 0.8 });
      } else if (lokasiUser) {
        const bounds = L.latLngBounds([
          [titikUtama.lat, titikUtama.lng],
          [lokasiUser.lat, lokasiUser.lng],
        ]);
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15, animate: true });
      }
    });
  }, [rute, tahap, lokasiUser, titikUtama]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eaf0f9]">
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Instruksi Mode Pilih di Peta */}
      {isPilihDiPetaAktif && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="rounded-full bg-[#2e4b7a] px-4 py-1.5 text-xs font-bold text-white shadow-lg border border-[#f2c14e] flex items-center gap-2 animate-bounce">
            <span className="h-2 w-2 rounded-full bg-[#f2c14e]" />
            <span>Ketuk sembarang jalan di peta untuk menaruh pin rumah</span>
          </div>
        </div>
      )}
    </div>
  );
}
