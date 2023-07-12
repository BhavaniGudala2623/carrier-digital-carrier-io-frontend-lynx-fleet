import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Divider, SvgIconProps } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { BatterySOCStats } from '@carrier-io/lynx-fleet-types/dist/common/battery';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { SocSkeleton } from '../SocSkeleton/SocSkeleton';
import {
  CAPTION_MAPPER,
  CARD_RANGES,
  ICON_COLOR_MAPPER,
  ICON_MAPPERS,
  SOC_DETAILS_ORDER,
} from '../../constants';
import { getStateOfChargedataIsLoading } from '../../../../stores';

import { useAppSelector } from '@/stores';
import './styles.scss';

interface ISocCardMetadata {
  cardData: BatterySOCStats | undefined;
  cardType: string;
}

export const SocCardMetadata = ({ cardData, cardType }: ISocCardMetadata) => {
  const isLoading = useAppSelector(getStateOfChargedataIsLoading);
  const { t } = useTranslation();
  const { count, socDetails } = cardData?.[cardType] || {
    count: 0,
    socDetails: {},
  };

  const isDisabled = (value) => !value;

  const getSocCardIconAndRange = (
    Icon: FC<SvgIconProps>,
    assetCount: number,
    range: string,
    cardName: string
  ): JSX.Element => (
    <Box className="icon-count-range">
      <Icon />
      <Typography className={`count ${isDisabled(assetCount) ? 'disabled' : ''}`} variant="h6">
        {assetCount?.toLocaleString() || 0}
      </Typography>
      <Typography className={`${cardName}-card range`} variant="caption">
        {range}
      </Typography>
    </Box>
  );

  const getSocDetails = (
    Icon: FC<SvgIconProps>,
    socCount: number,
    caption: string,
    elementName: string
  ): JSX.Element => (
    <Box className="icon-count-caption" key={elementName}>
      <Icon
        fill={socCount ? ICON_COLOR_MAPPER[elementName] : fleetThemeOptions.palette.text.disabled}
        width="17"
        height="17"
      />
      <Typography className={`count ${isDisabled(socCount) && 'disabled'}`} variant="subtitle1">
        {socCount?.toLocaleString() || 0}
      </Typography>
      <Typography className={`caption ${isDisabled(count) && 'disabled'}`} variant="caption">
        {caption}
      </Typography>
    </Box>
  );

  return !isLoading ? (
    <Box className="soc-meta-data_container">
      <Typography className="title" variant="caption">
        {t(`battery.management.battery.overview.Soc.caption.${cardType}`)}
      </Typography>
      {getSocCardIconAndRange(ICON_MAPPERS[cardType], count, CARD_RANGES[cardType], cardType)}
      <Divider className="divider" light variant="fullWidth" />
      {SOC_DETAILS_ORDER.map((element) =>
        getSocDetails(ICON_MAPPERS[element], socDetails[element], CAPTION_MAPPER[element], element)
      )}
    </Box>
  ) : (
    <SocSkeleton />
  );
};
