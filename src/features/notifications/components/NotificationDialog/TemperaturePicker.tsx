import NumberInput from '@carrier-io/fds-react/patterns/NumberInput';

interface TemperaturePickerProps {
  value: number;
  onChange: (value: number) => void;
  lowerLimit?: number;
  upperLimit?: number;
  prefix?: string;
  step?: number;
}

export function TemperaturePicker({
  value,
  onChange,
  lowerLimit,
  upperLimit,
  prefix,
  step = 1,
}: TemperaturePickerProps) {
  return (
    <NumberInput
      prefix={`°${prefix}`}
      defaultValue={value || 0}
      onChange={onChange}
      step={step}
      lowerLimit={lowerLimit}
      upperLimit={upperLimit}
      showOutlinedButton
      sx={{ width: 148 }}
      placeholder=""
    />
  );
}
