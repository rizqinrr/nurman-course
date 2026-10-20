"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
  COVERAGE_AREAS,
  MAIN_HUBS,
  TUTOR_LOCATIONS,
} from "@/data/coverage";

interface Props {
  selectedAreaId: string | null;
  onSelectArea: (areaId: string) => void;
  userCoords: { lat: number; lng: number } | null;
  onMapClick: (coords: { lat: number; lng: number }) => void;
}

export default function CoverageMapInner({
  selectedAreaId,
  onSelectArea,
  userCoords,
  onMapClick,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);

  const onSelectAreaRef = useRef(onSelectArea);
  const onMapClickRef = useRef(onMapClick);

  useEffect(() => {
    onSelectAreaRef.current = onSelectArea;
    onMapClickRef.current = onMapClick;
  });

  // Initialize Map
  useEffect(() => {
    let isMounted = true;
    if (!mapContainerRef.current) return;

    // Dynamically import Leaflet in browser only
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Prevent re-initialization
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Center around Cilacap Kota
      const map = L.map(mapContainerRef.current, {
        center: [-7.6800, 109.0800],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Add zoom control at bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Tile Layer OpenStreetMap (bebas API key)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Add Attribution
      L.control
        .attribution({ position: "bottomleft", prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> kontributor')
        .addTo(map);

      // 1. Draw Coverage Circles
      COVERAGE_AREAS.forEach((area) => {
        const isZona1 = area.zone === 1;
        const circle = L.circle([area.lat, area.lng], {
          radius: area.radiusMeters,
          color: isZona1 ? "#2e4b7a" : "#f2c14e",
          fillColor: isZona1 ? "#4a70a9" : "#f2c14e",
          fillOpacity: isZona1 ? 0.14 : 0.10,
          weight: isZona1 ? 2 : 1.5,
          dashArray: isZona1 ? "4, 6" : "6, 8",
        }).addTo(map);

        circle.on("click", () => {
          onSelectAreaRef.current(area.id);
          map.flyTo([area.lat, area.lng], 13, { duration: 0.8 });
        });
      });

      // 2. Draw Area Badges
      COVERAGE_AREAS.forEach((area) => {
        const isZona1 = area.zone === 1;
        const areaIcon = L.divIcon({
          className: "custom-area-pin",
          html: `
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              background-color: ${isZona1 ? "#2e4b7a" : "#fffdf9"};
              color: ${isZona1 ? "#fffdf9" : "#14233a"};
              border: 2px solid ${isZona1 ? "#f2c14e" : "#4a70a9"};
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              font-family: inherit;
              box-shadow: 0 4px 12px rgba(20, 35, 58, 0.22);
              cursor: pointer;
              white-space: nowrap;
              transform: translate(-50%, -50%);
            ">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:${isZona1 ? "#10b981" : "#f59e0b"};"></span>
              ${area.name}
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([area.lat, area.lng], { icon: areaIcon }).addTo(map);

        marker.on("click", () => {
          onSelectAreaRef.current(area.id);
          map.flyTo([area.lat, area.lng], 13, { duration: 0.8 });
        });
      });

      // 3. Draw Hub Pusat Marker
      MAIN_HUBS.forEach((hub) => {
        const isPusat = hub.type === "headquarters";
        const hubIcon = L.divIcon({
          className: "custom-hub-pin",
          html: `
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 38px;
              height: 38px;
              background-color: #14233a;
              color: #f2c14e;
              border: 3px solid #f2c14e;
              border-radius: 12px;
              box-shadow: 0 6px 16px rgba(20, 35, 58, 0.35);
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              <span style="position: absolute; top: -4px; right: -4px; width: 10px; height: 10px; border-radius: 50%; background-color: #22c55e; border: 2px solid white;"></span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" fill="#f2c14e" stroke="#14233a" stroke-width="1"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([hub.lat, hub.lng], { icon: hubIcon }).addTo(map);

        const popupContent = `
          <div style="padding: 6px 4px; font-family: inherit;">
            <div style="display:inline-block; font-size: 10px; font-weight: 800; background-color: #eaf0f9; color: #2e4b7a; padding: 2px 8px; border-radius: 9999px; margin-bottom: 4px;">
              ${isPusat ? "Pusat Koordinasi" : "Posko Tentor"}
            </div>
            <h4 style="font-size: 14px; font-weight: 800; color: #14233a; margin: 0 0 4px 0;">${hub.name}</h4>
            <p style="font-size: 11px; color: #50647a; margin: 0 0 8px 0; line-height: 1.4;">${hub.address}</p>
            <span style="font-size: 11px; font-weight: 700; color: #166534; display: flex; align-items: center; gap: 4px;">
              ● Tim & Fasilitas Siap Sedia
            </span>
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      // 4. Draw Tentor Markers
      TUTOR_LOCATIONS.forEach((tutor) => {
        const tutorIcon = L.divIcon({
          className: "custom-tutor-pin",
          html: `
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              background-color: #fffdf9;
              border: 2px solid #2e4b7a;
              padding: 3px 8px 3px 4px;
              border-radius: 9999px;
              box-shadow: 0 4px 12px rgba(46, 75, 122, 0.25);
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: #2e4b7a;
                color: #fffdf9;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: 800;
              ">
                ${tutor.nickname.slice(4, 5)}
              </div>
              <div style="line-height: 1.1;">
                <span style="display:block; font-size: 10px; font-weight: 800; color: #14233a;">${tutor.nickname}</span>
                <span style="display:block; font-size: 8px; font-weight: 600; color: #4a70a9;">${tutor.role.replace("Tentor ", "")}</span>
              </div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([tutor.lat, tutor.lng], { icon: tutorIcon }).addTo(map);

        const tutorPopup = `
          <div style="padding: 6px 4px; font-family: inherit;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #2e4b7a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px;">
                ${tutor.nickname.slice(4, 5)}
              </div>
              <div>
                <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #14233a;">${tutor.name}</h4>
                <span style="font-size: 10px; font-weight: 600; color: #4a70a9;">${tutor.role}</span>
              </div>
            </div>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #50647a; line-height: 1.35;">${tutor.specialization}</p>
            <div style="font-size: 10px; font-weight: 700; color: #166534; background-color: #ecfdf5; padding: 4px 8px; border-radius: 6px; border: 1px solid #a7f3d0;">
              ✓ Standby area: ${tutor.baseLocation}
            </div>
          </div>
        `;

        marker.bindPopup(tutorPopup);
      });

      // 5. Map Click Event to Drop User Pin
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        onMapClickRef.current({ lat, lng });
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Marker Pin when userCoords change
  useEffect(() => {
    if (!mapInstanceRef.current || !userCoords) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
      }

      const userPinIcon = L.divIcon({
        className: "custom-user-pin",
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 4px;
            background-color: #ef4444;
            color: white;
            border: 2px solid white;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.45);
            cursor: pointer;
            transform: translate(-50%, -50%);
            animation: bounce 1s infinite alternate;
          ">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:white;"></span>
            Rumah Anda
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([userCoords.lat, userCoords.lng], { icon: userPinIcon }).addTo(map);
      userMarkerRef.current = marker;

      map.flyTo([userCoords.lat, userCoords.lng], 13, { duration: 0.8 });
    });
  }, [userCoords]);

  // Pan to area when selectedAreaId changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedAreaId) return;
    const area = COVERAGE_AREAS.find((a) => a.id === selectedAreaId);
    if (area) {
      mapInstanceRef.current.flyTo([area.lat, area.lng], 13, { duration: 0.8 });
    }
  }, [selectedAreaId]);

  return (
    <div className="relative h-full w-full min-h-[460px] sm:min-h-[560px] overflow-hidden rounded-2xl border-2 border-[#d9d2c2] shadow-[0_12px_32px_-16px_rgba(27,48,77,0.22)]">
      {/* Map Container */}
      <div ref={mapContainerRef} className="h-full w-full z-0 bg-[#eaf0f9]" />

      {/* Floating Legend Top Right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 rounded-xl border-2 border-[#d9d2c2] bg-[#fffdf9]/95 p-3 shadow-md backdrop-blur-xs text-[0.7rem] font-bold text-[#14233a] pointer-events-auto">
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[#50647a] mb-1">
          Keterangan Wilayah
        </span>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2e4b7a] border border-[#f2c14e]" />
          <span>Zona 1: Cilacap Kota (Gratis Transport)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f2c14e] border border-[#14233a]" />
          <span>Zona 2: Wilayah Sekitar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#14233a] border border-[#f2c14e]" />
          <span>Hub & Posko Tentor</span>
        </div>
      </div>

      {/* Instruction Badge Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 rounded-lg border border-[#d9d2c2] bg-[#fffdf9]/90 px-3 py-1.5 text-xs font-semibold text-[#50647a] shadow-xs backdrop-blur-xs pointer-events-none">
        <span>💡 Klik area pada peta atau letakkan pin untuk cek jarak rumahmu</span>
      </div>
    </div>
  );
}
