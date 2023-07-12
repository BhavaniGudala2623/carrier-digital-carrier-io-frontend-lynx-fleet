import { CSSProperties } from 'react';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

export const styles: { [key: string]: CSSProperties } = {
  hint: {
    color: fleetThemeOptions.palette.text.disabled,
  },
  hintKbd: {
    padding: '0.2rem 0.4rem',
    fontSize: '0.5rem',
    borderRadius: '0.28rem',
    color: fleetThemeOptions.palette.text.secondary,
    backgroundColor: fleetThemeOptions.palette.action.disabled,
  },
};
