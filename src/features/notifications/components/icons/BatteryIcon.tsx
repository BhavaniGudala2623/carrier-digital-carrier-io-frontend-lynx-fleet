import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const BatteryIcon: FC<SvgIconProps> = (props) => {
  const { fill } = props;

  return (
    <SvgIcon
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill={fill || 'black'}
        fillOpacity="0.87"
        d="M88,8a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,8ZM208,56V208a24.1,24.1,0,0,1-24,24H72a24.1,24.1,0,0,1-24-24V56A24.1,24.1,0,0,1,72,32H184A24.1,24.1,0,0,1,208,56Zm-88,76a8,8,0,0,0,16,0V92a8,8,0,0,0-16,0Zm20,36a12,12,0,1,0-12,12A12,12,0,0,0,140,168Z"
      />
    </SvgIcon>
  );
};
