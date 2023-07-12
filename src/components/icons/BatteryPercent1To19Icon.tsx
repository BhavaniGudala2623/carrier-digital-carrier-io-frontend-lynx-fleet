import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const BatteryPercent1To19Icon: FC<SvgIconProps> = ({
  width = '24',
  height = '24',
  fill = 'none',
  viewBox = '0 0 24 24',
  ...rest
}) => (
  <SvgIcon viewBox={viewBox} fill={fill} style={{ width, height }} {...rest}>
    <mask
      id="mask0_509_102830"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <rect width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_509_102830)">
      <path
        d="M8 22C7.71667 22 7.479 21.904 7.287 21.712C7.09567 21.5207 7 21.2833 7 21V5C7 4.71667 7.09567 4.479 7.287 4.287C7.479 4.09567 7.71667 4 8 4H10V3C10 2.71667 10.096 2.479 10.288 2.287C10.4793 2.09567 10.7167 2 11 2H13C13.2833 2 13.521 2.09567 13.713 2.287C13.9043 2.479 14 2.71667 14 3V4H16C16.2833 4 16.5207 4.09567 16.712 4.287C16.904 4.479 17 4.71667 17 5V21C17 21.2833 16.904 21.5207 16.712 21.712C16.5207 21.904 16.2833 22 16 22H8ZM9 16H15V6H9V16Z"
        fill="#E31B0C"
      />
    </g>
  </SvgIcon>
);
