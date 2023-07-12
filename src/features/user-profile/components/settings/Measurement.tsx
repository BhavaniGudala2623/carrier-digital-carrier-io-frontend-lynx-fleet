import { FC } from 'react';
import Grid from '@carrier-io/fds-react/Grid';
import ToggleButton from '@carrier-io/fds-react/ToggleButton';
import ToggleButtonGroup from '@carrier-io/fds-react/ToggleButtonGroup';
import Typography from '@carrier-io/fds-react/Typography';

import { UserSettingFormat } from '../../types';

interface MeasurementProps {
  MeasurementName: string;
  Name: string;
  Metric: UserSettingFormat;
  Imperial: UserSettingFormat;
  value: string | boolean;
  handleSettingChange: Function;
}

export const Measurement: FC<MeasurementProps> = ({
  MeasurementName,
  Name,
  Metric,
  Imperial,
  value,
  handleSettingChange,
}) => (
  <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: '0.75rem' }}>
    <Grid>
      <Typography variant="caption" variantMapping={{ caption: 'span' }}>
        <strong>{Name}</strong>
      </Typography>
    </Grid>
    <Grid>
      <ToggleButtonGroup
        exclusive
        aria-label={Name}
        value={value}
        onChange={(e) => handleSettingChange(e)}
        size="small"
        className="toggle-btn-group"
      >
        <ToggleButton name={MeasurementName} value={Imperial.Value}>
          {Imperial.Name}
        </ToggleButton>
        <ToggleButton name={MeasurementName} value={Metric.Value}>
          {Metric.Name}
        </ToggleButton>
      </ToggleButtonGroup>
    </Grid>
  </Grid>
);
