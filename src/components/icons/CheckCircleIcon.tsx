import { FC } from 'react';
import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const CheckCircleIcon: FC<SvgIconProps> = ({
  width = '17',
  height = '17',
  fill = '#3B873E',
  viewBox = '0 0 17 17',
  ...rest
}) => (
  <SvgIcon viewBox={viewBox} style={{ width, height, fill }} {...rest}>
    <mask
      id="mask0_1229_191125"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="17"
      height="17"
    >
      <rect x="0.166626" y="0.5" width="16" height="16" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_1229_191125)">
      <path d="M7.362 9.73971L5.92866 8.30638C5.80644 8.18416 5.65088 8.12305 5.462 8.12305C5.27311 8.12305 5.11755 8.18416 4.99533 8.30638C4.87311 8.4286 4.812 8.58416 4.812 8.77305C4.812 8.96194 4.87311 9.11749 4.99533 9.23971L6.89533 11.1397C7.02866 11.273 7.18422 11.3397 7.362 11.3397C7.53977 11.3397 7.69533 11.273 7.82866 11.1397L11.5953 7.37305C11.7176 7.25082 11.7787 7.09527 11.7787 6.90638C11.7787 6.71749 11.7176 6.56194 11.5953 6.43971C11.4731 6.31749 11.3176 6.25638 11.1287 6.25638C10.9398 6.25638 10.7842 6.31749 10.662 6.43971L7.362 9.73971ZM8.29533 15.2064C7.37311 15.2064 6.50644 15.0314 5.69533 14.6814C4.88422 14.3314 4.17866 13.8564 3.57866 13.2564C2.97866 12.6564 2.50366 11.9508 2.15366 11.1397C1.80366 10.3286 1.62866 9.46194 1.62866 8.53971C1.62866 7.61749 1.80366 6.75082 2.15366 5.93971C2.50366 5.1286 2.97866 4.42305 3.57866 3.82305C4.17866 3.22305 4.88422 2.74805 5.69533 2.39805C6.50644 2.04805 7.37311 1.87305 8.29533 1.87305C9.21755 1.87305 10.0842 2.04805 10.8953 2.39805C11.7064 2.74805 12.412 3.22305 13.012 3.82305C13.612 4.42305 14.087 5.1286 14.437 5.93971C14.787 6.75082 14.962 7.61749 14.962 8.53971C14.962 9.46194 14.787 10.3286 14.437 11.1397C14.087 11.9508 13.612 12.6564 13.012 13.2564C12.412 13.8564 11.7064 14.3314 10.8953 14.6814C10.0842 15.0314 9.21755 15.2064 8.29533 15.2064Z" />
    </g>
  </SvgIcon>
);
