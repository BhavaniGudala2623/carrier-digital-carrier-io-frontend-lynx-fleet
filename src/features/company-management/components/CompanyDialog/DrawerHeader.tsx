import { ChangeEventHandler, FC } from 'react';
import Grid from '@carrier-io/fds-react/Grid';
import IconButton from '@carrier-io/fds-react/IconButton';
import InputAdornment from '@carrier-io/fds-react/InputAdornment';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import { Close } from '@mui/icons-material';

import { Hint } from './Hint';

import { SearchIcon } from '@/components';

interface DrawerHeaderProps {
  onClose: () => void;
  onSearch: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  searchText: string;
}

export const DrawerHeader: FC<DrawerHeaderProps> = ({ onClose, searchText, onSearch }) => (
  <Grid container direction="column" rowSpacing={3}>
    <Grid item>
      <Grid direction="row" container justifyContent="space-between" alignItems="flex-start" rowSpacing={3}>
        <Grid item>
          <Typography variant="subtitle2">Select Company</Typography>
        </Grid>
        <Grid item>
          <IconButton sx={{ width: 30, height: 30, borderRadius: 1 }} onClick={onClose}>
            <Close />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>

    <Grid item>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="space-between"
        rowSpacing={1}
      >
        <Grid item>
          <TextField
            placeholder="Search Company"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" disablePointerEvents>
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 290,
              borderRadius: 1,
            }}
            hideBackgroundColor
            showBorder
            size="small"
            value={searchText}
            onChange={onSearch}
          />
        </Grid>
        <Grid item>
          <Hint />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);
