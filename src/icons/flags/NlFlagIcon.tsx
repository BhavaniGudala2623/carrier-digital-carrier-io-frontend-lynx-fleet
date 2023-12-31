import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const NlFlagIcon = (props: SvgIconProps) => (
  <SvgIcon
    {...props}
    width="21"
    height="15"
    viewBox="0 0 21 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <mask id="mask0_3_80" maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="15">
      <path
        d="M19 0H2C0.89543 0 0 0.89543 0 2V13C0 14.1046 0.89543 15 2 15H19C20.1046 15 21 14.1046 21 13V2C21 0.89543 20.1046 0 19 0Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask0_3_80)">
      <path
        d="M19 0H2C0.89543 0 0 0.89543 0 2V13C0 14.1046 0.89543 15 2 15H19C20.1046 15 21 14.1046 21 13V2C21 0.89543 20.1046 0 19 0Z"
        fill="white"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M0 10H21V15H0V10Z" fill="#1E448D" />
      <path fillRule="evenodd" clipRule="evenodd" d="M0 0H21V5H0V0Z" fill="#B01923" />
    </g>
  </SvgIcon>
);
