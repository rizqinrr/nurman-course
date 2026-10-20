export interface LatLng {
  lat: number;
  lng: number;
}

export interface AddressSuggestion {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export interface RouteResult {
  jarakKm: number;
  jarakMeter: number;
  durasiDetik: number;
  koordinatRute: [number, number][];
}

/**
 * Memanggil Next.js API proxy /api/ors/directions untuk mendapatkan rute jalan
 */
export async function fetchDirections(start: LatLng, end: LatLng): Promise<RouteResult> {
  const response = await fetch("/api/ors/directions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start, end }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Gagal menghitung rute perjalanan.");
  }

  return {
    jarakKm: data.jarakKm,
    jarakMeter: data.jarakMeter,
    durasiDetik: data.durasiDetik,
    koordinatRute: data.koordinatRute,
  };
}

/**
 * Memanggil Next.js API proxy /api/ors/geocode untuk mendapatkan saran alamat
 */
export async function fetchAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  if (!query || query.trim().length < 3) return [];

  const response = await fetch(`/api/ors/geocode?q=${encodeURIComponent(query.trim())}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Gagal mencari alamat.");
  }

  return data.suggestions || [];
}
