import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const DoorIcon: FC<SvgIconProps> = (props) => {
  const { fill } = props;

  return (
    <SvgIcon
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill={fill || 'black'}
        fillOpacity="0.87"
        d="M12 2.33335V15.6667H1.99998V2.33335H12ZM12 0.666687H1.99998C1.08331 0.666687 0.333313 1.41669 0.333313 2.33335V17.3334H13.6666V2.33335C13.6666 1.41669 12.9166 0.666687 12 0.666687ZM9.91665 7.75002C9.22498 7.75002 8.66665 8.30835 8.66665 9.00002C8.66665 9.69169 9.22498 10.25 9.91665 10.25C10.6083 10.25 11.1666 9.69169 11.1666 9.00002C11.1666 8.30835 10.6083 7.75002 9.91665 7.75002Z"
      />
    </SvgIcon>
  );
};
