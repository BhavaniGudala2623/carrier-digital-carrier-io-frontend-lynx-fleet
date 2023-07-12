import MenuItem from '@carrier-io/fds-react/MenuItem';
import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/material';
import Typography from '@carrier-io/fds-react/Typography';

import { ParamsProps, SensorsConfigTableProps, ConnectionLocations } from '../../../types';

import { FormSelect } from '@/components';

type ConnectionLocationFormatterOptionsType = {
  translate: (val: string) => string;
  editAllowed?: boolean;
  sx?: SxProps;
} & Pick<SensorsConfigTableProps, 'handleChangeSensorField'>;

export const ConnectionLocationFormatter = (
  params: ParamsProps,
  options: ConnectionLocationFormatterOptionsType
) => {
  const {
    data: {
      dataField,
      connectionLocation: { value, isDisabled },
    },
  } = params;
  const { handleChangeSensorField, editAllowed } = options;

  const { t } = useTranslation();

  return (
    <FormSelect
      value={value}
      onChange={(event) => handleChangeSensorField(`${event.target.value}`, dataField, 'connectionLocation')}
      disabled={isDisabled || !editAllowed}
      key={`${dataField}location`}
      stylesSelect={{
        '& > .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
        },
      }}
      size="small"
      hideBackgroundColor
      disableUnderline
      fullWidth
    >
      <MenuItem key={ConnectionLocations.TELEMATICS_DEVICE} value={ConnectionLocations.TELEMATICS_DEVICE}>
        <Typography variant="body2">
          {t('device.management.device.commissioning.telematics-device')}
        </Typography>
      </MenuItem>
      <MenuItem key={ConnectionLocations.TRU_CONTROLLER} value={ConnectionLocations.TRU_CONTROLLER}>
        <Typography variant="body2">{t('device.management.device.info.TRU-controller')}</Typography>
      </MenuItem>
    </FormSelect>
  );
};
