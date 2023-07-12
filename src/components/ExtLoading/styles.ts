import { CSSProperties } from 'react';

import { Z_INDEXES } from '@/constants';

export const styles: { [key: string]: CSSProperties } = {
  paper: {
    width: '130px',
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0.75rem',
    borderRadius: '0.42rem',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    textAlign: 'center',
    lineHeight: '1.5',
    fontSize: '1rem',
    boxShadow: '0px 3px 12px 0px rgb(0 0 0 / 10%)',
    zIndex: Z_INDEXES.modal,
  },
};
