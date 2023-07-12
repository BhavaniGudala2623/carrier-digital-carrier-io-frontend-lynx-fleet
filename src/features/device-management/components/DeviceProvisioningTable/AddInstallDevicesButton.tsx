import AddIcon from '@mui/icons-material/Add';
import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';
import { MouseEvent } from 'react';

export interface Props {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export const AddInstallDevicesButton = ({ onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={onClick}>
      {`${t('common.add')} / ${t('common.install')} ${t('device.management.device.provisioning.devices')}`}
    </Button>
  );
};
