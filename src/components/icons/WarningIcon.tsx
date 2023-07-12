import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';
import { FC, forwardRef } from 'react';

export const WarningIcon: FC<SvgIconProps> = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
  <SvgIcon
    ref={ref}
    {...props}
    width="20"
    height="18"
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.47 17.5038H17.53C19.07 17.5038 20.03 15.8338 19.26 14.5038L11.73 1.49378C10.96 0.163777 9.04 0.163777 8.27 1.49378L0.739999 14.5038C-0.0300008 15.8338 0.929999 17.5038 2.47 17.5038ZM10 10.5038C9.45 10.5038 9 10.0538 9 9.50378V7.50378C9 6.95378 9.45 6.50378 10 6.50378C10.55 6.50378 11 6.95378 11 7.50378V9.50378C11 10.0538 10.55 10.5038 10 10.5038ZM11 14.5038H9V12.5038H11V14.5038Z"
      fill="#FFC107"
    />
  </SvgIcon>
));
