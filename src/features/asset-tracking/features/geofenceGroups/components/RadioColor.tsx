import { ChangeEventHandler } from 'react';
import { Check, Clear } from '@mui/icons-material';
import { colors, styled } from '@mui/material';

const { lightBlue } = colors;

const checkIconSx = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#fff',
};

const LabelStyled = styled('label')({
  position: 'relative',
  display: 'inline-block',
  width: 30,
  height: 30,
  borderRadius: 4,
  verticalAlign: 'middle',
  marginRight: 13,
  cursor: 'pointer',
});

interface RadioColorProps {
  color: string;
  name: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
  used: boolean;
}

export function RadioColor({ name, checked, used, color, handleChange }: RadioColorProps) {
  let statusIcon: JSX.Element | null = null;
  let statusOpacity = 1;

  if (checked) {
    statusIcon = <Check fontSize="small" sx={checkIconSx} />;
  } else if (used) {
    statusIcon = <Clear fontSize="small" sx={checkIconSx} />;
    statusOpacity = 0.3;
  }

  return (
    <LabelStyled
      htmlFor={color.slice(1)}
      key={color}
      sx={checked ? { boxShadow: `0px 1px 5px 0px ${lightBlue[500]}` } : undefined}
      style={{ backgroundColor: color, opacity: statusOpacity }}
    >
      <input
        id={color.slice(1)}
        name="color"
        onChange={handleChange}
        value={name}
        checked={checked}
        type="radio"
        style={{ width: 0, height: 0, opacity: 0 }}
        disabled={used}
      />
      {statusIcon}
    </LabelStyled>
  );
}
