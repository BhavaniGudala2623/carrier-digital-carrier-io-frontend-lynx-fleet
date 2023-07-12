import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import { BatterySOCStats } from '@carrier-io/lynx-fleet-types';

import { getStateOfCharge } from '../../stores';
import { StateOfChargeGraph } from '../StateOfChargeGraph';

import { SocCards } from './components/socCards';

import { useAppSelector } from '@/stores';

import './styles.scss';

export const StateOfChargeWidget = () => {
  const { t } = useTranslation();
  const cardData: BatterySOCStats | undefined = useAppSelector(getStateOfCharge);

  return (
    <Box className="soc-widget">
      <Typography variant="subtitle1" className="soc-card-title">
        {t('battery.management.battery.overview.Soc')}
      </Typography>
      <StateOfChargeGraph data={cardData} />
      <Box className="soc-cards" gap={1}>
        <SocCards cardData={cardData} />
      </Box>
    </Box>
  );
};
