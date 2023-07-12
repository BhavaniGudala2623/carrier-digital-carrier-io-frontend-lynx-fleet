import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const GeolocationIcon: FC<SvgIconProps> = (props) => (
  <SvgIcon
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.3332 13.3333C12.111 13.3333 11.111 12.3333 11.111 11.1111C11.111 9.88883 12.111 8.88883 13.3332 8.88883C14.5554 8.88883 15.5554 9.88883 15.5554 11.1111C15.5554 12.3333 14.5554 13.3333 13.3332 13.3333ZM19.9999 11.3333C19.9999 7.29995 17.0554 4.44439 13.3332 4.44439C9.611 4.44439 6.66656 7.29995 6.66656 11.3333C6.66656 13.9333 8.83322 17.3777 13.3332 21.4888C17.8332 17.3777 19.9999 13.9333 19.9999 11.3333ZM13.3332 2.22217C17.9999 2.22217 22.2221 5.79995 22.2221 11.3333C22.2221 15.0222 19.2554 19.3888 13.3332 24.4444C7.411 19.3888 4.44434 15.0222 4.44434 11.3333C4.44434 5.79995 8.66656 2.22217 13.3332 2.22217Z"
      fill="#424242"
    />
  </SvgIcon>
);