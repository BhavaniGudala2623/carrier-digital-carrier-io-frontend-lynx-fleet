import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const FrFlagIcon = (props: SvgIconProps) => (
  <SvgIcon
    {...props}
    width="21"
    height="15"
    viewBox="0 0 21 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <mask id="mask0_3_152" maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="15">
      <path
        d="M19 0H2C0.89543 0 0 0.89543 0 2V13C0 14.1046 0.89543 15 2 15H19C20.1046 15 21 14.1046 21 13V2C21 0.89543 20.1046 0 19 0Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask0_3_152)">
      <path
        d="M19 0H2C0.89543 0 0 0.89543 0 2V13C0 14.1046 0.89543 15 2 15H19C20.1046 15 21 14.1046 21 13V2C21 0.89543 20.1046 0 19 0Z"
        fill="white"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M0 0H7V15H0V0Z" fill="#001C98" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14 0H21V15H14V0Z" fill="#F02532" />
    </g>
  </SvgIcon>
);
