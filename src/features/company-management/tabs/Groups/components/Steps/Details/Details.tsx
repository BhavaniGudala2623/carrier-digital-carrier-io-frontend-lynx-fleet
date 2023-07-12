import { ChangeEvent, FocusEvent } from 'react';
import Box from '@carrier-io/fds-react/Box';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { User, Maybe } from '@carrier-io/lynx-fleet-types';

import { CreateGroupFormValuesType } from '../../../types';

import { LimitAccessSelect } from './LimitAccessSelect';
import { GroupOwnerSelector } from './GroupOwnerSelector';

import { Loader } from '@/components';
import { UserAccessibleTenantsSelect, UserAccessibleTenantsSelectItem } from '@/features/common';

interface DetailsCarrierAdminProps {
  company: CreateGroupFormValuesType['company'];
  disableCompanySelect?: boolean;
  tenantId: string;
  accessAllowedRestrictions: CreateGroupFormValuesType['accessAllowedRestrictions'];
  allowedRegions: Maybe<string[]>;
  allowedCountries: Maybe<string[]>;
  restrictAccessAllowed: boolean;
  isOwnerLoading?: boolean;
  groupName: string;
  groupNameError?: string;
  owner: CreateGroupFormValuesType['owner'];
  ownerError?: string;
  usersList: CreateGroupFormValuesType['usersList'];
  onCompanyChange: (node: Maybe<UserAccessibleTenantsSelectItem>) => void;
  handleChangeGroupOwner: (event: ChangeEvent<{}>, value: User | null) => void;
  onLimitCountriesChange: (countries: string[], regions: string[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange(e: ChangeEvent<any>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleBlur(e: FocusEvent<any>): void;
  validateNameField: (newName: string) => Promise<string>;
  defaultId?: string;
  editMode: boolean;
  isAdminGroup?: boolean;
}

export const Details = ({
  groupName,
  company,
  tenantId,
  owner,
  usersList,
  onCompanyChange,
  restrictAccessAllowed,
  handleChangeGroupOwner,
  accessAllowedRestrictions,
  allowedRegions,
  allowedCountries,
  onLimitCountriesChange,
  validateNameField,
  handleChange,
  handleBlur,
  groupNameError,
  ownerError,
  defaultId,
  isOwnerLoading = false,
  disableCompanySelect = false,
  isAdminGroup = false,
  editMode,
}: DetailsCarrierAdminProps) => {
  const { t } = useTranslation();

  return (
    <Box position="relative">
      <Box>
        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {t('user.management.user-group.data-access')}
          </Typography>
          <UserAccessibleTenantsSelect
            onChange={onCompanyChange}
            value={company}
            defaultId={defaultId}
            placeholder={t('user.management.user-group.select-company')}
            disabled={disableCompanySelect}
            size="small"
            renderSingleOptionAsDisabledTextField
            sortCarrierCompany
          />
          <FormHelperText>{t('user.management.user-group.limit-access-description')}</FormHelperText>
        </Box>
        {restrictAccessAllowed && (
          <LimitAccessSelect
            limitedCompanies={accessAllowedRestrictions?.countries || []}
            limitedRegions={accessAllowedRestrictions?.regions || []}
            onLimitCountriesChange={onLimitCountriesChange}
            placeholder={t('common.select')}
            accessAllowedRestrictions={accessAllowedRestrictions}
            allowedRegions={allowedRegions}
            allowedCountries={allowedCountries}
          />
        )}
      </Box>
      <Box mb={1}>
        {isOwnerLoading && <Loader overlay />}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t('user.management.add.group.details')}
        </Typography>
        <Field
          name="name"
          id="name"
          type="text"
          validate={validateNameField}
          value={groupName}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {(props: FieldProps) => {
            const { field } = props;

            return (
              <TextField
                id="name"
                name={field.name}
                placeholder={t('user.management.add.group.name')}
                aria-label={t('user.management.add.group.name')}
                size="small"
                required
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                error={!!groupNameError}
                helperText={groupNameError}
                disabled={isOwnerLoading}
                sx={{ mb: 2, height: 48 }}
                fullWidth
              />
            );
          }}
        </Field>
        {((editMode && !isAdminGroup) || !editMode) && (
          <GroupOwnerSelector
            tenantId={tenantId}
            owner={owner}
            handleChange={handleChangeGroupOwner}
            error={ownerError}
            placeholder={t('user.management.user-group.select-group-owner')}
            usersEmailToExclude={usersList.map((user) => user.email)}
          />
        )}
      </Box>
    </Box>
  );
};
