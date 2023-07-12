interface FlattenParams {
  value: null | undefined | number;
}

export function percentFormatter(params: FlattenParams) {
  const { value } = params;

  if (value !== null && value !== undefined) {
    return `${Math.round(value)}%`;
  }

  return '';
}
