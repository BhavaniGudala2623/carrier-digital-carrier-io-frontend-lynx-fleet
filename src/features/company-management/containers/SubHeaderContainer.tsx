import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@carrier-io/fds-react/Grid';
import Button from '@carrier-io/fds-react/Button';
import SearchBox, { OnSearchBoxChange } from '@carrier-io/fds-react/patterns/SearchBox';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { Company, Maybe } from '@carrier-io/lynx-fleet-types';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { useCompanyManagementState, companyManagementSlice } from '../stores';
import { CompanyDetailsDialog } from '../components/CompanyDetailsDialog';
import { useEditCompany } from '../tabs/Companies/providers';

import { useAppDispatch } from '@/stores';
import { useToggle } from '@/hooks';
import { companyActionPayload } from '@/features/authorization';
import { CompanyHierarchySelector } from '@/components';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const SubHeaderContainer = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    actions: { setSearchText },
  } = companyManagementSlice;
  const { searchText, selectedTableCompaniesIds } = useCompanyManagementState();
  const { handleOpenEditCompanyForm } = useEditCompany();
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();
  const isItemACompany = selectedCompanyHierarchy.type === 'COMPANY';

  const {
    value: openCompanyDetailsDialog,
    toggleOn: handleOpenCompanyDetailsDialog,
    toggleOff: handleCloseCompanyDetailsDialog,
  } = useToggle(false);

  const { hasPermission } = useRbac();

  const handleSearchChange = useCallback(
    ({ text = '' }: OnSearchBoxChange) => {
      dispatch(setSearchText(text));
    },
    [dispatch, setSearchText]
  );

  useEffect(
    () => () => {
      dispatch(setSearchText(''));
    },
    [dispatch, setSearchText]
  );

  const getCompanyIdForDetails = (): Maybe<Company['id']> => {
    if (selectedTableCompaniesIds.length === 1) {
      return selectedTableCompaniesIds[0];
    }

    if (selectedTableCompaniesIds.length > 1 || !(isItemACompany && selectedCompanyHierarchy.id)) {
      return null;
    }

    return selectedCompanyHierarchy.id;
  };

  const companyIdForDetails = getCompanyIdForDetails();

  const viewCompanyAllowed = useMemo(
    () => hasPermission(companyActionPayload('company.view', companyIdForDetails ?? '')),
    [hasPermission, companyIdForDetails]
  );

  return (
    <Grid container>
      <Grid xs={8} display="flex" item alignItems="center">
        <CompanyHierarchySelector />
        <SearchBox
          TextFieldProps={{
            placeholder: t('common.search'),
            value: searchText,
            showBorder: false,
            onKeyDown: (event) => {
              if (event.key === 'Enter') {
                event.stopPropagation();
              }
            },
          }}
          AutocompleteProps={{
            renderTags: () => null,
          }}
          onChange={handleSearchChange}
          size="small"
          sx={{
            width: '352px',
            ml: 2,
          }}
          filledInputStyles={{ backgroundColor: fleetThemeOptions.palette.addition.filledInputBackground }}
        />
      </Grid>
      <Grid item xs={4} display="flex" alignItems="center" justifyContent="flex-end">
        {viewCompanyAllowed && (
          <Button variant="text" onClick={handleOpenCompanyDetailsDialog} disabled={!companyIdForDetails}>
            {t('company.management.company-details')}
          </Button>
        )}
      </Grid>
      {openCompanyDetailsDialog && companyIdForDetails && viewCompanyAllowed && (
        <CompanyDetailsDialog
          companyId={companyIdForDetails}
          open={openCompanyDetailsDialog}
          onClose={handleCloseCompanyDetailsDialog}
          onEdit={() => handleOpenEditCompanyForm(companyIdForDetails)}
        />
      )}
    </Grid>
  );
};
