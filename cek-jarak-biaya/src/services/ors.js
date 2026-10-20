import { CONFIG } from '../config';

const ORS_BASE_URL = 'https://api.openrouteservice.org';

/**
 * Validasi keberadaan API Key sebelum melakukan pemanggilan API.
 */
function periksaApiKey() {
  const key = CONFIG.ORS_API_KEY;
  if (!key || key === 'masukkan_api_key_openrouteservice_disini' || key.trim() === '') {
    throw new Error(
      'Kunci API OpenRouteService belum dipasang. Harap buat file .env dan isi VITE_ORS_API_KEY dengan API key Anda.'
    );
  }
  return key.trim();
}

/**
 * Mengambil rute perjalanan dan estimasi jarak dari OpenRouteService (profile: driving-car).
 * PERHATIAN: ORS memerlukan format koordinat [longitude, latitude],
 * sedangkan Leaflet memakai [latitude, longitude].
 *
 * @param {{ lat: number, lng: number }} titikAwal - Titik awal (tempat les)
 * @param {{ lat: number, lng: number }} titikTujuan - Titik tujuan (lokasi user)
 * @returns {Promise<{
 *   jarakKm: number,
 *   jarakMeter: number,
 *   durasiDetik: number,
 *   koordinatRute: Array<[number, number]> // format [lat, lng] untuk polyline Leaflet
 * }>}
 */
export async function getDirections(titikAwal, titikTujuan) {
  const apiKey = periksaApiKey();

  if (!titikAwal || !titikTujuan) {
    throw new Error('Titik awal dan titik tujuan harus diisi.');
  }

  // Format koordinat untuk ORS: [longitude, latitude]
  const coordinates = [
    [titikAwal.lng, titikAwal.lat],
    [titikTujuan.lng, titikTujuan.lat],
  ];

  const endpoint = `${ORS_BASE_URL}/v2/directions/driving-car/geojson`;

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, text/csv; charset=utf-8',
        'Authorization': apiKey,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ coordinates }),
    });
  } catch (netErr) {
    throw new Error('Koneksi internet bermasalah atau gagal terhubung ke server OpenRouteService.');
  }

  // Tangani error status HTTP
  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error?.message || errJson.message || '';
    } catch {
      // Abaikan jika respons bukan JSON
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error('API Key OpenRouteService tidak valid atau kuota harian telah habis.');
    }

    if (response.status === 404 || response.status === 400) {
      if (errorDetail.toLowerCase().includes('could not find point') || errorDetail.toLowerCase().includes('routable')) {
        throw new Error('Rute tidak ditemukan, coba pilih titik lain di dekat jalan.');
      }
      throw new Error(`Rute tidak ditemukan, coba pilih titik lain di dekat jalan (${errorDetail || 'titik terlalu jauh dari jaringan jalan'}).`);
    }

    if (response.status === 429) {
      throw new Error('Batas panggilan API tercapai (Rate limit). Harap tunggu beberapa saat lalu coba lagi.');
    }

    throw new Error(`Gagal memuat rute (Status ${response.status}). ${errorDetail}`);
  }

  const data = await response.json();
  const feature = data.features?.[0];

  if (!feature || !feature.properties?.summary) {
    throw new Error('Rute tidak ditemukan, coba pilih titik lain di dekat jalan.');
  }

  const { distance, duration } = feature.properties.summary;

  // Konversi koordinat GeoJSON [lng, lat] menjadi format Leaflet [lat, lng]
  const rawCoords = feature.geometry?.coordinates || [];
  const koordinatRute = rawCoords.map(([lng, lat]) => [lat, lng]);

  return {
    jarakMeter: distance,
    jarakKm: distance / 1000,
    durasiDetik: duration,
    koordinatRute,
  };
}

/**
 * Mencari saran alamat menggunakan endpoint geocode/search OpenRouteService.
 * Dibatasi untuk wilayah Indonesia (boundary.country=IDN), maksimal 5 hasil.
 *
 * @param {string} query - Teks pencarian alamat
 * @returns {Promise<Array<{
 *   id: string,
 *   label: string,
 *   lat: number,
 *   lng: number
 * }>>}
 */
export async function searchAddress(query) {
  const apiKey = periksaApiKey();

  if (!query || query.trim().length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    text: query.trim(),
    'boundary.country': 'IDN',
    size: '5',
  });

  const url = `${ORS_BASE_URL}/geocode/search?${params.toString()}`;

  let response;
  try {
    response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch (netErr) {
    throw new Error('Gagal menghubungi layanan pencarian alamat. Periksa koneksi internet Anda.');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('API Key OpenRouteService tidak valid untuk pencarian alamat.');
    }
    throw new Error('Terjadi kesalahan saat mencari alamat.');
  }

  const data = await response.json();
  const features = data.features || [];

  return features.map((f, index) => {
    const [lng, lat] = f.geometry.coordinates;
    return {
      id: f.properties.id || `${lat}-${lng}-${index}`,
      label: f.properties.label || f.properties.name || 'Alamat tidak dikenal',
      lat,
      lng,
    };
  });
}
