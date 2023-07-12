import Box from '@carrier-io/fds-react/Box';
import Chip from '@carrier-io/fds-react/Chip';
import { useTranslation } from 'react-i18next';
import { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';
import { FC } from 'react';

import { Maybe } from '@/types';

export interface ContentItemProps {
  content?: Maybe<string>;
  flag?: FC;
}

export const ContentItem: FC<ContentItemProps> = ({ content, flag }) => {
  const { t } = useTranslation();

  if (flag) {
    const Flag: FC<SvgIconProps> = flag;

    return (
      <Box sx={{ float: 'right' }}>
        <Flag sx={{ height: '0.875rem', width: '1.25rem', position: 'relative', top: '0.125rem' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ float: 'right' }}>
      {content ? (
        <Chip label={content} size="small" />
      ) : (
        <Chip label={t('common.undefined')} size="small" color="warning" lightBackground />
      )}
    </Box>
  );
};
