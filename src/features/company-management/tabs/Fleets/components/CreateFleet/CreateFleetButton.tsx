import { useTranslation } from 'react-i18next';
import Button from '@carrier-io/fds-react/Button';

interface Props {
  onCreateFleet: () => void;
}

export const CreateFleetButton = ({ onCreateFleet }: Props) => {
  const { t } = useTranslation();

  const handleCreateFleet = () => {
    onCreateFleet();
  };

  return (
    <Button sx={{ backgroundColor: 'background.paper' }} variant="outlined" onClick={handleCreateFleet}>
      {t('company.management.create-fleet')}
    </Button>
  );
};

CreateFleetButton.displayName = 'CreateFleetButton';
