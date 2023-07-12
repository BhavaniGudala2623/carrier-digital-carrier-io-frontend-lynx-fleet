import ToggleButton, { ToggleButtonProps } from '@carrier-io/fds-react/ToggleButton';
import { forwardRef, FC } from 'react';
import Tooltip, { TooltipProps as TooltipPropsType } from '@carrier-io/fds-react/Tooltip';

type TooltipToggleButtonProps = ToggleButtonProps & {
  TooltipProps: Omit<TooltipPropsType, 'children'>;
};

// Catch props and forward to ToggleButton
export const TooltipToggleButton: FC<TooltipToggleButtonProps> = forwardRef(
  ({ TooltipProps, ...props }, ref) => (
    <Tooltip {...TooltipProps}>
      <ToggleButton ref={ref} {...props} />
    </Tooltip>
  )
);
