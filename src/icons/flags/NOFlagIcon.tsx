import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const NOFlagIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 22 16">
    <rect width="22" height="16" fill="#ba0c2f" />
    <g fill="#fff">
      <rect width="4" height="16" x="6" />
      <rect width="22" height="4" y="6" />
    </g>
    <g fill="#00205b">
      <rect width="2" height="16" x="7" />
      <rect width="22" height="2" y="7" />
    </g>
  </SvgIcon>
);
