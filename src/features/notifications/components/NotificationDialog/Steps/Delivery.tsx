import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { AutocompleteProps } from '@carrier-io/fds-react/Autocomplete';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';

import { NotificationFormData } from '../../../types';
import { RecipientSelector } from '../../Selector/Recipient';

import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';

export const ChooseDelivery = () => {
  const { values, setFieldValue, errors } = useFormikContext<NotificationFormData>();
  const { t } = useTranslation();

  const tenantId = useAppSelector(getAuthTenantId);

  const handleRecipientsChange: AutocompleteProps['onChange'] = (_event, value) => {
    setFieldValue('recipients', value, true);
  };

  return (
    <Box display="flex" flexDirection="column" mb={1}>
      <Typography variant="body1" mb={1}>
        {t('notifications.delivery-step-header')}
      </Typography>
      <Box display="flex" flexDirection="column" width={480} mb={1}>
        <RecipientSelector tenantId={tenantId} value={values.recipients} onChange={handleRecipientsChange} />
      </Box>
      {errors.recipients && (
        <FormHelperText error variant="filled" sx={{ mb: 2, ml: 0 }}>
          {errors.recipients}
        </FormHelperText>
      )}
    </Box>
  );
};
