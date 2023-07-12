import { formatStatNumber } from './search-statistics';

describe('StatisticsFormatter', () => {
  describe('format statistics data', () => {
    it('less than 1K items', () => {
      const res = formatStatNumber(999);
      expect(res).toBe('999');

      const res1 = formatStatNumber(1);
      expect(res1).toBe('1');
    });

    it('1K items and more', () => {
      const res = formatStatNumber(1000);
      expect(res).toBe('1K');

      const res1 = formatStatNumber(1001);
      expect(res1).toBe('1K+');

      const res2 = formatStatNumber(19991);
      expect(res2).toBe('19K+');

      const res3 = formatStatNumber(999999);
      expect(res3).toBe('999K+');
    });

    it('1M and more items', () => {
      const res = formatStatNumber(1000000);
      expect(res).toBe('1M');

      const res1 = formatStatNumber(1000001);
      expect(res1).toBe('1M+');

      const res2 = formatStatNumber(29990001);
      expect(res2).toBe('29M+');

      const res3 = formatStatNumber(999990009);
      expect(res3).toBe('999M+');
    });
  });
});
