import { Trans, useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';

interface MakeUserAdminDialogContentProps {
  prevOwner: string;
  newOwner: string;
}

export const MakeUserAdminDialogContent = ({ prevOwner, newOwner }: MakeUserAdminDialogContentProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography sx={{ marginBottom: 2 }} variant="body1">
        <Trans
          i18nKey="user.management.user.delete-user.make-new-company-admin-description"
          values={{
            prevOwner,
            newOwner,
          }}
        />
      </Typography>
      <Typography sx={{ marginBottom: 2 }} variant="body1">
        {t('common.are-you-sure')}
      </Typography>
    </>
  );
};
