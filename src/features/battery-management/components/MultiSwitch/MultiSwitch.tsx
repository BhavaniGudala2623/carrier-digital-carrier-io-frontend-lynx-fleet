import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { SxProps, Theme } from '@carrier-io/fds-react/styles';
import { useState } from 'react';

interface ImultiSwitchOptions {
  id: number | string;
  value: string;
}
interface ImultiSwitchProps {
  items: ImultiSwitchOptions[];
  onChangeSwitch: (id: number | string, value: string) => void;
}

export const MultiSwitch = ({ items, onChangeSwitch }: ImultiSwitchProps) => {
  const [selectedSwitchIndex, setSelectedSwitchIndex] = useState<number>(0);

  if (items.length < 1) {
    return null;
  }

  const onChange = (index: number, id: number | string, value: string) => {
    setSelectedSwitchIndex(index);
    onChangeSwitch(id, value);
  };

  const deSelectedState: SxProps<Theme> | undefined = {
    color: 'action.active',
    border: '0.5px solid',
    borderRadius: '6px',
  };

  const selectedState: SxProps<Theme> | undefined = {
    p: 1,
    backgroundColor: 'white',
    border: '0.5px solid',
    borderRadius: '6px',
    padding: '3px 8px',
    boxShadow:
      '-1px -1px 1px rgba(0, 56, 255, 0.08), 1px 1px 1px rgba(0, 56, 255, 0.08), 2px 2px 8px 1px rgba(0, 56, 255, 0.15), -2px -2px 8px 1px rgba(0, 56, 255, 0.15)',
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(38, 50, 56, 0.06)',
        borderRadius: '8px',
        padding: '2px',
        display: 'flex',
        gap: '10px',
      }}
    >
      {items.map((item, index) => (
        <Button
          key={item.id}
          onClick={() => onChange(index, item.id, item.value)}
          variant={index === selectedSwitchIndex ? 'outlined' : 'text'}
          sx={index === selectedSwitchIndex ? selectedState : deSelectedState}
        >
          {item.value}
        </Button>
      ))}
    </Box>
  );
};
