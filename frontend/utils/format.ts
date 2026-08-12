/**
 * Format price to Indonesian currency string
 * @param price - Price in rupiah
 * @returns Formatted string (e.g., "Mulai dari 45rb", "Mulai dari 1.5jt")
 */
export function formatPrice(price: number): string {
  if (price >= 1000000) {
    const juta = price / 1000000;
    return `Mulai dari ${juta === Math.floor(juta) ? Math.floor(juta) : juta.toFixed(1)}jt`;
  }

  const ribu = Math.round(price / 1000);
  return `Mulai dari ${ribu}rb`;
}

/**
 * Add 1 hour to a "HH:MM" time string (wraps past 23:59 into the same day).
 * Used as a default auto-fill for the session end time.
 */
export function addOneHour(time: string): string {
  const [hh, mm] = time.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return time;
  const nextHour = (hh + 1) % 24;
  return `${String(nextHour).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
