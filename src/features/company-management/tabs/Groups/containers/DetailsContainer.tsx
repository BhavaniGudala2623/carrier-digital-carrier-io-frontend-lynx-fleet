import { ChangeEvent, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { useSelector } from 'react-redux';
import { Maybe, User } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';

import { CreateGroupFormValuesType } from '../types';
import { validateGroupName } from '../validation';
import { getOwnerNameDisplayValue } from '../utils';
import { Details } from '../components';
import { useAllowedRegionsAndCountries } from '../../../hooks';

import { UserAccessibleTenantsSelectItem } from '@/features/common';
import { getAuthTenantId } from '@/features/authentication';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { companyActionPayload } from '@/features/authorization';

interface DetailsProps {
  editMode: boolean;
}

export const DetailsContainer = ({ editMode }: DetailsProps) => {
  const { t } = useTranslation();
  const { hasPermission } = useRbac();
  const currentUserTenantId = useSelector(getAuthTenantId);
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();

  const {
    values,
    values: {
      isOwnerLoading,
      owner,
      usersList,
      tenantId,
      name,
      company,
      accessAllowedRestrictions,
      isAdminGroup,
    },
    errors,
    handleChange,
    handleBlur,
    touched,
    initialValues,
    setFieldValue,
    validateForm,
  } = useFormikContext<CreateGroupFormValuesType>();

  const restrictAccessAllowed =
    !!company?.isCarrierGlobal &&
    hasPermission(companyActionPayload('group.restrictPermission', currentUserTenantId));

  const validateNameField = useCallback(
    (newName: string) => validateGroupName(newName, initialValues.name, initialValues.tenantId),
    [initialValues.name, initialValues.tenantId]
  );

  const resetOwner = useCallback(() => {
    setFieldValue('owner', null);
    setFieldValue('ownerName', '');
    setFieldValue('ownerEmail', '');
  }, [setFieldValue]);

  const onLimitCountriesChange = useCallback((countries: string[], regions: string[]) => {
    setFieldValue('accessAllowedRestrictions.countries', countries);
    setFieldValue('accessAllowedRestrictions.regions', regions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompanyChange = useCallback(
    (value: Maybe<UserAccessibleTenantsSelectItem>) => {
      setFieldValue('company', value);
      resetOwner();
      setFieldValue('usersList', []);
      setFieldValue('tenantId', value?.id);
      setFieldValue(
        'accessAllowedRestrictions',
        value?.id === initialValues.company?.id ? initialValues.accessAllowedRestrictions : { countries: [] }
      );
    },
    [initialValues.accessAllowedRestrictions, initialValues.company?.id, resetOwner, setFieldValue]
  );

  const { allowedRegions, allowedCountries } = useAllowedRegionsAndCountries();

  useEffect(() => {
    validateForm();
  }, [values.owner, validateForm]);

  const handleChangeGroupOwner = useCallback(
    (_event: ChangeEvent<{}>, value: User | null) => {
      if (value) {
        setFieldValue('owner', value);
        setFieldValue('ownerEmail', value.email);
        setFieldValue('ownerName', getOwnerNameDisplayValue(value));
      } else {
        resetOwner();
      }
    },
    [setFieldValue, resetOwner]
  );

  const groupNameError =
    touched.name && Boolean(errors.name) ? touched.name && errors.name && t(errors.name) : undefined;

  const ownerError = errors.ownerEmail && !isOwnerLoading ? t(errors.ownerEmail) : undefined;

  return (
    <Box mt={5} mb={6} p={0} width={422}>
      <Details
        company={company}
        disableCompanySelect={editMode}
        tenantId={tenantId}
        isOwnerLoading={isOwnerLoading}
        accessAllowedRestrictions={accessAllowedRestrictions}
        allowedRegions={allowedRegions}
        allowedCountries={allowedCountries}
        restrictAccessAllowed={restrictAccessAllowed}
        groupName={name}
        groupNameError={groupNameError}
        owner={owner}
        ownerError={ownerError}
        usersList={usersList}
        onCompanyChange={handleCompanyChange}
        handleChangeGroupOwner={handleChangeGroupOwner}
        onLimitCountriesChange={onLimitCountriesChange}
        handleChange={handleChange}
        handleBlur={handleBlur}
        validateNameField={validateNameField}
        defaultId={selectedCompanyHierarchy.id}
        isAdminGroup={isAdminGroup}
        editMode={editMode}
      />
    </Box>
  );
};

DetailsContainer.displayName = 'DetailsContainer';
