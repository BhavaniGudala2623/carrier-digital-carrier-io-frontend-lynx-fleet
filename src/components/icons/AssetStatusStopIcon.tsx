import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';
import { forwardRef } from 'react';

export const AssetStatusStopIcon = forwardRef<SVGSVGElement, SvgIconProps>((props: SvgIconProps, ref) => (
  <SvgIcon
    ref={ref}
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="8.415"
      y="11.5849"
      width="7.17"
      height="0.83"
      rx="0.415"
      fill="black"
      stroke="black"
      strokeWidth="0.83"
    />
    <path
      d="M8.47514 3.57331L15.466 3.54907L20.4265 8.47524L20.4507 15.4661L15.5245 20.4266L8.53365 20.4508L3.57321 15.5246L3.54898 8.53375L8.47514 3.57331ZM8.1852 3.57431L8.18572 3.57431C8.18555 3.57431 8.18537 3.57431 8.18519 3.57431L8.18277 2.87432L8.1852 3.57431ZM3.57422 15.8146L3.57422 15.8141C3.57422 15.8142 3.57422 15.8144 3.57422 15.8146L2.87422 15.817L3.57422 15.8146ZM15.3202 20.6323C15.3205 20.632 15.3208 20.6317 15.3211 20.6314L15.3202 20.6323L15.3202 20.6323ZM15.8132 20.4256C15.8136 20.4256 15.8141 20.4256 15.8145 20.4256L15.8145 20.4256L15.8132 20.4256ZM20.6322 8.67958C20.6319 8.67927 20.6316 8.67895 20.6313 8.67863L20.6322 8.67955L20.6322 8.67958ZM20.4255 8.1866C20.4255 8.18615 20.4255 8.1857 20.4255 8.18525L20.4255 8.18529L20.4255 8.1866Z"
      stroke="black"
      fill="none"
      strokeWidth="1.6"
    />
  </SvgIcon>
));
