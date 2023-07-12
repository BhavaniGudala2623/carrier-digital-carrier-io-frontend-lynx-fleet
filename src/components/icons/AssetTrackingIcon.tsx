import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';
import { FC } from 'react';

export const AssetTrackingIcon: FC<SvgIconProps> = (props) => (
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
      d="M4 17V4H13V7.5V12V14V17H9.23611C9.71115 17.5308 10 18.2316 10 19H14C14 18.1115 14.3863 17.3132 15 16.7639V14H20V17H19.2361C19.7111 17.5308 20 18.2316 20 19H20.5C21.3284 19 22 18.3284 22 17.5V14V12V11.7085C22 11.3065 21.8789 10.9139 21.6525 10.5818L19.124 6.87333C18.7514 6.32692 18.1328 6 17.4715 6H15V3C15 2.44772 14.5523 2 14 2H3C2.44772 2 2 2.44772 2 3V18C2 18.5523 2.44772 19 3 19H4C4 18.2316 4.28885 17.5308 4.76389 17H4ZM15 12H20V11.7085L17.4715 8H15V12Z"
      fill="currentColor"
    />
    <circle cx="17" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="7" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
  </SvgIcon>
);
