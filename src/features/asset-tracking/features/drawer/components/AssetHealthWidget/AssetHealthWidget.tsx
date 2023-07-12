import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { HealthStatusType } from '@carrier-io/lynx-fleet-types';

import { useAssetsPageContext } from '../../../../providers';
import { useAssetsPageDataContext } from '../../../../providers/AssetsPageDataProvider';

import { HealthStatusBox } from './HealthStatusBox';

import { Loader } from '@/components';

export const AssetHealthWidget = () => {
  const { t } = useTranslation();
  const { selectedHealthStatus, setSelectedAlarm, setSelectedStatus, setSelectedAssetHealthStatus } =
    useAssetsPageContext();

  const { filteredHealthSummaries } = useAssetsPageDataContext();

  const selectHealthStatus = (type: HealthStatusType) => {
    let newHealthStatusType: HealthStatusType | null = null;
    if (type !== selectedHealthStatus) {
      newHealthStatusType = type;
    }

    setSelectedAssetHealthStatus(newHealthStatusType);

    setSelectedAlarm(null);
    setSelectedStatus(null);
  };

  return (
    <Box mt={3} mb={2}>
      <Typography variant="subtitle2" color="text.primary" pl={1} mb={1}>
        {t('assets.widgets.alarm.widget.asset-health')}
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1}>
        {filteredHealthSummaries?.length > 0 ? (
          [...filteredHealthSummaries].map((x) => (
            <HealthStatusBox
              key={x.type}
              healthStatus={x}
              selected={x.type === selectedHealthStatus}
              onSelectHealthStatus={selectHealthStatus}
            />
          ))
        ) : (
          <Box sx={{ my: 4 }}>
            <Loader />
          </Box>
        )}
      </Box>
    </Box>
  );
};
