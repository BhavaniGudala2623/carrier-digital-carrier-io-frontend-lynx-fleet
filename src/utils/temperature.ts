function format(val: number, maximumFractionDigits = 1): number {
  if (maximumFractionDigits <= 0) {
    return Math.round(val);
  }

  const fraction = 10 ** maximumFractionDigits;

  return Math.round(val * fraction) / fraction;
}

export function toCelsius(temperature: string | number, maximumFractionDigits?: number): number {
  return format(((Number(temperature) - 32) * 5) / 9, maximumFractionDigits);
}

export function toFahrenheit(temperature: string | number, maximumFractionDigits?: number): number {
  return format((Number(temperature) * 9) / 5 + 32, maximumFractionDigits);
}

export function toUnit(
  temperature: string | number,
  tempUnit: string,
  maximumFractionDigits?: number
): number {
  return Number(
    tempUnit === 'C'
      ? format(Number(temperature), maximumFractionDigits)
      : toFahrenheit(temperature, maximumFractionDigits)
  );
}

export function toFahrenheitDelta(temperature: string | number, maximumFractionDigits?: number): number {
  return format((Number(temperature) * 9) / 5, maximumFractionDigits);
}

export function toCelsiusDelta(temperature: string | number, maximumFractionDigits?: number): number {
  return format((Number(temperature) * 5) / 9, maximumFractionDigits);
}

export function getTemperatureDelta(
  temperature: string | number,
  tempUnit: string,
  maximumFractionDigits?: number
): number {
  return Number(
    tempUnit === 'C'
      ? format(Number(temperature), maximumFractionDigits)
      : toFahrenheitDelta(temperature, maximumFractionDigits)
  );
}
