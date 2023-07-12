export const sortStrings = (
  a: string | null | undefined,
  b: string | null | undefined,
  direction: 'asc' | 'desc' = 'asc'
): number => {
  const fieldA = a ?? '';
  const fieldB = b ?? '';

  if (direction === 'asc') {
    return fieldA.localeCompare(fieldB);
  }

  return fieldB.localeCompare(fieldA);
};
