import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const UsFlagIcon = (props: SvgIconProps) => (
  <SvgIcon
    {...props}
    width="21"
    height="15"
    viewBox="0 0 21 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <mask id="a" height="15" maskUnits="userSpaceOnUse" width="21" x="0" y="0">
      <path
        d="m19 0h-17c-1.10457 0-2 .89543-2 2v11c0 1.1046.89543 2 2 2h17c1.1046 0 2-.8954 2-2v-11c0-1.10457-.8954-2-2-2z"
        fill="#fff"
      />
    </mask>
    <g mask="url(#a)">
      <path
        d="m19 0h-17c-1.10457 0-2 .89543-2 2v11c0 1.1046.89543 2 2 2h17c1.1046 0 2-.8954 2-2v-11c0-1.10457-.8954-2-2-2z"
        fill="#fff"
      />
      <g clipRule="evenodd" fillRule="evenodd">
        <path d="m0 0h9v7h-9z" fill="#444379" />
        <path
          d="m1 1v1h1v-1zm2 0v1h1v-1zm2 0v1h1v-1zm2 0v1h1v-1zm-1 1v1h1v-1zm-2 0v1h1v-1zm-2 0v1h1v-1zm-1 1v1h1v-1zm2 0v1h1v-1zm2 0v1h1v-1zm2 0v1h1v-1zm-6 2v1h1v-1zm2 0v1h1v-1zm2 0v1h1v-1zm2 0v1h1v-1zm-1-1v1h1v-1zm-2 0v1h1v-1zm-2 0v1h1v-1z"
          fill="#a7b6e7"
        />
        <path
          d="m9 0v1h12v-1zm0 2v1h12v-1zm0 2v1h12v-1zm0 2v1h12v-1zm-9 2v1h21v-1zm0 2v1h21v-1zm0 2v1h21v-1zm0 2v1h21v-1z"
          fill="#ed4c49"
        />
      </g>
    </g>
  </SvgIcon>
);
