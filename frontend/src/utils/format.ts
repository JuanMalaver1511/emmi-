export function formatCOP(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return '$' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
