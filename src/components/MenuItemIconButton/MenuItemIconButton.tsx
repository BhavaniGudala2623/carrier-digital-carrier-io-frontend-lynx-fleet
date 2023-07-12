import IconButton, { IconButtonProps } from '@carrier-io/fds-react/IconButton';
import { MouseEventHandler, forwardRef, Ref } from 'react';

const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (event) => {
  event.stopPropagation();
};

export const MenuItemIconButton = forwardRef((props: IconButtonProps, ref: Ref<HTMLButtonElement>) => (
  <IconButton {...props} ref={ref} onMouseDown={handleMouseDown} />
));
