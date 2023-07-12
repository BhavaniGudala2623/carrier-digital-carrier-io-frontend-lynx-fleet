import Box from '@carrier-io/fds-react/Box';

import { AssetsDrawer } from '../features/drawer';
import { MapProvider } from '../features/map';
import { GeofenceProvider } from '../features/geofences/providers/GeofenceProvider';
import { AssetsPageProvider } from '../providers';

import { AssetsSplitScreen } from './AssetsSplitScreen';
import { FilterPanel } from './FilterPanel';

import { ContentWithDrawerContainer } from '@/components/layouts';

export function AssetsPage() {
  return (
    <AssetsPageProvider>
      <MapProvider>
        <GeofenceProvider>
          <Box display="flex" flex={1} flexDirection="column" minHeight={0} p={2} pb={0}>
            <FilterPanel />
            <ContentWithDrawerContainer drawer={<AssetsDrawer />} noDrawerPadding>
              <AssetsSplitScreen />
            </ContentWithDrawerContainer>
          </Box>
        </GeofenceProvider>
      </MapProvider>
    </AssetsPageProvider>
  );
}
