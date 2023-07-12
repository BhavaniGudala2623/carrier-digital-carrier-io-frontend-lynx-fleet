import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

export interface TabHeaderProps {
  title: string;
  onClick: () => void;
}

export const TabHeader = ({ title, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      py: 2,
      marginBottom: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
    }}
  >
    <Typography>{title}</Typography>
    <KeyboardArrowLeftIcon
      onClick={onClick}
      sx={{ cursor: 'pointer', height: '20px', width: '20px', color: 'action.active' }}
    />
  </Box>
);
