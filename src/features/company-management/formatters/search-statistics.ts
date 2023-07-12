import { toNumber } from 'lodash-es';

const M = 1000000;
const K = 1000;

export const formatStatNumber = (num: number): string => {
  if (num >= M) {
    const m = toNumber(Math.floor(num / M).toFixed(0));

    return m * M === num ? `${m}M` : `${m}M+`;
  }

  if (num >= K) {
    const k = toNumber(Math.floor(num / K).toFixed(0));

    return k * K === num ? `${k}K` : `${k}K+`;
  }

  return num.toString();
};
