import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import Grid from '@carrier-io/fds-react/Grid';
import Typography from '@carrier-io/fds-react/Typography';
import { Description, DescriptionVariants } from '@carrier-io/fds-react/patterns/Description';
import { useTranslation } from 'react-i18next';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { companyTypeEntity } from '../../constants';

import { CompanyDetailsDialogProps } from './types';

import { CompanyAddressRenderer, CompanyAdminRenderer, Dialog, ErrorBox } from '@/components';
import { companyActionPayload } from '@/features/authorization';

export const CompanyDetailsDialog = ({ companyId, open, onClose, onEdit }: CompanyDetailsDialogProps) => {
  const { t } = useTranslation();
  const { hasPermission } = useRbac();

  const showEditButton = hasPermission(companyActionPayload('company.edit', companyId));

  const { loading, error, data } = CompanyService.useGetTenantById({
    id: companyId,
  });

  const company = data?.getTenantById;

  const getDialogContent = () => {
    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" fontSize={60}>
          <ErrorBox message={error.message} variant="h4" errorIconFontSize={30} />
        </Box>
      );
    }

    const notAvailableText = t('common.n-a');
    const companyTypeText =
      (company?.companyType && t(companyTypeEntity[company.companyType])) || company?.companyType;

    const descriptionItems = [
      { label: t('common.components.parent-company'), text: company?.parentName ?? notAvailableText },
      {
        label: t('company.management.company-type'),
        text: companyTypeText ?? notAvailableText,
      },
      {
        label: t('company.management.drawer.company-address'),
        text: company?.contactInfo && <CompanyAddressRenderer contactInfo={company.contactInfo} />,
      },
      {
        label: t('common.components.phone-number'),
        text: company?.contactInfo?.phone,
      },
      {
        label: t('company.management.company-admin'),
        text: company?.contactInfo && <CompanyAdminRenderer contactInfo={company.contactInfo} />,
      },
    ];

    // TODO: change backgroundColor to background.desktop
    return (
      <Grid container minHeight={340}>
        <Grid item xs={12} sx={{ backgroundColor: '#f1f3f4' }} padding={2}>
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%" fontSize={100}>
              <CircularProgress size={40} />
            </Box>
          )}

          {!loading && (
            <>
              <Typography variant="subtitle1" marginBottom={1.25}>
                {company?.name}
              </Typography>

              <Description
                rowIndentCssUnit="rem"
                rowIndentValue={1.25}
                variant={DescriptionVariants.HorizontalJustifiedWithNoDots}
                sx={{ minHeight: 260, backgroundColor: '#f1f3f4' }}
              >
                {descriptionItems.map(({ label, text }) => (
                  <Description.Item TextProps={{ textAlign: 'right' }} key={label} label={label}>
                    {text}
                  </Description.Item>
                ))}
              </Description>
            </>
          )}
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dialogTitle={t('company.management.company-details')}
      content={getDialogContent()}
      fullWidth
      maxWidth="md"
      actions={
        <>
          {showEditButton && (
            <Button
              sx={{ marginRight: 'auto' }}
              onClick={onEdit}
              color="primary"
              variant="text"
              disabled={Boolean(loading || error)}
            >
              {t('company.management.edit-company')}
            </Button>
          )}
          <Button autoFocus onClick={onClose} color="primary" variant="outlined">
            {t('common.close')}
          </Button>
        </>
      }
    />
  );
};
