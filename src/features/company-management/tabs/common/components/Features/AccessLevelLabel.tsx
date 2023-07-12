import { Maybe, AccessLevelType } from '@carrier-io/lynx-fleet-types';
import Chip from '@carrier-io/fds-react/Chip';
import { useTranslation } from 'react-i18next';

type AccessLevelLabelProps = {
  accessLevel: Maybe<AccessLevelType>;
};

type DataMapProps = {
  [key in AccessLevelType | 'off']: {
    text: string;
    color: 'primary' | 'warning' | 'error' | 'default';
  };
};

export const AccessLevelLabel = ({ accessLevel }: AccessLevelLabelProps) => {
  const { t } = useTranslation();
  const dataMap: DataMapProps = {
    full_access: {
      text: t('common.full'),
      color: 'primary',
    },
    create_edit: {
      text: t('common.edit'),
      color: 'warning',
    },
    view_only: {
      text: t('common.view-only'),
      color: 'default',
    },
    off: {
      text: t('common.off'),
      color: 'error',
    },
  };

  const { text, color } = dataMap[accessLevel || 'off'];

  return <Chip label={text} size="small" variant="filled" color={color} lightBackground />;
};
