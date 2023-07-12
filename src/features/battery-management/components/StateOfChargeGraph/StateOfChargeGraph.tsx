import Box from '@carrier-io/fds-react/Box';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { BatterySOCStats } from '@carrier-io/lynx-fleet-types';
import { amber } from '@mui/material/colors';

import { SOC_GRAPH_NORMAL_INUSE_COLOR } from '../../constants';
import { getGraphData } from '../../utils';

import { graphAnimation, getGraphElementStyles, graphStyles } from './styles';

export interface IStateOfChargeGraphProps {
  low: { charging: number; inUse: number };
  normal: { charging: number; inUse: number };
  high: { charging: number; inUse: number };
}

interface IGraphElemetsProps {
  activeCount: number;
  chargingCount: number;
  activeColor: string;
  chargingColor: string;
  total: number;
}

const GraphElements = (props: IGraphElemetsProps) => {
  const { activeCount, chargingCount, activeColor, chargingColor, total } = props;
  const classes = graphStyles();
  const { elementBoxStyles, activeElementStyles, chargingElementStyles } = getGraphElementStyles(
    chargingCount,
    activeCount,
    total,
    activeColor,
    chargingColor
  );

  return activeCount || chargingCount ? (
    <Box sx={elementBoxStyles}>
      {activeCount ? <Box style={activeElementStyles} /> : null}
      {chargingCount ? (
        <Box style={chargingElementStyles} sx={graphAnimation} className={classes.shimmer} />
      ) : null}
    </Box>
  ) : null;
};

export const StateOfChargeGraph = ({ data }: { data: BatterySOCStats | undefined }) => {
  const classes = graphStyles();

  if (!data) {
    return null;
  }

  const {
    lowChargingCount,
    lowActiveCount,
    normalChargingCount,
    normalActiveCount,
    highChargingCount,
    highActiveCount,
    total,
  } = getGraphData(data);

  if (total === 0) {
    return <Box className={classes.emptyGraph} />;
  }

  return (
    <Box className={classes.graphRoot}>
      <GraphElements
        activeColor={fleetThemeOptions.palette.error.dark}
        chargingColor={fleetThemeOptions.palette.error.light}
        chargingCount={lowChargingCount}
        activeCount={lowActiveCount}
        total={total}
      />
      <GraphElements
        activeColor={SOC_GRAPH_NORMAL_INUSE_COLOR}
        chargingColor={amber[300]}
        chargingCount={normalChargingCount}
        activeCount={normalActiveCount}
        total={total}
      />
      <GraphElements
        activeColor={fleetThemeOptions.palette.success.dark}
        chargingColor={fleetThemeOptions.palette.success.light}
        chargingCount={highChargingCount}
        activeCount={highActiveCount}
        total={total}
      />
    </Box>
  );
};
