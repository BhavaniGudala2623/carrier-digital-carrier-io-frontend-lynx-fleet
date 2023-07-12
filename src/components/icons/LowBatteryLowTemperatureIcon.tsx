import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const LowBatteryLowTemperatureIcon: FC<SvgIconProps> = ({
  width = '24px',
  height = '24px',
  fill = '#0B79D0',
  ...rest
}) => (
  <SvgIcon style={{ boxSizing: 'border-box', width, height, fill }} {...rest}>
    <mask
      id="mask0_2393_228944"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <rect width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_2393_228944)">
      <path
        d="M7.98901 22C7.69597 22 7.45788 21.9067 7.27473 21.7202C7.09158 21.5344 7 21.3085 7 21.0426V4.89894C7 4.61525 7.09158 4.38475 7.27473 4.20745C7.45788 4.03014 7.69597 3.94149 7.98901 3.94149H9.96703V2.95745C9.96703 2.69149 10.0634 2.46525 10.256 2.27872C10.448 2.09291 10.6813 2 10.956 2H13.044C13.3187 2 13.5524 2.09291 13.7451 2.27872C13.937 2.46525 14.033 2.69149 14.033 2.95745V3.94149H16.011C16.304 3.94149 16.5421 4.03014 16.7253 4.20745C16.9084 4.38475 17 4.61525 17 4.89894V21.0426C17 21.3085 16.9084 21.5344 16.7253 21.7202C16.5421 21.9067 16.304 22 16.011 22H7.98901ZM8.64835 16.1489H15.3516V5.51064H8.64835V16.1489Z"
        fill={fill}
      />
    </g>
  </SvgIcon>
);
