import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';
import { FC } from 'react';

export const CompanyManagementIcon: FC<SvgIconProps> = (props) => (
  <SvgIcon
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 2C8.44772 2 8 2.44772 8 3V10H3C2.44772 10 2 10.4477 2 11V21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21V3C22 2.44772 21.5523 2 21 2H9ZM10 20H12V15C12 14.4477 12.4477 14 13 14H17C17.5523 14 18 14.4477 18 15V20H20V4H10V20ZM4 20H8V12H4V20ZM16 20H14V16H16V20Z"
      fill="currentColor"
    />
    <rect x="11" y="6" width="3" height="2" rx="1" fill="currentColor" />
    <rect x="16" y="6" width="3" height="2" rx="1" fill="currentColor" />
    <rect x="11" y="10" width="3" height="2" rx="1" fill="currentColor" />
    <rect x="16" y="10" width="3" height="2" rx="1" fill="currentColor" />
  </SvgIcon>
);
