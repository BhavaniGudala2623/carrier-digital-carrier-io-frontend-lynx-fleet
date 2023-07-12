import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const SEFlagIcon = (props: SvgIconProps) => (
  <SvgIcon
    {...props}
    width="21"
    height="15"
    viewBox="0 0 16 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="#006aa7" d="M0,0H16V10H0Z" />
    <path fill="#fecc00" d="M0,4H5V0H7V4H16V6H7V10H5V6H0Z" />
  </SvgIcon>
);
