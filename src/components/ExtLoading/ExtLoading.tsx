import { FC } from 'react';
import Paper from '@carrier-io/fds-react/Paper';

import { styles } from './styles';

interface Loading {
  text: string;
}

export const ExtLoading: FC<Loading> = ({ text }) => (
  <Paper
    style={styles.paper}
    sx={{
      backgroundColor: (theme) => theme.palette.background.paper,
      color: (theme) => theme.palette.text.secondary,
    }}
    square
  >
    {text}
  </Paper>
);
