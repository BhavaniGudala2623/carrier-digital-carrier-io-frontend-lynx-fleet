import { AssetClusterProperties } from '../components';

// code for creating an SVG donut chart from feature properties
const getFontSize = (total: number) => {
  if (total >= 1000) {
    return 18;
  }

  if (total >= 100) {
    return 16;
  }

  if (total >= 10) {
    return 14;
  }

  return 12;
};

const getR = (total: number) => {
  if (total >= 1000) {
    return 50;
  }

  if (total >= 100) {
    return 32;
  }

  if (total >= 10) {
    return 24;
  }

  return 18;
};

const donutSegment = (start: number, end: number, r: number, r0: number, color: string) => {
  let adjustedEnd = end;
  if (end - start === 1) {
    adjustedEnd -= 0.00001;
  }
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (adjustedEnd - 0.25);

  const x0 = Math.cos(a0);
  const y0 = Math.sin(a0);
  const x1 = Math.cos(a1);
  const y1 = Math.sin(a1);
  const largeArc = adjustedEnd - start > 0.5 ? 1 : 0;

  // draw an SVG path
  return `<path d='M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
    r + r * y0
  } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${r + r0 * x1} ${
    r + r0 * y1
  } A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r + r0 * y0}' fill='${color}' />`;
};

export const createAssetMarker = (
  props: AssetClusterProperties,
  colorArray: string[]
): HTMLElement | undefined => {
  const offsets: number[] = [];
  const counts = [props.devAlarm, props.devMoving, props.devStationary];
  let total = 0;

  counts.forEach((count) => {
    offsets.push(total);
    total += count;
  });

  const fontSize = getFontSize(total);
  const r = getR(total);
  const r0 = Math.round(r * 0.6);
  const w = r * 2;

  let html = `<div><svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">`;

  for (let i = 0; i < counts.length; i += 1) {
    html += donutSegment(offsets[i] / total, (offsets[i] + counts[i]) / total, r, r0, colorArray[i]);
  }
  html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="#000" />
    <text dominant-baseline="central" transform="translate(${r}, ${r})" fill="#fff">
    ${total.toLocaleString()}
    </text>
  </svg></div>`;

  const el = document.createElement('div');
  el.innerHTML = html;

  return el.firstChild ? (el.firstChild as HTMLElement) : undefined;
};
