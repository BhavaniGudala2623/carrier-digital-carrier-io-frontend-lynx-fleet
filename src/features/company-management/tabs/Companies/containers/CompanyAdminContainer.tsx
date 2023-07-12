import { useMemo, useRef } from 'react';
import { CreateUserInput, Maybe } from '@carrier-io/lynx-fleet-types';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';

import { CreateAdmin } from '../components/Steps/Details/CreateAdmin';
import { useCreateUser } from '../../Users/hooks';
import { useEditCompany } from '../providers';
import { ContactFieldToPrimaryContactMap } from '../../../constants';
import { PrimaryContactProps } from '../types';

import { AdminSelectorContainer } from './AdminSelectorContainer';

import { useToggle } from '@/hooks';
import { CreateCompanyFormData } from '@/features/company-management/types';

export const CompanyAdminContainer = () => {
  const { t } = useTranslation();
  const { validateForm, values, setFieldValue } = useFormikContext<CreateCompanyFormData>();
  const { users, companyId } = useEditCompany();
  const { handleSubmit: createUser, isCreateUserLoading, refetchUsers, createUserError } = useCreateUser();

  const { value: open, toggleOn: openCreateAdmin, toggleOff: closeCreateAdmin } = useToggle(false);

  const adminFormRef = useRef<PrimaryContactProps>({
    name: '',
    email: '',
    phone: '',
    lastName: '',
  });

  const primaryContactRef = useRef<PrimaryContactProps>({
    name: values.contactInfo?.name,
    email: values.contactInfo?.email,
    phone: values.contactInfo?.phone,
    lastName: values.contactInfo?.lastName,
  });

  const editMode = useMemo(() => !!companyId, [companyId]);

  const setPrimaryContactFields = (userValues: Maybe<PrimaryContactProps> = null, defaultValue = '') => {
    Object.keys(ContactFieldToPrimaryContactMap).forEach((field) => {
      setFieldValue(
        field,
        userValues ? userValues?.[ContactFieldToPrimaryContactMap[field]] ?? '' : defaultValue
      );
    });
  };

  const handleOpenCreatingAdmin = () => {
    openCreateAdmin();
    setPrimaryContactFields(adminFormRef.current);
  };

  const handleCancelCreatingAdmin = async () => {
    closeCreateAdmin();
    setPrimaryContactFields(primaryContactRef.current);
    adminFormRef.current = {
      name: values.contactInfo?.name,
      lastName: values.contactInfo?.lastName,
      email: values.contactInfo?.email,
      phone: values.contactInfo?.phone,
    };
    await validateForm({
      ...values,
      contactInfo: {
        ...values.contactInfo,
        ...primaryContactRef.current,
      },
    });
  };

  const setPrimaryContactRef = (primaryContactData: PrimaryContactProps) => {
    primaryContactRef.current = primaryContactData;
  };

  const onSaveAdmin = ({ firstName, ...rest }: CreateUserInput) => {
    closeCreateAdmin();
    const primaryContactData = {
      name: firstName,
      ...rest,
    };
    setPrimaryContactFields(primaryContactData);
    setPrimaryContactRef(primaryContactData);
    adminFormRef.current = {
      name: '',
      email: '',
      phone: '',
      lastName: '',
    };
  };

  const handleCreateUser = async (data: CreateUserInput) => {
    await createUser(data);
    if (!createUserError) {
      await refetchUsers();
      onSaveAdmin(data);
    }
  };

  return (
    <>
      <Typography variant="subtitle1" color="text.primary" gutterBottom>
        {t('company.management.company-admin')}
      </Typography>
      {editMode && !open ? (
        <AdminSelectorContainer
          setPrimaryContactFields={setPrimaryContactFields}
          setPrimaryContactRef={setPrimaryContactRef}
          handleOpen={handleOpenCreatingAdmin}
          users={users}
        />
      ) : (
        <CreateAdmin
          loading={isCreateUserLoading}
          onSave={handleCreateUser}
          onCancel={handleCancelCreatingAdmin}
          editMode={editMode}
        />
      )}
    </>
  );
};
