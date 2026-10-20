import { NextResponse } from "next/server";

const ORS_BASE_URL = "https://api.openrouteservice.org";

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.ORS_API_KEY || process.env.NEXT_PUBLIC_ORS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Kunci API OpenRouteService belum dikonfigurasi di server (.env.local)." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { start, end } = body;

    if (!start?.lat || !start?.lng || !end?.lat || !end?.lng) {
      return NextResponse.json(
        { error: "Koordinat titik awal dan titik tujuan harus diisi lengkap." },
        { status: 400 }
      );
    }

    // Format koordinat untuk OpenRouteService: [longitude, latitude]
    const coordinates = [
      [start.lng, start.lat],
      [end.lng, end.lat],
    ];

    const endpoint = `${ORS_BASE_URL}/v2/directions/driving-car/geojson`;

    const orsResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept:
          "application/json, application/geo+json, application/gpx+xml, text/csv; charset=utf-8",
        Authorization: apiKey.trim(),
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ coordinates }),
    });

    if (!orsResponse.ok) {
      let errorDetail = "";
      try {
        const errJson = await orsResponse.json();
        errorDetail = errJson.error?.message || errJson.message || "";
      } catch {
        // Abaikan parsing error
      }

      if (orsResponse.status === 401 || orsResponse.status === 403) {
        return NextResponse.json(
          { error: "Kunci API OpenRouteService tidak valid atau kuota harian habis." },
          { status: 403 }
        );
      }

      if (orsResponse.status === 404 || orsResponse.status === 400) {
        return NextResponse.json(
          {
            error:
              "Rute tidak ditemukan, coba pilih titik lain yang lebih dekat dengan jaringan jalan.",
            detail: errorDetail,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: `Gagal memuat rute dari OpenRouteService (Status ${orsResponse.status}). ${errorDetail}` },
        { status: orsResponse.status }
      );
    }

    const data = await orsResponse.json();
    const feature = data.features?.[0];

    if (!feature || !feature.properties?.summary) {
      return NextResponse.json(
        { error: "Rute tidak ditemukan, coba pilih titik lain di dekat jalan." },
        { status: 404 }
      );
    }

    const { distance, duration } = feature.properties.summary;

    // Konversi koordinat GeoJSON [lng, lat] menjadi [lat, lng] untuk Leaflet
    const rawCoords: [number, number][] = feature.geometry?.coordinates || [];
    const koordinatRute = rawCoords.map(([lng, lat]) => [lat, lng] as [number, number]);

    return NextResponse.json({
      jarakMeter: distance,
      jarakKm: distance / 1000,
      durasiDetik: duration,
      koordinatRute,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan server internal.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
