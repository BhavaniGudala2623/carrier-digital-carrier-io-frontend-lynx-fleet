import { useTranslation } from 'react-i18next';
import TextField from '@carrier-io/fds-react/TextField';
import Grid from '@carrier-io/fds-react/Grid';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import { isNil } from 'lodash-es';

import { useUserSettings } from '@/providers/UserSettings';
import { toFahrenheit, translateOperatingMode } from '@/utils';

interface Props {
  compartmentMode?: string | null;
  compartmentSetpoint?: number | null;
  index: number;
}

export const CompartmentComponent = ({ compartmentMode, compartmentSetpoint, index }: Props) => {
  const { t } = useTranslation();

  const { userSettings } = useUserSettings();
  const { temperature } = userSettings;

  const getTemperatureValue = (value: number) => (temperature === 'C' ? value : toFahrenheit(value));

  return (
    <Grid container mb={2.5} maxWidth={380}>
      <Grid item xs={9.5} maxHeight={66}>
        <TextField
          label={`${t('asset.compartment')} ${index}`}
          id={`compartment${index}Mode`}
          name={`compartment${index}Mode`}
          InputProps={{
            readOnly: true,
          }}
          size="small"
          value={translateOperatingMode(t, compartmentMode ?? null)}
          sx={{
            '& .MuiFilledInput-root': {
              borderRight: 'none',
              borderBottomRightRadius: 0,
              borderTopRightRadius: 0,
              lineHeight: 1.25,
              paddingTop: '19px',
            },
            maxHeight: '100%',
          }}
          fullWidth
          multiline
          maxRows={2}
        />
      </Grid>
      <Grid item xs={2.5} borderLeft="1px solid" borderColor="addition.divider" maxHeight={66}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          sx={{ backgroundColor: 'action.hover' }}
          borderRadius="0 4px 4px 0"
        >
          <Typography variant="body1">
            {`${isNil(compartmentSetpoint) ? '' : getTemperatureValue(compartmentSetpoint)} º${temperature}`}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

CompartmentComponent.displayName = 'CompartmentComponent';
