import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const BatteryManagementCloseIcon: FC<SvgIconProps> = ({
  width = '12',
  height = '12',
  fill = 'none',
  viewBox = '0 0 12 12',
  ...rest
}) => (
  <SvgIcon viewBox={viewBox} style={{ width, height, fill, boxSizing: 'border-box' }} {...rest}>
    <path
      d="M11.2496 0.757943C10.9246 0.432943 10.3996 0.432943 10.0746 0.757943L5.99961 4.82461L1.92461 0.749609C1.59961 0.424609 1.07461 0.424609 0.749609 0.749609C0.424609 1.07461 0.424609 1.59961 0.749609 1.92461L4.82461 5.99961L0.749609 10.0746C0.424609 10.3996 0.424609 10.9246 0.749609 11.2496C1.07461 11.5746 1.59961 11.5746 1.92461 11.2496L5.99961 7.17461L10.0746 11.2496C10.3996 11.5746 10.9246 11.5746 11.2496 11.2496C11.5746 10.9246 11.5746 10.3996 11.2496 10.0746L7.17461 5.99961L11.2496 1.92461C11.5663 1.60794 11.5663 1.07461 11.2496 0.757943Z"
      fill="black"
      fillOpacity="0.54"
    />
  </SvgIcon>
);
