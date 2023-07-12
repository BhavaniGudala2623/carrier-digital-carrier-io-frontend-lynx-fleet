import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import Divider from '@carrier-io/fds-react/Divider';
import Grid from '@carrier-io/fds-react/Grid';

import { useAssetsPageContext } from '../../../../providers';

import { StatusItem, useStatusWidget } from './useStatusWidget';
import { StatusWidgetBox } from './StatusWidgetBox';

export const StatusWidget = () => {
  const { t } = useTranslation();
  const { totalAssets, poweredOff, poweredOn } = useStatusWidget();
  const { selectedStatus, setSelectedStatus, setSelectedAlarm, setSelectedAssetHealthStatus } =
    useAssetsPageContext();

  const renderStatusItems = (statusItems: StatusItem[]) => (
    <Grid item xs={6}>
      {statusItems.map((statusItem, i) => (
        <StatusWidgetBox
          key={statusItem.id}
          statusItem={statusItem}
          isSelected={selectedStatus === statusItem.type}
          onSelectStatus={setSelectedStatus}
          onSelectedAlarm={setSelectedAlarm}
          onSelectedHealthStatus={setSelectedAssetHealthStatus}
          bold={i === 0}
        />
      ))}
    </Grid>
  );

  return (
    // TODO: change bgcolor to 'background.description' when it will be added to the Theme FDS
    <Grid container direction="column" sx={{ bgcolor: '#ECEFF140', borderRadius: 2, p: 1 }}>
      <Grid
        item
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pb={0.5}
        data-testid="total-assets-widget"
      >
        <Typography variant="subtitle2" color="secondary.dark" data-testid="total-assets-widget-title">
          {t('asset.status.summary.total-assets')}
        </Typography>
        <Typography variant="h6" color="primary.dark" data-testid="total-assets-widget-counter">
          {totalAssets}
        </Typography>
      </Grid>
      <Grid container direction="row" wrap="nowrap">
        {renderStatusItems(poweredOn)}
        <Divider orientation="vertical" flexItem light sx={{ mx: 0.5 }} />
        {renderStatusItems(poweredOff)}
      </Grid>
    </Grid>
  );
};

StatusWidget.displayName = 'StatusWidget';
