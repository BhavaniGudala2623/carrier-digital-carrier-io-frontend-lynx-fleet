import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import { Maybe, AssetRow } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

interface ReviewProps {
  assets: AssetRow[];
  company: Maybe<SelectedCompanyHierarchy>;
}

export const Review = ({ assets, company }: ReviewProps) => {
  const { t } = useTranslation();

  return (
    <Box mb={2}>
      <Typography variant="subtitle1">
        {t('company.management.assets.selected-assets')} ({assets.length})
      </Typography>
      <Box sx={{ overflowY: 'auto', maxHeight: 335, pl: 2, mt: 1.5, mb: 3 }}>
        {assets.map(({ name, id }) => (
          <Typography key={id} variant="body2" py={1.5}>
            {name}
          </Typography>
        ))}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {t('company.management.assets.assign-to-company')}
      </Typography>
      <Typography>{company?.name}</Typography>
    </Box>
  );
};
