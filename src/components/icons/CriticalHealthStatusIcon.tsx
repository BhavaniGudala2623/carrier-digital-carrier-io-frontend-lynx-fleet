import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';
import { FC, forwardRef } from 'react';

export const CriticalHealthStatusIcon: FC<SvgIconProps> = forwardRef<SVGSVGElement, SvgIconProps>(
  (props, ref) => (
    <SvgIcon ref={ref} {...props} viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.664062 13.3346H15.3307L7.9974 0.667969L0.664062 13.3346ZM8.66406 11.3346H7.33073V10.0013H8.66406V11.3346ZM8.66406 8.66797H7.33073V6.0013H8.66406V8.66797Z"
        fill="#F44336"
      />
    </SvgIcon>
  )
);
