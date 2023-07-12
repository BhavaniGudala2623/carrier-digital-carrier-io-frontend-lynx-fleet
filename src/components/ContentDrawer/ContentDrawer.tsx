import { FC, memo, useEffect, useState } from 'react';
import Drawer from '@carrier-io/fds-react/Drawer';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import IconButton from '@carrier-io/fds-react/IconButton';
import Box from '@carrier-io/fds-react/Box';

import { HiddenScroll } from '../HiddenScroll';

import { PageDrawerEvent } from '@/events';

interface ContentDrawerProps {
  children: JSX.Element | string;
  onChange?: (value: boolean) => void;
  defaultValue?: boolean;
  noPadding?: boolean;
}

const animationDuration: number = 50;

export const ContentDrawer: FC<ContentDrawerProps> = memo(
  ({ defaultValue = true, children, noPadding, onChange }) => {
    const [open, setOpen] = useState<boolean>(defaultValue);

    const toggle = () => {
      setOpen((prev) => {
        const currentValue = !prev;

        if (onChange) {
          onChange(currentValue);
        }

        return currentValue;
      });
    };

    const handleButtonClick = () => {
      toggle();
    };

    useEffect(() => {
      PageDrawerEvent.subscribe(toggle);

      return () => {
        PageDrawerEvent.unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Box>
        <Drawer
          elevation={0}
          anchor="left"
          variant="persistent"
          transitionDuration={animationDuration}
          open={open}
          sx={{
            width: open ? 400 : 0,
            height: '100%',
            transition: 'width 50ms cubic-bezier(0, 0, 0.2, 1) 0ms',
            '& .MuiPaper-root.MuiDrawer-paper': {
              position: 'static',
              padding: noPadding ? 0 : '.75rem .5rem',
              marginRight: '1.25rem',
              borderRadius: 2,
              border: 'none',
            },
          }}
        >
          <HiddenScroll>{children}</HiddenScroll>
        </Drawer>
        <IconButton
          color="primary"
          aria-label="close widgets"
          onClick={handleButtonClick}
          size="small"
          sx={{
            position: 'fixed',
            top: '30vh',
            left: open ? 452 : 72,
            width: 16,
            height: 24,
            fontSize: '1rem',
            zIndex: 5,
            transition: 'left 50ms cubic-bezier(0, 0, 0.2, 1) 0ms',
            borderRadius: '0 4px 4px 0',
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'secondary.outlinedHoverBackground',
            },
          }}
        >
          {open ? <ChevronLeft fontSize="inherit" /> : <ChevronRight fontSize="inherit" />}
        </IconButton>
      </Box>
    );
  }
);

ContentDrawer.displayName = 'ContentDrawer';
