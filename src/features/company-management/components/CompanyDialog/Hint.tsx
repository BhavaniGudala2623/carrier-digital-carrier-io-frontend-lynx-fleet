import { FC } from 'react';
import Typography from '@carrier-io/fds-react/Typography';

import { styles } from './styles';

export const Hint: FC = () => {
  const kbdStyleString = Object.entries(styles.hintKbd)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');

  return (
    <Typography
      style={styles.hint}
      variant="caption"
      dangerouslySetInnerHTML={{
        __html: `Use <kbd style="${kbdStyleString}">CTRL</kbd>+click or <kbd style="${kbdStyleString}">SHIFT</kbd>+click for extended multiselect.`,
      }}
    />
  );
};
