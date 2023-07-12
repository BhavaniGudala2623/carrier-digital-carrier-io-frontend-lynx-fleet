import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const AlarmIcon: FC<SvgIconProps> = (props) => {
  const { fill } = props;

  return (
    <SvgIcon
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill={fill || 'black'}
        d="M1.725 14.5H14.275C15.5583 14.5 16.3583 13.1083 15.7167 12L9.44167 1.15834C8.8 0.0500041 7.2 0.0500041 6.55833 1.15834L0.283333 12C-0.358334 13.1083 0.441666 14.5 1.725 14.5ZM8 8.66667C7.54167 8.66667 7.16667 8.29167 7.16667 7.83334V6.16667C7.16667 5.70834 7.54167 5.33334 8 5.33334C8.45833 5.33334 8.83333 5.70834 8.83333 6.16667V7.83334C8.83333 8.29167 8.45833 8.66667 8 8.66667ZM8.83333 12H7.16667V10.3333H8.83333V12Z"
        fillOpacity="0.87"
      />
    </SvgIcon>
  );
};
