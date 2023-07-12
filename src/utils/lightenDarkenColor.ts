/* eslint-disable no-bitwise */
export function lightenDarkenColor(color: string, amt: number) {
  const num = parseInt(color, 16);
  const r = (num >> 16) + amt;
  const b = ((num >> 8) & 0x00ff) + amt;
  const g = (num & 0x0000ff) + amt;

  const newColor = g | (b << 8) | (r << 16);

  return newColor.toString(16);
}
