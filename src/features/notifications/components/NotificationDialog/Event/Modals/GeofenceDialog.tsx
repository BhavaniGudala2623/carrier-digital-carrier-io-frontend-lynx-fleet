import { useCallback, useEffect, useMemo, useState } from 'react';
import { AutocompleteProps } from '@carrier-io/fds-react/Autocomplete';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import { GeofenceExpression } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';

import { Dropdown, useDropdownOption } from '../../Dropdown';
import { EventDialogProps, GeofenceComparisonType } from '../../../../types';
import { GeofenceSelector } from '../../../Selector/Geofence';

import { DialogActions } from './DialogActions';
import { boldTextSx } from './styles';

import { Dialog } from '@/components';

const GeofenceDialogTooltipContent = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="body2" mb={1}>
        {t('notifications.geofence-tooltip-1')}
      </Typography>
      <Typography variant="body2" mb={1}>
        {t('notifications.geofence-tooltip-2')}
      </Typography>
      <Typography variant="body2">{t('notifications.geofence-tooltip-3')}</Typography>
    </Box>
  );
};

export function GeofenceDialog({ handleCancel, handleOk, expression, exclude }: EventDialogProps) {
  const { t } = useTranslation();
  const initialGeofences = (expression as GeofenceExpression)?.geofences || [];
  const [selectedGeofences, setSelectedGeofences] = useState<string[]>(initialGeofences);
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleGeofencesChange: AutocompleteProps['onChange'] = (_event, value) => {
    setSelectedGeofences(value.map((item) => item.id));
  };

  const dropdownItems = useMemo<{ label: string; value: GeofenceComparisonType }[]>(
    () => [
      {
        label: t('common.inside').toLowerCase(),
        value: 'INSIDE',
      },
      {
        label: t('common.outside').toLowerCase(),
        value: 'OUTSIDE',
      },
    ],
    [t]
  );
  const initialComparison = (expression as GeofenceExpression)?.comparison || dropdownItems[0].value;
  const { option, handleOptionChange } = useDropdownOption<GeofenceComparisonType>(initialComparison);

  const handleSave = useCallback(() => {
    handleOk({
      type: 'GEOFENCE',
      expression: {
        comparison: option,
        geofences: selectedGeofences,
      },
    });
  }, [handleOk, option, selectedGeofences]);

  useEffect(() => {
    setDisabled(!selectedGeofences.length);
  }, [selectedGeofences]);

  return (
    <Dialog
      open
      onClose={handleCancel}
      dialogTitle={t('geofences.geofence')}
      tooltipTitle={<GeofenceDialogTooltipContent />}
      fullWidth
      maxWidth="sm"
      content={
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body1" component="div">
              <Typography sx={boldTextSx}>
                {exclude ? t('notifications.except-when') : t('common.if')}
              </Typography>
              &nbsp;
              {t('notifications.an-asset-is')}
            </Typography>
            <Dropdown value={option} onChange={handleOptionChange} items={dropdownItems} />
            <Typography variant="body1">{t('notifications.any-of-selected-geofences')}</Typography>
          </Box>
          <Box sx={{ mb: 1 }}>
            <GeofenceSelector selectedIds={selectedGeofences} onChange={handleGeofencesChange} />
          </Box>
        </>
      }
      actionsSx={{ p: 1 }}
      actions={<DialogActions onCancel={handleCancel} onSave={handleSave} disabled={disabled} />}
    />
  );
}
