import { useTranslation } from 'react-i18next';
import Container from '@carrier-io/fds-react/Container';

import { useEditCompany } from './providers';
import { EditCompanyContainer } from './containers';

import { Dialog } from '@/components/Dialog';
import { useAppSelector } from '@/stores';
import { getAuthUserIsCarrierAdmin } from '@/features/authentication';
import { useApplicationContext } from '@/providers/ApplicationContext';

export function EditCompanyDialog() {
  const { t } = useTranslation();
  const { isCompanyEditDialogOpen, handleCloseEditCompanyForm, companyId, activeStep } = useEditCompany();
  const authUserIsCarrierAdmin = useAppSelector(getAuthUserIsCarrierAdmin);
  const { featureFlags } = useApplicationContext();
  const shouldDisplayContractStep =
    authUserIsCarrierAdmin && featureFlags.REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT;

  return companyId ? (
    <Dialog
      open={!!companyId && isCompanyEditDialogOpen}
      onClose={handleCloseEditCompanyForm}
      maxWidth="md"
      fullWidth
      dividers
      dialogTitle={t('company.management.edit-a-company', {
        step: activeStep + 1,
        numberOfSteps: shouldDisplayContractStep ? 5 : 4,
      })}
      content={
        <Container sx={{ minHeight: 500 }}>
          <EditCompanyContainer
            companyId={companyId}
            onClose={handleCloseEditCompanyForm}
            isCarrierAdmin={shouldDisplayContractStep}
          />
        </Container>
      }
    />
  ) : null;
}
