import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const TemperatureIcon: FC<SvgIconProps> = (props) => {
  const { fill } = props;

  return (
    <SvgIcon
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill={fill || 'black'}
        fillOpacity="0.87"
        d="M7.49998 9.83335V3.16669C7.49998 1.78335 6.38331 0.666687 4.99998 0.666687C3.61665 0.666687 2.49998 1.78335 2.49998 3.16669V9.83335C1.49165 10.5917 0.833313 11.8084 0.833313 13.1667C0.833313 15.4667 2.69998 17.3334 4.99998 17.3334C7.29998 17.3334 9.16665 15.4667 9.16665 13.1667C9.16665 11.8084 8.50831 10.5917 7.49998 9.83335ZM4.16665 3.16669C4.16665 2.70835 4.54165 2.33335 4.99998 2.33335C5.45831 2.33335 5.83331 2.70835 5.83331 3.16669H4.99998V4.00002H5.83331V5.66669H4.99998V6.50002H5.83331V8.16669H4.16665V3.16669Z"
      />
    </SvgIcon>
  );
};
