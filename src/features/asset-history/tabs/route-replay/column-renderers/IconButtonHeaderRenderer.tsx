import Box from '@carrier-io/fds-react/Box';
import IconButton from '@carrier-io/fds-react/IconButton';
import { ViewWeekSharp } from '@mui/icons-material';
import { ValueFormatterParams } from '@ag-grid-community/core';

import { useStyles } from '../components/styles';
import { EnrichedEventData } from '../types';

interface IIconButtonHeaderRendererProps {
  isPopupOpen: boolean;
  popupHandler: (isPopupOpen: boolean, elementTarget) => void;
}

export const IconButtonHeaderRenderer = (
  params: ValueFormatterParams<EnrichedEventData, number> & {
    props: IIconButtonHeaderRendererProps;
  }
) => {
  const { props } = params;
  const { isPopupOpen, popupHandler } = props;
  const classes = useStyles();

  const popupClassName = `${classes.popupButton}  ${
    isPopupOpen ? classes.popupVisible : classes.popupHidden
  }`;

  const handleClick = (e) => {
    popupHandler(!isPopupOpen, e.currentTarget);
  };

  return (
    <Box>
      <IconButton onClick={handleClick} className={classes.popupButtonContainer}>
        <ViewWeekSharp className={popupClassName} />
      </IconButton>
    </Box>
  );
};
