export const CommandTypes = Object.freeze({
  setpoint: 'Compartment Setpoint',
  c1_toggle: 'Toggle Compartment 1',
  c2_toggle: 'Toggle Compartment 2',
  c3_toggle: 'Toggle Compartment 3',
  defrost: 'Defrost Initiation',
  run_mode: 'Run Mode',
});

export const COMPARTMENT_SETPOINT_MAX_LIMIT_VALUE_IN_CELCIUS = 35;
export const COMPARTMENT_SETPOINT_MIN_LIMIT_VALUE_IN_CELCIUS = -30;
