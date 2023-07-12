import React, { useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import { BatterySOCStats } from '@carrier-io/lynx-fleet-types';

import { CARD_TYPES } from '../constants';
import { getStateOfChargeHasError, getStateOfChargedataIsLoading } from '../../../stores';
import { updateSelectedTab } from '../../../stores/batteryManagement/batteryManagementAction';

import { SocCardMetadata } from './SocCardMetaData/SocCardMetadata';

import { useAppDispatch, useAppSelector } from '@/stores';
import { BatteryManagementTabs } from '@/features/battery-management/types';

export const SocCards = ({ cardData }: { cardData: BatterySOCStats | undefined }) => {
  const dispatch = useAppDispatch();

  const [cardType, setCardType] = useState<string>('');

  const isLoading = useAppSelector(getStateOfChargedataIsLoading);
  const isError = useAppSelector(getStateOfChargeHasError);

  const handleCardClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!isLoading && !isError) {
      const {
        currentTarget: { id: filterType = '' },
      } = ev;
      setCardType(filterType);
      updateSelectedTab(dispatch, BatteryManagementTabs.ElectricAssetsTabView, filterType);
    }
  };
  const isDisabled = (data: BatterySOCStats | undefined, cardName: string) => data && !data[cardName].count;
  const isActive = (data: BatterySOCStats | undefined, cardName: string) =>
    cardType === cardName && data && data[cardName]?.count;

  return (
    <>
      {CARD_TYPES.map((val) => (
        <Box className="soc-card-container" key={val}>
          <Paper
            className={`soc-card ${val} ${isDisabled(cardData, val) ? 'disabled' : ''}${
              isActive(cardData, val) ? 'active-card' : ''
            }`}
            variant="outlined"
            data-testid={`${val}-widget`}
            key={val}
            id={val}
            onClick={handleCardClick}
          >
            <SocCardMetadata cardData={cardData} cardType={val} />
          </Paper>
        </Box>
      ))}
    </>
  );
};
