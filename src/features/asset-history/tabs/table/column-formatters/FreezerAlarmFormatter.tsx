import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';

import { ParamsProps } from '../types';

import type { SnapshotDataEx } from '@/features/common';

export const FreezerAlarmFormatter = (
  params: ParamsProps,
  setModalSelectedAsset: (val: SnapshotDataEx | null) => void
) => {
  const { t } = useTranslation();
  const { data } = params;

  if (data?.activeFreezerAlarms) {
    const numAlarms = data?.activeFreezerAlarms?.length || 0;
    const handleLinkClick = () => {
      setModalSelectedAsset(data);
    };

    return (
      <Button
        sx={{
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        variant="text"
        onClick={handleLinkClick}
      >
        <b>{`${numAlarms} ${t('common.active')}`}</b>
      </Button>
    );
  }

  return <span />;
};
