import Chip, { ChipProps } from '@carrier-io/fds-react/Chip';
import { useTranslation } from 'react-i18next';

const getColorForStatus = (status): ChipProps['color'] => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
      return 'success';
    case 'FAILED':
    case 'NO RESPONSE':
      return 'error';
    case 'PENDING':
    case 'QUEUED':
    default:
      return 'default';
  }
};

export const StatusRenderer = ({ value }) => {
  const { t } = useTranslation();

  if (!value) {
    return null;
  }

  return (
    <Chip
      label={t(`command-history.command-status.${value.toLowerCase()}`)}
      color={getColorForStatus(value)}
      lightBackground
      size="small"
    />
  );
};
