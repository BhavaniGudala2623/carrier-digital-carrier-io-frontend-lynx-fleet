import Box from '@carrier-io/fds-react/Box';
import ToggleButton from '@carrier-io/fds-react/ToggleButton';
import ToggleButtonGroup from '@carrier-io/fds-react/ToggleButtonGroup';
import { DescriptionItem } from '@carrier-io/fds-react/patterns/Description/DescriptionItem';
import { CSSProperties, FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { MeasurementUnit } from '@/types/preferences';

interface MeasurementProps {
  name: string;
  label: string;
  value: string | undefined;
  onChange: (event: MouseEvent<HTMLElement>) => void;
  metric: MeasurementUnit;
  imperial: MeasurementUnit;
}

export const Measurement: FC<MeasurementProps> = ({ name, label, value, onChange, metric, imperial }) => {
  const { t } = useTranslation();

  let measureUnitName: string = '';

  switch (value) {
    case undefined:
      measureUnitName = t('common.undefined');
      break;
    case metric.value:
      measureUnitName = metric.name;
      break;
    case imperial.value:
      measureUnitName = imperial.name;
      break;
    default:
  }

  const style: CSSProperties = {
    width: '2.25rem',
    height: '2.25rem',
    textTransform: 'none',
    fontSize: '0.75rem',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.625rem',
      }}
    >
      <Box>
        <DescriptionItem label={label}>{measureUnitName}</DescriptionItem>
      </Box>
      <ToggleButtonGroup exclusive value={value} onChange={onChange} size="small">
        <ToggleButton name={name} value={metric.value} style={style}>
          {metric.shortName}
        </ToggleButton>
        <ToggleButton name={name} value={imperial.value} style={style}>
          {imperial.shortName}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

Measurement.displayName = 'Measurement';
