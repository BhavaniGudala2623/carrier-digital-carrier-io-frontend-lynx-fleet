import { createContext, useMemo, ReactNode } from 'react';
import { AssetDetails, CompartmentConfig, Maybe } from '@carrier-io/lynx-fleet-types';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { useNullableContext } from '@/hooks';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface AssetHistoryPageContextProps {
  assetDetails?: AssetDetails;
  assetDetailsLoading: boolean;
  assetId: string;
  configuredCompartmentNumbers: number[];
  compartmentConfig: Maybe<CompartmentConfig>;
}

const AssetHistoryPageContext = createContext<AssetHistoryPageContextProps>({
  assetDetails: undefined,
  assetDetailsLoading: true,
  assetId: '',
  configuredCompartmentNumbers: [],
  compartmentConfig: null,
});

export const AssetHistoryPageProvider = ({ children, assetId }: { children: ReactNode; assetId: string }) => {
  const { appLanguage } = useApplicationContext();

  const { data: assetDetails, loading: assetDetailsLoading } = AssetService.useGetAssetDetails({
    assetId,
    language: appLanguage,
  });

  const configuredCompartmentNumbers = useMemo(
    () =>
      assetDetails?.getAssetDetails?.compartments
        ? Object.values(assetDetails?.getAssetDetails.compartments).reduce(
            (acc, comp, i) => (comp?.configured ? [...acc, i + 1] : acc),
            []
          )
        : [],
    [assetDetails?.getAssetDetails?.compartments]
  );

  const compartmentConfig = useMemo(
    () => assetDetails?.getAssetDetails?.compartmentConfig ?? null,
    [assetDetails?.getAssetDetails?.compartmentConfig]
  );

  const value = useMemo(
    () => ({
      assetDetails: assetDetails?.getAssetDetails,
      assetDetailsLoading,
      assetId,
      configuredCompartmentNumbers,
      compartmentConfig,
    }),
    [assetDetails, assetDetailsLoading, assetId, configuredCompartmentNumbers, compartmentConfig]
  );

  return <AssetHistoryPageContext.Provider value={value}>{children}</AssetHistoryPageContext.Provider>;
};

export const useAssetHistoryPageContext = () => useNullableContext(AssetHistoryPageContext);
