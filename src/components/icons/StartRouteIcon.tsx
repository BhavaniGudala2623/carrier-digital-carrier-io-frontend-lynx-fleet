import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const StartRouteIcon: FC<SvgIconProps> = (props) => (
  <SvgIcon
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 10.1678C4 5.18869 7.79022 2 12 2C16.2098 2 20 5.18869 20 10.1678C20 11.6853 19.4105 13.4291 18.1 15.4225C16.7918 17.4125 14.8021 19.5943 12.0987 21.9676C12.0747 21.9877 12.0428 22 12.0056 22C11.9683 22 11.9363 21.9876 11.9123 21.9675C9.20318 19.594 7.21066 17.4121 5.90114 15.4221C4.58949 13.4289 4 11.6852 4 10.1678Z"
      fill="white"
      stroke="#424242"
      strokeWidth="2"
      strokeMiterlimit="16"
    />
    <path
      d="M8.78552 13L11.6115 6.655H12.3855L15.2205 13H14.2665L13.6005 11.452H10.3875L9.73052 13H8.78552ZM11.9895 7.69L10.7205 10.696H13.2855L12.0075 7.69H11.9895Z"
      fill="#424242"
    />
  </SvgIcon>
);
