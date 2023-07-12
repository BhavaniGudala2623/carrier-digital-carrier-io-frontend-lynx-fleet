import Box from '@carrier-io/fds-react/Box';
import { useRef, useState, useLayoutEffect } from 'react';
import { ValueFormatterParams } from '@ag-grid-community/core';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@carrier-io/fds-react';

import { useStyles } from '../components/styles';
import { EnrichedEventData } from '../types';

import { EventIcon } from './EventIcon';

import { SPACE_GAP, THRESHOLD_WIDTH } from '@/constants';

export const EventCellRenderer = (params: ValueFormatterParams<EnrichedEventData, string>) => {
  const textSizeRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0 });
  const { value, data, column } = params;

  const showTooltip = column.getActualWidth() - dimensions.width < THRESHOLD_WIDTH;

  const classes = useStyles();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (textSizeRef.current) {
      setDimensions({
        width: textSizeRef.current.offsetWidth,
      });
    }
  }, []);

  if (!value || !data) {
    return <span />;
  }

  const { position_longitude, position_latitude, sourceType } = data;

  if (!position_longitude || !position_latitude || !sourceType) {
    return <span />;
  }

  const currAddress = data.address;

  return (
    <Box display="flex" gap={1} height="50px">
      <EventIcon sourceType={sourceType} />
      <Box display="flex" flexDirection="column" justifyContent="start" ref={textSizeRef}>
        <div className={classes.topCellElement}>{value}</div>
        <div className={classes.bottomElement}>
          {data.address && !showTooltip && <span>{currAddress}</span>}
          {data.address && showTooltip && (
            <Tooltip
              enterDelay={100}
              enterNextDelay={0}
              enterTouchDelay={700}
              leaveDelay={0}
              leaveTouchDelay={1500}
              placement="top"
              title={data.address}
            >
              <span>{currAddress}</span>
            </Tooltip>
          )}
          {!data.address && (
            <span>
              {t('assets.asset.table.latitude')}:{SPACE_GAP}
              {position_latitude},{SPACE_GAP}
              {t('assets.asset.table.longitude')}:{SPACE_GAP}
              {position_longitude}
            </span>
          )}
        </div>
      </Box>
    </Box>
  );
};
