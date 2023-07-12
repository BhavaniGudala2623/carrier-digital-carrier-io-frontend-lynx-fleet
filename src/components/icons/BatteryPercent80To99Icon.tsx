import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const BatteryPercent80To99Icon: FC<SvgIconProps> = ({
  width = '24',
  height = '24',
  fill = 'none',
  viewBox = '0 0 24 24',
  ...rest
}) => (
  <SvgIcon viewBox={viewBox} fill={fill} style={{ width, height }} {...rest}>
    <mask
      id="mask0_509_102850"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="25"
      height="24"
    >
      <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_509_102850)">
      <path
        d="M8.5 22C8.21667 22 7.979 21.904 7.787 21.712C7.59567 21.5207 7.5 21.2833 7.5 21V5C7.5 4.71667 7.59567 4.479 7.787 4.287C7.979 4.09567 8.21667 4 8.5 4H10.5V3C10.5 2.71667 10.596 2.479 10.788 2.287C10.9793 2.09567 11.2167 2 11.5 2H13.5C13.7833 2 14.021 2.09567 14.213 2.287C14.4043 2.479 14.5 2.71667 14.5 3V4H16.5C16.7833 4 17.0207 4.09567 17.212 4.287C17.404 4.479 17.5 4.71667 17.5 5V21C17.5 21.2833 17.404 21.5207 17.212 21.712C17.0207 21.904 16.7833 22 16.5 22H8.5ZM9.5 8H15.5V6H9.5V8Z"
        fill="#3B873E"
      />
    </g>
  </SvgIcon>
);
