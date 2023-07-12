import { memo, useEffect, useRef } from 'react';
import Button from '@carrier-io/fds-react/Button';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import Popper from '@carrier-io/fds-react/Popper';
import ClickAwayListener from '@carrier-io/fds-react/ClickAwayListener';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  button: {
    marginLeft: '10px',
    fontSize: 15,
    lineHeight: '24px',
    padding: '4px 16px',
  },
  expandIcon: {
    marginLeft: '10px',
    fontSize: 18,
  },
}));

interface IProps {
  isOpen: boolean;
  buttonLabel: string;
  children: JSX.Element;
  onClose: () => void;
  onToggle: () => void;
}

export const ButtonPopper = memo((props: IProps) => {
  const { buttonLabel, children, isOpen, onToggle, onClose } = props;

  const classes = useStyles();

  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const menuListGrow = 'menu-list-grow';

  const handleToggle = () => {
    onToggle();
  };

  const handleClose = (event) => {
    if (anchorRef?.current?.contains(event.target as HTMLLIElement)) {
      return;
    }

    onClose();
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef<boolean>(isOpen);

  useEffect(() => {
    if (prevOpen?.current && anchorRef?.current && !isOpen) {
      anchorRef.current.focus();
    }

    prevOpen.current = isOpen;
  }, [isOpen]);

  return (
    <Box display="flex">
      <div>
        <Button
          className={classes.button}
          ref={anchorRef}
          aria-controls={isOpen ? menuListGrow : undefined}
          variant="outlined"
          aria-haspopup="true"
          onClick={handleToggle}
        >
          {buttonLabel}
          <ExpandMoreOutlined className={classes.expandIcon} />
        </Button>
        <Popper open={isOpen} anchorEl={anchorRef.current} transition direction="ltr">
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>{children}</ClickAwayListener>
          </Paper>
        </Popper>
      </div>
    </Box>
  );
});

ButtonPopper.displayName = 'ButtonPopper';
