import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const EmptyIcon: FC<SvgIconProps> = ({
  width = '13',
  height = '13',
  fill = 'none',
  viewBox = '0 0 14 15',
  ...rest
}) => <SvgIcon viewBox={viewBox} style={{ width, height, fill, boxSizing: 'border-box' }} {...rest} />;
