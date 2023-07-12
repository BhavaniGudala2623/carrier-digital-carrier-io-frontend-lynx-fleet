import { ChangeEvent, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import { User } from '@carrier-io/lynx-fleet-types';

import { CompanyUserSelector } from './CompanyUserSelector';

interface DeleteUserPopUpContentProps {
  isPrimaryContact: boolean;
  tenantId: string;
  tenantName: string;
  ownerEmail: string;
  groupNames: string[];
  setNewOwnerEmail: (email: string | null) => void;
}

export const DeleteUserPopUpContent = ({
  isPrimaryContact,
  tenantId,
  tenantName,
  ownerEmail,
  groupNames,
  setNewOwnerEmail,
}: DeleteUserPopUpContentProps) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (_event: ChangeEvent<{}>, value: User | null) =>
      value ? setNewOwnerEmail(value.email) : setNewOwnerEmail(null),
    [setNewOwnerEmail]
  );

  const ownerDescription = isPrimaryContact ? (
    <Trans
      i18nKey="user.management.user.delete-user.change-company-admin-description"
      values={{
        companyName: tenantName,
      }}
    />
  ) : (
    <Trans
      i18nKey="user.management.user.delete-user.change-group-owner-description"
      values={{
        groupNames: groupNames.join(', '),
      }}
    />
  );

  const ownerDetails = isPrimaryContact
    ? t('user.management.user.delete-user.change-company-admin')
    : t('user.management.user.delete-user.change-group-owner');

  return isPrimaryContact || groupNames.length > 0 ? (
    <>
      <Typography mb={2} variant="body1">
        {ownerDescription}
      </Typography>
      <Typography mb={2} variant="body1">
        {ownerDetails}
      </Typography>
      <CompanyUserSelector tenantId={tenantId} ownerEmail={ownerEmail} handleChange={handleChange} />
    </>
  ) : (
    <>
      <Typography mb={2} variant="body1">
        {t('user.management.user.delete-user.not-owner')}
      </Typography>
      <Typography mb={2} variant="body1">
        {t('user.management.user.sure-delete-user')}
      </Typography>
    </>
  );
};
