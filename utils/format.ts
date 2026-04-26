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
