import { EuropeCountries, regions, countriesByRegion } from '@carrier-io/lynx-fleet-common';

export const euCountriesDictionary2: Record<string, string> = EuropeCountries.reduce(
  (dict, c) => ({ ...dict, [c]: `company.management.country.name.eu.${c}` }),
  {}
);

export const regionCountriesMap = Object.keys(countriesByRegion).reduce((map, r) => {
  const countries = Array.from(countriesByRegion[r]) as string[];

  return {
    ...map,
    [r]: countries.reduce((acc, c) => ({ ...acc, [c]: `company.management.country.name.${r}.${c}` }), {}),
  };
}, {});

type RegionOption = { name: string; label: string };

export const regionsDictionary = regions.reduce(
  (dict, region) => ({ ...dict, [region]: `company.management.region.${region}` }),
  {}
);

export const regionOptions: RegionOption[] = Object.keys(regionsDictionary)
  .reduce(
    (allRegions: RegionOption[], region) => [
      ...allRegions,
      { name: region, label: regionsDictionary[region] },
    ],
    []
  )
  .sort((a, b) => a.name.localeCompare(b.name));
