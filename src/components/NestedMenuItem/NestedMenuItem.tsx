import {
  useState,
  useRef,
  useImperativeHandle,
  ElementType,
  ReactNode,
  HTMLAttributes,
  MouseEvent,
  forwardRef,
  FocusEvent,
  RefAttributes,
  KeyboardEvent,
} from 'react';
import { makeStyles } from '@mui/styles';
import Menu, { MenuProps } from '@carrier-io/fds-react/Menu';
import MenuItem, { MenuItemProps } from '@carrier-io/fds-react/MenuItem';
import { ArrowRight } from '@mui/icons-material';
import clsx from 'clsx';

/**
 * https://github.com/azmenak/material-ui-nested-menu-item
 */
export interface NestedMenuItemProps extends Omit<MenuItemProps, 'button'> {
  /**
   * Open state of parent `<Menu />`, used to close decendent menus when the
   * root menu is closed.
   */
  parentMenuOpen: boolean;
  /**
   * Component for the container element.
   * @default 'div'
   */
  component?: ElementType;
  /**
   * Effectively becomes the `children` prop passed to the `<MenuItem/>`
   * element.
   */
  label?: ReactNode;
  /**
   * @default <ArrowRight />
   */
  rightIcon?: ReactNode;
  /**
   * Props passed to container element.
   */
  ContainerProps?: HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement | null>;
  /**
   * Props passed to sub `<Menu/>` element
   */
  MenuProps?: Omit<MenuProps, 'children'>;
  /**
   * @see https://material-ui.com/api/list-item/
   */
  button?: true | undefined;
  additionalContent?: JSX.Element;
}

const TRANSPARENT = 'rgba(0,0,0,0)';
const useMenuItemStyles = makeStyles(() => ({
  //  root: (props: any) => ({
  root: () => ({
    // backgroundColor: props.open ? theme.palette.action.hover : TRANSPARENT,
    backgroundColor: TRANSPARENT,
  }),
  itemWrapper: {
    maxHeight: 400,
    overflowY: 'scroll',
  },
}));

/**
 * Use as a drop-in replacement for `<MenuItem>` when you need to add cascading
 * menu elements as children to this component.
 */
export const NestedMenuItem = forwardRef<HTMLLIElement | null, NestedMenuItemProps>((props, ref) => {
  const {
    parentMenuOpen,
    // component = 'div',
    label,
    rightIcon = <ArrowRight />,
    children,
    className,
    tabIndex: tabIndexProp,
    // MenuProps = {},
    ContainerProps: ContainerPropsProp = {},
    additionalContent,
    ...menuItemProps
  } = props;

  const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;

  const menuItemRef = useRef<HTMLLIElement>(null);
  useImperativeHandle(ref, () => menuItemRef?.current!);

  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(containerRefProp, () => containerRef.current);

  const menuContainerRef = useRef<HTMLDivElement>(null);

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(true);

    if (ContainerProps?.onMouseEnter) {
      ContainerProps.onMouseEnter(event);
    }
  };
  const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(false);

    if (ContainerProps?.onMouseLeave) {
      ContainerProps.onMouseLeave(event);
    }
  };

  // Check if any immediate children are active
  const isSubmenuFocused = () => {
    const active = containerRef.current?.ownerDocument?.activeElement;
    /* eslint-disable-next-line */
    for (const child of Array.from(menuContainerRef.current?.children ?? [])) {
      if (child === active) {
        return true;
      }
    }

    return false;
  };

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target === containerRef.current) {
      setIsSubMenuOpen(true);
    }

    if (ContainerProps?.onFocus) {
      ContainerProps.onFocus(event);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      return;
    }

    if (isSubmenuFocused()) {
      event.stopPropagation();
    }

    const active = containerRef.current?.ownerDocument?.activeElement;

    if (event.key === 'ArrowLeft' && isSubmenuFocused()) {
      containerRef.current?.focus();
    }

    if (event.key === 'ArrowRight' && event.target === containerRef.current && event.target === active) {
      const firstChild = menuContainerRef.current?.children[0] as HTMLElement | undefined;
      firstChild?.focus();
    }
  };

  const open = isSubMenuOpen && parentMenuOpen;
  const menuItemClasses = useMenuItemStyles({ open });

  // Root element must have a `tabIndex` attribute for keyboard navigation
  let tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  return (
    <div
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={tabIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="menuitem"
      {...ContainerProps}
    >
      <MenuItem {...menuItemProps} className={clsx(menuItemClasses.root, className)} ref={menuItemRef}>
        {additionalContent || label}
        {rightIcon}
      </MenuItem>
      <Menu
        // Set pointer events to 'none' to prevent the invisible Popover div
        // from capturing events for clicks and hovers
        style={{ pointerEvents: 'none' }}
        // getContentAnchorEl={null}
        anchorEl={menuItemRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={() => {
          setIsSubMenuOpen(false);
        }}
      >
        <div ref={menuContainerRef} className={menuItemClasses.itemWrapper} style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </Menu>
    </div>
  );
});
