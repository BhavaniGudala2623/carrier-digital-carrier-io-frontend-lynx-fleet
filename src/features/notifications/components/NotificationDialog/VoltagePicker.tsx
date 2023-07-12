import NumberInput from '@carrier-io/fds-react/patterns/NumberInput';

interface PercentagePickerProps {
  value: number;
  onChange: (value: number) => void;
  lowerLimit?: number;
  upperLimit?: number;
  step?: number;
}

export function VoltagePicker({ value, onChange, lowerLimit, upperLimit, step = 1 }: PercentagePickerProps) {
  return (
    <NumberInput
      defaultValue={value || 0}
      prefix="V"
      onChange={onChange}
      step={step}
      lowerLimit={lowerLimit}
      upperLimit={upperLimit}
      showOutlinedButton
      sx={{ width: 118 }}
      placeholder=""
    />
  );
}
