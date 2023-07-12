import { memo, useState, useRef, MouseEvent } from 'react';
import Button from '@carrier-io/fds-react/Button';
import ButtonGroup, { ButtonGroupProps } from '@carrier-io/fds-react/ButtonGroup';
import ClickAwayListener from '@carrier-io/fds-react/ClickAwayListener';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import MenuList from '@carrier-io/fds-react/MenuList';
import Paper from '@carrier-io/fds-react/Paper';
import Popper, { PopperProps } from '@carrier-io/fds-react/Popper';
import { ArrowDropDown } from '@mui/icons-material';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { Grow } from '@mui/material';

interface SplitButtonProps {
  buttonGroupProps?: ButtonGroupProps;
  popperProps?: PopperProps;
  options: { label: string; key: string }[];
  placeholder: string;
  onClick: (event: MouseEvent<HTMLButtonElement, MouseEvent>, selectedIndex: string) => void;
  handleMenuItemClick: (event: MouseEvent<HTMLLIElement, MouseEvent>, index: number) => void;
  selectedIndex: Maybe<number>;
}

export const SplitButton = memo(
  ({
    buttonGroupProps,
    popperProps,
    options,
    placeholder,
    onClick,
    handleMenuItemClick,
    selectedIndex,
  }: SplitButtonProps) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<Maybe<HTMLDivElement>>(null);

    const handleClick = (event) => {
      if (typeof selectedIndex === 'number') {
        onClick(event, options[selectedIndex].key);
      }
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
        return;
      }

      setOpen(false);
    };

    const handleMenuOptionClick = (index: number) => (event) => {
      handleMenuItemClick(event, index);
      setOpen(false);
    };

    return (
      <>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
          {...buttonGroupProps}
        >
          <Button onClick={handleClick}>
            {selectedIndex === null ? placeholder : options[selectedIndex].label}
          </Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select an action"
            onClick={handleToggle}
          >
            <ArrowDropDown />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          style={{ zIndex: 1 }}
          direction="ltr"
          {...popperProps}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem
                        key={option.key}
                        selected={index === selectedIndex}
                        onClick={handleMenuOptionClick(index)}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }
);

SplitButton.displayName = 'SplitButton';
