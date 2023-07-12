import Button from '@carrier-io/fds-react/Button';
import Typography from '@carrier-io/fds-react/Typography';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';

import { useDeleteCompany, useGetSubCompaniesInfo } from '../hooks';

import { Dialog } from '@/components/Dialog';
import { Loader } from '@/components';

interface Props {
  id: string;
  open: boolean;
  onClose: () => void;
  userCount?: Maybe<number>;
  assetCount?: Maybe<number>;
}

export const DeleteCompanyDialog = ({ id, open, onClose, userCount, assetCount }: Props) => {
  const { t } = useTranslation();
  const { hasSubCompaniesWithUsersOrAssets, isCheckingSubCompanies } = useGetSubCompaniesInfo(id);
  const { handleDelete, isDeleteCompanyLoading } = useDeleteCompany(onClose);

  let validationText = t('company.management.delete-has-users', {
    userCount,
    user: userCount && userCount > 1 ? t('common.users') : t('common.user'),
  });

  if (assetCount) {
    validationText = t('company.management.delete-has-assets');
  } else if (hasSubCompaniesWithUsersOrAssets) {
    validationText = t('company.management.delete-has-children');
  } else if (userCount === 0) {
    validationText = '';
  }

  const handleClickDelete = async (tenantId: string) => {
    await handleDelete(tenantId);
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      dialogTitle={`${t('company.management.delete-company')}`}
      content={
        <Box width={480} minHeight={50}>
          {isCheckingSubCompanies ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={50}>
              <Loader />
            </Box>
          ) : (
            <>
              {!!validationText?.length && (
                <Typography variant="body1" mb={2}>
                  {t(validationText)}
                </Typography>
              )}
              {!assetCount && !hasSubCompaniesWithUsersOrAssets && (
                <Typography variant="body1">{t('common.are-you-sure')}</Typography>
              )}
            </>
          )}
        </Box>
      }
      actions={
        <>
          <Button
            variant="outlined"
            color={assetCount || hasSubCompaniesWithUsersOrAssets ? 'primary' : 'secondary'}
            onClick={onClose}
          >
            {t(assetCount || hasSubCompaniesWithUsersOrAssets ? 'common.close' : 'common.cancel')}
          </Button>
          {!assetCount && !hasSubCompaniesWithUsersOrAssets && (
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              disabled={!!assetCount || isDeleteCompanyLoading}
              onClick={() => handleClickDelete(id)}
            >
              {t('common.delete-confirm')}
            </Button>
          )}
        </>
      }
    />
  );
};
