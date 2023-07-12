export function getDateInputMask(format: string): string {
  return format.replace(/[A-Za-z0-9]/g, '_');
}
