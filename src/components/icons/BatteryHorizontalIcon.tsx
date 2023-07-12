import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const BatteryHorizontalIcon: FC<SvgIconProps> = ({
  width = '34px',
  height = '34px',
  fill = 'none',
  ...rest
}) => (
  <SvgIcon style={{ width, height, fill, boxSizing: 'border-box' }} {...rest}>
    <path
      d="M2 7.98901C2 7.69597 2.09602 7.45788 2.28807 7.27472C2.48085 7.09157 2.71468 7 2.98956 7L19.6747 7C19.9679 7 20.2061 7.09157 20.3894 7.27472C20.5726 7.45788 20.6643 7.69597 20.6643 7.98901V9.96703H22.0104C22.2853 9.96703 22.5191 10.0634 22.7119 10.256C22.904 10.448 23 10.6813 23 10.956V13.044C23 13.3187 22.904 13.5524 22.7119 13.7451C22.5191 13.937 22.2853 14.033 22.0104 14.033H20.6643V16.011C20.6643 16.304 20.5726 16.5421 20.3894 16.7253C20.2061 16.9084 19.9679 17 19.6747 17L2.98956 17C2.71468 17 2.48085 16.9084 2.28807 16.7253C2.09602 16.5421 2 16.304 2 16.011V7.98901ZM3.64927 8.64835V15.3516L19.0425 15.3516V8.64835L3.64927 8.64835Z"
      fill="currentColor"
    />
    <circle cx="7.25" cy="12" r="1.25" fill="currentColor" />
    <circle cx="11.25" cy="12" r="1.25" fill="currentColor" />
    <circle cx="15.25" cy="12" r="1.25" fill="currentColor" />
  </SvgIcon>
);
