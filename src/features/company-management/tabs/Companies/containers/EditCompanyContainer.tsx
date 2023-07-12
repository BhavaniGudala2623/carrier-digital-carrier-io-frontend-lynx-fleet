import Box from '@carrier-io/fds-react/Box';
import { omit } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { Company } from '@carrier-io/lynx-fleet-types';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { EditCompanyForm } from '../components/EditCompany';
import { useEditCompany } from '../providers';
import { useEditOne } from '../../../hooks';

import { Loader } from '@/components';
import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

interface EditCompanyContainerI {
  companyId: string;
  onClose: () => void;
  isCarrierAdmin: boolean;
}

const getCompanyToUpdate = (company: Company): Company => ({
  ...company,
  features: company.features?.map((feature) => omit(feature, '__typename')),
});

export function EditCompanyContainer({ companyId, onClose, isCarrierAdmin }: EditCompanyContainerI) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { activeStep, setNextStep, setPrevStep, handleCloseEditCompanyForm, setUsers } = useEditCompany();
  const entityKey = 'getTenantById';
  const updateEntityKey = 'tenant';

  const onSuccessCallBack = () => {
    handleCloseEditCompanyForm();
    showMessage(dispatch, t('company.management.company.update-success'));
  };

  const {
    loading,
    queryError,
    mutationError,
    entity: company,
    onSave: handleSubmit,
  } = useEditOne<Company>({
    id: companyId,
    entityKey,
    updateEntityKey,
    getOneEntityQuery: CompanyService.GET_TENANT_BY_ID,
    updateOneEntityQuery: CompanyService.UPDATE_COMPANY,
    refetchQueries: [CompanyService.GET_SUB_TENANTS_FOR_TENANT],
    onSuccessCallBack,
  });

  const { loading: isUsersLoading } = CompanyService.useGetUsers(
    {
      for: {
        id: companyId,
        type: 'COMPANY',
      },
    },
    {
      fetchPolicy: 'cache-and-network',
      onError: (error) => {
        showError(dispatch, error);
      },
      onCompleted: (usersResponse) => {
        setUsers(usersResponse.getUsers.items.filter((user) => user.tenantId === companyId) ?? []);
      },
    }
  );

  if (mutationError) {
    showError(dispatch, mutationError);
  }

  if (queryError) {
    handleCloseEditCompanyForm();

    showError(dispatch, queryError);
  }

  if (loading && !company) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" fontSize={100}>
        <Loader overlay />
      </Box>
    );
  }

  return company ? (
    <EditCompanyForm
      loading={loading || isUsersLoading}
      company={getCompanyToUpdate(company)}
      onSubmit={handleSubmit}
      activeStep={activeStep}
      onClickNext={setNextStep}
      onClickBack={setPrevStep}
      onClose={onClose}
      isCarrierAdmin={isCarrierAdmin}
    />
  ) : null;
}
