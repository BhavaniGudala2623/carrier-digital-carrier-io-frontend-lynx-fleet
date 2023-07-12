import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const BatteryIcon: FC<SvgIconProps> = (props) => (
  <SvgIcon
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.0585 3.33317H11.6668V2.49984C11.6668 2.0415 11.2918 1.6665 10.8335 1.6665H9.16683C8.7085 1.6665 8.3335 2.0415 8.3335 2.49984V3.33317H6.94183C6.3335 3.33317 5.8335 3.83317 5.8335 4.4415V17.2165C5.8335 17.8332 6.3335 18.3332 6.95016 18.3332H13.0502C13.6668 18.3332 14.1668 17.8332 14.1668 17.2248V4.4415C14.1668 3.83317 13.6668 3.33317 13.0585 3.33317ZM10.8335 14.9998H9.16683V13.3332H10.8335V14.9998ZM10.8335 10.8332C10.8335 11.2915 10.4585 11.6665 10.0002 11.6665C9.54183 11.6665 9.16683 11.2915 9.16683 10.8332V8.33317C9.16683 7.87484 9.54183 7.49984 10.0002 7.49984C10.4585 7.49984 10.8335 7.87484 10.8335 8.33317V10.8332Z"
      fill="black"
      fillOpacity="0.87"
    />
  </SvgIcon>
);
