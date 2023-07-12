export const getNullKeyItems = <T>(dictionary: Record<string, T[]>) => [
  ...(dictionary.null ?? []),
  ...(dictionary.undefined ?? []),
];
