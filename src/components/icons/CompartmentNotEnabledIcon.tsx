import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';
import { forwardRef } from 'react';

export const CompartmentNotEnabledIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
  <SvgIcon
    {...props}
    ref={ref}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    sx={{ fill: 'none' }}
  >
    <rect
      x="-0.8"
      y="0.8"
      width="4.4"
      height="4.4"
      rx="2.2"
      transform="matrix(-1 0 0 1 9.43906 13.6218)"
      stroke="black"
      strokeWidth="1.6"
    />
    <path d="M3.03516 9.08911H8.14551" stroke="black" strokeWidth="1.6" />
    <path d="M3.00293 2.99951L17.0029 19.0001" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M14.0273 15.7778L10.4214 15.7778" stroke="black" strokeWidth="1.6" />
    <path
      d="M5.66529 15.7067H3.50293C3.22679 15.7067 3.00293 15.4828 3.00293 15.2067V7.19043C3.00293 6.08586 3.89836 5.19043 5.00293 5.19043L5.0685 5.19043"
      stroke="black"
      strokeWidth="1.6"
    />
    <path
      d="M7.81982 5.4834L14.9882 5.4834C16.0927 5.4834 16.9882 6.37883 16.9882 7.4834V15.2646C16.9882 15.5407 17.212 15.7646 17.4882 15.7646H20.742C21.0182 15.7646 21.242 15.5407 21.242 15.2646V14.0028"
      stroke="black"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M11.0762 8.21636C10.6343 8.21636 10.2762 8.57453 10.2762 9.01636C10.2762 9.45819 10.6343 9.81636 11.0762 9.81636V8.21636ZM17.0334 8.21636H11.0762V9.81636H17.0334V8.21636Z"
      fill="black"
    />
  </SvgIcon>
));
