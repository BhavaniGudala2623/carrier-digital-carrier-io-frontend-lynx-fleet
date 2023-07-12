import Box from '@carrier-io/fds-react/Box';
import ToggleButton from '@carrier-io/fds-react/ToggleButton';
import ToggleButtonGroup from '@carrier-io/fds-react/ToggleButtonGroup';
import Typography from '@carrier-io/fds-react/Typography';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { styled } from '@mui/material/styles';
import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

export const ToggleButtonGroupStyled = styled(ToggleButtonGroup)({
  alignItems: 'center',
  '& .MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium': {
    width: 30,
    height: 30,
    fontSize: 11,
    textTransform: 'inherit',
  },
});

interface IProps {
  label: string;
  value: string;
  name?: string;
  fieldName: string;
  onChange: (event: MouseEvent<HTMLElement>) => void;
  toggleOptions: { icon: JSX.Element; value: string }[];
  disabled?: boolean;
}

export const Measurement = (props: IProps) => {
  const { t } = useTranslation();
  const { label, value, name, fieldName, onChange, toggleOptions, disabled = false } = props;

  const labelName = t(label);

  const handleChangeToggle = (event: MouseEvent<HTMLElement>, newValue: Maybe<string>) => {
    if (value !== newValue && newValue !== null) {
      // eslint-disable-next-line no-param-reassign
      (event.target as HTMLButtonElement).name = fieldName;
      // eslint-disable-next-line no-param-reassign
      (event.target as HTMLButtonElement).value = newValue;
      onChange(event);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" mb={3}>
      <Box display="flex" flexDirection="column">
        <Typography variant="body2" color="text.secondary">
          {labelName}
        </Typography>
        <Typography variant="subtitle1" color="text.primary">
          {(name && t(name)) || value}
        </Typography>
      </Box>
      <ToggleButtonGroupStyled
        aria-label={t(label)}
        value={value}
        exclusive
        onChange={handleChangeToggle}
        disabled={disabled}
      >
        <ToggleButton value={toggleOptions[0].value}>{toggleOptions[0].icon}</ToggleButton>
        <ToggleButton value={toggleOptions[1].value}>{toggleOptions[1].icon}</ToggleButton>
      </ToggleButtonGroupStyled>
    </Box>
  );
};

Measurement.displayName = 'Measurement';
