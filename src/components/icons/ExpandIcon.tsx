import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SvgIconProps } from '@mui/material';

interface ExpandIconProps extends SvgIconProps {
  expanded: boolean;
}

export const ExpandIcon = ({ expanded, sx, ...rest }: ExpandIconProps) => (
  <ChevronRightIcon
    {...rest}
    sx={{
      ...sx,
      transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: (theme) =>
        theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
    }}
  />
);
