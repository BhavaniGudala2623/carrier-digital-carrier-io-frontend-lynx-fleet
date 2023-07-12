import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';
import { FC } from 'react';

export const LynxLogoIcon: FC<SvgIconProps> = ({ fill, ...rest }) => {
  const fillColor = fill || '#152C73';

  return (
    <SvgIcon
      width="34"
      height="34"
      viewBox="0 0 48 48"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M14.375 30.6875V12H8V35.9999H21.5405L24.9999 30.6875H14.375Z" fill={fillColor} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.8142 12H40.9999L34.3458 21.7888L30.7513 16.5059L33.8142 12ZM20.5131 12.0001H18.5L26.1571 23.2645L17.5 35.9999H19.5L28.1514 23.2858L20.5131 12.0001ZM30.7603 30.0362L34.8142 36H41.9999L34.3591 24.7597L30.7603 30.0362Z"
        fill={fillColor}
      />
      <path
        d="M25.6854 12H18.513L26.1514 23.2858L17.5 35.9999H24.6926L33.3644 23.2858L25.6854 12Z"
        fill={fillColor}
      />
    </SvgIcon>
  );
};
