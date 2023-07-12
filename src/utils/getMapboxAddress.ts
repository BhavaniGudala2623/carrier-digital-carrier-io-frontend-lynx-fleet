import { formatMapboxAddress } from '@carrier-io/lynx-fleet-common';

// TODO replace feature type from Record<string, unknown> to MapboxFeature
export function getMapboxAddress(languageCode: string, feature: Record<string, unknown> | undefined): string {
  if (!feature) {
    return '';
  }

  const mapboxAddresses = formatMapboxAddress([languageCode], feature);

  const address = mapboxAddresses.find((item) => item.languageCode === languageCode)?.placeName;

  if (address) {
    return address;
  }

  return mapboxAddresses.find((item) => item.languageCode === 'en')?.placeName ?? '';
}
