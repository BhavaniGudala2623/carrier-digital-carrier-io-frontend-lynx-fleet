import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const TruckIcon: FC<SvgIconProps> = (props) => (
  <SvgIcon
    {...props}
    width="22"
    height="16"
    viewBox="0 0 22 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.5 4H16V2C16 0.9 15.1 0 14 0H2C0.9 0 0 0.9 0 2V11C0 12.1 0.9 13 2 13C2 14.66 3.34 16 5 16C6.66 16 8 14.66 8 13H14C14 14.66 15.34 16 17 16C18.66 16 20 14.66 20 13H21C21.55 13 22 12.55 22 12V8.67C22 8.24 21.86 7.82 21.6 7.47L19.3 4.4C19.11 4.15 18.81 4 18.5 4ZM5 14C4.45 14 4 13.55 4 13C4 12.45 4.45 12 5 12C5.55 12 6 12.45 6 13C6 13.55 5.55 14 5 14ZM18.5 5.5L20.46 8H16V5.5H18.5ZM17 14C16.45 14 16 13.55 16 13C16 12.45 16.45 12 17 12C17.55 12 18 12.45 18 13C18 13.55 17.55 14 17 14Z"
      fill="black"
      fillOpacity="0.87"
    />
  </SvgIcon>
);
