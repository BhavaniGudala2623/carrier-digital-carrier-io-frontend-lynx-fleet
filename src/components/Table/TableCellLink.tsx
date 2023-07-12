import Link, { LinkProps } from '@carrier-io/fds-react/Link';
import { MouseEvent, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { SxProps } from '@mui/material';

interface TableCellLinkProps {
  to?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  className?: string;
  sx?: SxProps;
  underline?: 'hover' | 'none' | 'always';
}

export const TableCellLink = ({
  to,
  children,
  onClick,
  className,
  sx,
  underline = 'hover',
}: TableCellLinkProps) => {
  const commonProps: LinkProps = {
    className,
    sx: {
      color: (theme) => theme.palette.primary.main,
      cursor: 'pointer',
      ...sx,
    },
    underline,
  };

  return to ? (
    <Link
      {...commonProps}
      // Temporarily ignore the TS error. Delete after fix in FDS
      // @ts-ignore
      component={RouterLink}
      to={to}
    >
      {children}
    </Link>
  ) : (
    <Link {...commonProps} onClick={onClick}>
      {children}
    </Link>
  );
};
