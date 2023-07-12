import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const BatteryHighTemperatureIcon: FC<SvgIconProps> = ({
  width = '24',
  height = '24',
  fill = '#E31B0C',
  viewBox = '0 0 24 24',
  ...rest
}) => (
  <SvgIcon viewBox={viewBox} fill={fill} style={{ width, height, fill }} {...rest}>
    <mask
      id="mask0_509_102888"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="25"
      height="24"
    >
      <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_509_102888)">
      <path d="M17.4188 7.9082H15.4188C15.1355 7.9082 14.898 7.81237 14.7063 7.6207C14.5147 7.42904 14.4188 7.19154 14.4188 6.9082C14.4188 6.62487 14.5147 6.38737 14.7063 6.1957C14.898 6.00404 15.1355 5.9082 15.4188 5.9082H17.4188V3.9082C17.4188 3.62487 17.5147 3.38737 17.7063 3.1957C17.898 3.00404 18.1355 2.9082 18.4188 2.9082C18.7022 2.9082 18.9397 3.00404 19.1313 3.1957C19.323 3.38737 19.4188 3.62487 19.4188 3.9082V5.9082H21.4188C21.7022 5.9082 21.9397 6.00404 22.1313 6.1957C22.323 6.38737 22.4188 6.62487 22.4188 6.9082C22.4188 7.19154 22.323 7.42904 22.1313 7.6207C21.9397 7.81237 21.7022 7.9082 21.4188 7.9082H19.4188V9.9082C19.4188 10.1915 19.323 10.429 19.1313 10.6207C18.9397 10.8124 18.7022 10.9082 18.4188 10.9082C18.1355 10.9082 17.898 10.8124 17.7063 10.6207C17.5147 10.429 17.4188 10.1915 17.4188 9.9082V7.9082ZM8.41882 20.9082C7.03549 20.9082 5.85632 20.4207 4.88132 19.4457C3.90632 18.4707 3.41882 17.2915 3.41882 15.9082C3.41882 15.1082 3.59382 14.3624 3.94382 13.6707C4.29382 12.979 4.78549 12.3915 5.41882 11.9082V5.9082C5.41882 5.07487 5.71049 4.36654 6.29382 3.7832C6.87716 3.19987 7.58549 2.9082 8.41882 2.9082C9.25216 2.9082 9.96049 3.19987 10.5438 3.7832C11.1272 4.36654 11.4188 5.07487 11.4188 5.9082V11.9082C12.0522 12.3915 12.5438 12.979 12.8938 13.6707C13.2438 14.3624 13.4188 15.1082 13.4188 15.9082C13.4188 17.2915 12.9313 18.4707 11.9563 19.4457C10.9813 20.4207 9.80216 20.9082 8.41882 20.9082ZM8.41882 18.9082C9.25216 18.9082 9.96049 18.6165 10.5438 18.0332C11.1272 17.4499 11.4188 16.7415 11.4188 15.9082C11.4188 15.4249 11.3147 14.9749 11.1063 14.5582C10.898 14.1415 10.6022 13.7915 10.2188 13.5082L9.41882 12.9082V5.9082C9.41882 5.62487 9.32299 5.38737 9.13132 5.1957C8.93966 5.00404 8.70216 4.9082 8.41882 4.9082C8.13549 4.9082 7.89799 5.00404 7.70632 5.1957C7.51466 5.38737 7.41882 5.62487 7.41882 5.9082V12.9082L6.61882 13.5082C6.23549 13.7915 5.93966 14.1415 5.73132 14.5582C5.52299 14.9749 5.41882 15.4249 5.41882 15.9082C5.41882 16.7415 5.71049 17.4499 6.29382 18.0332C6.87716 18.6165 7.58549 18.9082 8.41882 18.9082Z" />
    </g>
  </SvgIcon>
);