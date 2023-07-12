/**
 * Convert date in format like dd.MM.yyyy hh:mm to ISO format
 * @param date
 */
export function dateToISO(date: string) {
  return `${date.split(' ').join('T')}Z`;
}
