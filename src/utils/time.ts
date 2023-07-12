export const timeToSeconds = (hours: number, minutes: number): number => (hours * 60 + minutes) * 60;

export const secondsAsTimePickerValue = (
  seconds?: number
): {
  hr: number;
  min: number;
} => {
  if (!seconds) {
    return {
      hr: 0,
      min: 0,
    };
  }

  const min = (seconds / 60) % 60;
  const hr = (seconds / 60 - min) / 60;

  return {
    hr,
    min,
  };
};
