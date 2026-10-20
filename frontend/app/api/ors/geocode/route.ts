import { NextRequest, NextResponse } from "next/server";

const ORS_BASE_URL = "https://api.openrouteservice.org";

export async function GET(req: NextRequest) {
  try {
    const apiKey =
      process.env.ORS_API_KEY || process.env.NEXT_PUBLIC_ORS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Kunci API OpenRouteService belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    const params = new URLSearchParams({
      api_key: apiKey.trim(),
      text: query.trim(),
      "boundary.country": "IDN",
      size: "5",
    });

    const url = `${ORS_BASE_URL}/geocode/search?${params.toString()}`;

    const orsResponse = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!orsResponse.ok) {
      return NextResponse.json(
        { error: "Gagal mengambil data pencarian alamat dari OpenRouteService." },
        { status: orsResponse.status }
      );
    }

    const data = await orsResponse.json();
    const features = data.features || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const suggestions = features.map((f: any, index: number) => {
      const [lng, lat] = f.geometry.coordinates;
      return {
        id: f.properties.id || `${lat}-${lng}-${index}`,
        label: f.properties.label || f.properties.name || "Alamat tidak dikenal",
        lat,
        lng,
      };
    });

    return NextResponse.json({ suggestions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
