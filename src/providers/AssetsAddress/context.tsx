import { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { useApplicationContext } from '../ApplicationContext';

import { Address, AssetsAddressContextValue } from './types';

import { useNullableContext } from '@/hooks';
import { getMapboxAddress, localeToLanguageCode } from '@/utils';

export const AssetsAddressContext = createContext<AssetsAddressContextValue | null>(null);

export const useAssetsAddressContext = () => useNullableContext(AssetsAddressContext);

interface UseGetAssetAddressProps {
  longitude?: Maybe<number>;
  latitude?: Maybe<number>;
  address?: Maybe<string>;
}

export const useGetAssetAddress = ({ longitude, latitude, address }: UseGetAssetAddressProps) => {
  const [assetAddress, setAssetAddress] = useState('');
  const { getAddress } = useAssetsAddressContext();

  useEffect(() => {
    if (address) {
      setAssetAddress(address);
    } else if (longitude && latitude) {
      getAddress(longitude, latitude)
        .then((res) => {
          setAssetAddress(res);
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error('useGetAssetAddress', error));
    }
  }, [longitude, latitude, address, getAddress]);

  return assetAddress;
};

export const AssetsAddressProvider = ({ children }: { children: ReactNode }) => {
  const { appLanguage } = useApplicationContext();
  const [addresses, setAddresses] = useState<Address[]>([]);

  const addressesRef = useRef<Address[]>();
  addressesRef.current = addresses;

  const getAddress = useCallback(
    async (longitude, latitude): Promise<string> =>
      new Promise((resolve, reject) => {
        const existingAddress = addressesRef.current?.find(
          (item) =>
            item.language === appLanguage && item.longitude === longitude && item.latitude === latitude
        );

        if (existingAddress) {
          resolve(existingAddress.placeName);
        } else {
          const languageCode = localeToLanguageCode(appLanguage);

          fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.REACT_APP_MAPBOX_KEY}&limit=1&language=${languageCode}`
          ).then((response) => {
            if (response.ok) {
              response.json().then((data) => {
                const placeName = getMapboxAddress(languageCode, data?.features?.[0]);

                setAddresses([
                  ...(addressesRef.current ?? []),
                  { language: appLanguage, longitude, latitude, placeName },
                ]);
                resolve(placeName);
              });
            } else {
              reject(new Error(response.statusText));
            }
          });
        }
      }),
    [appLanguage]
  );

  const contextValue = useMemo(
    () => ({
      getAddress,
    }),
    [getAddress]
  );

  return <AssetsAddressContext.Provider value={contextValue}>{children}</AssetsAddressContext.Provider>;
};
