import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import { Tooltip, Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { forwardRef } from 'react';
import ListItem from '@carrier-io/fds-react/ListItem';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { sortStrings } from '@/utils';

interface ListPopoverItem<T> {
  label: string;
  value: T;
}

interface ListPopoverProps<T> {
  items: ListPopoverItem<T>[];
  containerContent: string;
  isLoading?: boolean;
}

const ListPopoverAnchor = forwardRef<HTMLElement, { text: string }>((props, ref) => (
  <strong style={{ color: fleetThemeOptions.palette.primary.main }} {...props} ref={ref}>
    {props.text}
  </strong>
));

export const ListPopover = <T extends unknown>({
  items,
  containerContent,
  isLoading,
}: ListPopoverProps<T>) => {
  const sortedItems = [...items].sort((a, b) => sortStrings(a.label, b.label));

  if (isLoading) {
    return <CircularProgress style={{ marginLeft: 10 }} size={18} />;
  }

  if (!items.length) {
    return <ListPopoverAnchor text={containerContent} />;
  }

  return (
    <span>
      <Tooltip
        title={
          <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
            {sortedItems.map((item) => (
              <ListItem key={item.value as string}>
                <Typography variant="body1" sx={{ overflow: 'hidden' }}>
                  {item.label}
                </Typography>
              </ListItem>
            ))}
          </Box>
        }
      >
        <ListPopoverAnchor text={containerContent} />
      </Tooltip>
    </span>
  );
};
