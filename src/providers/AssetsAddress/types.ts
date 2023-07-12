import { LanguageType } from '@carrier-io/lynx-fleet-types';

export interface Address {
  language: LanguageType;
  longitude: number;
  latitude: number;
  placeName: string;
}

export type AssetsAddressContextValue = {
  getAddress: (longitude: number, latitude: number) => Promise<string>;
};
