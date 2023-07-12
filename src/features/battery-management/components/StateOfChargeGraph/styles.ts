import { SxProps, Theme } from '@carrier-io/fds-react/styles';
import { makeStyles } from '@mui/styles';
import { CSSProperties } from 'react';

export const graphStyles = makeStyles(() => ({
  graphRoot: {
    display: 'flex',
    height: '8px',
    overflow: 'hidden',
    borderRadius: '8px',
    margin: '20px 20px 0px 20px',
    gap: '4px',
  },
  emptyGraph: {
    display: 'flex',
    height: '8px',
    overflow: 'hidden',
    borderRadius: '8px',
    margin: '20px 20px 0px 20px',
    background: '#E8EAED',
  },
  shimmer: {
    color: 'grey',
    display: 'inline-block',
    WebkitMask: 'linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/300%100%',
    backgroundRepeat: 'no-repeat',
    fontSize: '50px',
  },
}));

export const graphAnimation = {
  animationName: 'move',
  animation: `move 2s infinite`,
  '@keyframes move': {
    '100%': {
      '-webkit-mask-position': 'left',
    },
  },
};

export const getGraphElementStyles = (
  chargingCount: number,
  activeCount: number,
  total: number,
  activeColor: string,
  chargingColor: string
): {
  elementBoxStyles: SxProps<Theme>;
  activeElementStyles: CSSProperties;
  chargingElementStyles: CSSProperties;
} => ({
  elementBoxStyles: {
    display: 'flex',
    flexGrow: '1',
    flexBasis: `${((chargingCount + activeCount) / total) * 100}%`,
  },
  activeElementStyles: {
    background: activeColor,
    flexBasis: `${(activeCount / total) * 100}%`,
    height: '8px',
    flexGrow: 1,
  },
  chargingElementStyles: {
    background: chargingColor,
    flexBasis: `${(chargingCount / total) * 100}%`,
    height: '8px',
    flexGrow: 1,
  },
});
