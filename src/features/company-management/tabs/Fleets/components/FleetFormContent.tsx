import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, useFormikContext } from 'formik';
import { AssetRow, Maybe } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import FormControl from '@carrier-io/fds-react/FormControl';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';
import Paper from '@carrier-io/fds-react/Paper';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import SearchBox from '@carrier-io/fds-react/patterns/SearchBox';

import { CreateFleetState } from '../types';

import { FleetAssetsTableContainer } from './FleetAssetsTableContainer';

import { CompanySelector as AllCompaniesSelector, Loader } from '@/components';
import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

interface Props {
  onClose: () => void;
  disabledCompany: boolean;
  isFleetSaving: boolean;
  isAssetsLoading?: boolean;
  searchText: string;
  onSearchTextChange: (value: Maybe<string>) => void;
  validateName: (name: string) => Promise<string>;
  onNameChange?: (e: ChangeEvent) => void;
  onCompanyChange?: (node: SelectedCompanyHierarchy) => void;
  company: Maybe<SelectedCompanyHierarchy>;
  assets?: AssetRow[];
  onSelectedAssetIdsChanged: (ids: string[]) => void;
}

export const FleetFormContent = ({
  onNameChange,
  onCompanyChange,
  validateName,
  onClose,
  disabledCompany,
  isFleetSaving,
  isAssetsLoading,
  searchText,
  onSearchTextChange,
  assets,
  onSelectedAssetIdsChanged,
  company,
}: Props) => {
  const { t } = useTranslation();

  const { isValid, values, errors, handleBlur, touched, handleChange } = useFormikContext<CreateFleetState>();

  return (
    <Form>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column" width={480} mb={2.5}>
          <Field
            id="name"
            name="name"
            validate={validateName}
            value={values.name}
            onChange={onNameChange ?? handleChange}
            onBlur={handleBlur}
          >
            {({ field }: FieldProps) => (
              <TextField
                id="name"
                name="name"
                placeholder={t('company.management.fleet-name')}
                size="small"
                sx={{ mb: 2.5 }}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                fullWidth
              />
            )}
          </Field>
          <FormControl>
            <Box height={60}>
              <AllCompaniesSelector
                company={company}
                onCompanyChange={onCompanyChange ?? handleChange}
                placeholder={t('common.company')}
                disabled={disabledCompany}
                error={touched.tenantId && Boolean(errors.tenantId)}
                helperText={touched.tenantId && errors.tenantId}
              />
            </Box>
          </FormControl>
        </Box>
        <Paper variant="outlined" sx={{ mb: 1, display: 'flex', flexDirection: 'column' }}>
          <FormControl>
            <FleetAssetsTableContainer
              quickFilterText={searchText}
              assets={assets}
              onSelectedAssetIdsChanged={onSelectedAssetIdsChanged}
              selectedAssetIds={values.assetIds}
              loading={values.tenantId ? isAssetsLoading : false}
              HeaderProps={{
                sx: {
                  justifyContent: 'space-between',
                  borderBottom: '1px solid',
                  borderColor: 'secondary.light',
                  p: 1,
                },
              }}
              headerContent={
                <>
                  <SearchBox
                    multiple={false}
                    size="small"
                    TextFieldProps={{
                      placeholder: t('common.search'),
                      showBorder: false,
                      sx: {
                        minWidth: '352px',
                      },
                    }}
                    onChange={({ text }) => onSearchTextChange(text)}
                  />
                  <Typography variant="body1">
                    {t(
                      values.assetIds.length === 1
                        ? 'common.count-item-selected'
                        : 'common.count-items-selected',
                      {
                        selected: values.assetIds.length,
                      }
                    )}
                  </Typography>
                </>
              }
            />
          </FormControl>
        </Paper>
        {errors.assetIds && (
          <FormHelperText error variant="filled">
            {errors.assetIds}
          </FormHelperText>
        )}
        <Box display="flex" justifyContent="flex-end" mt={2.5}>
          <Button color="secondary" variant="outlined" sx={{ ml: 'auto' }} onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            disabled={isFleetSaving || (touched && !isValid)}
            sx={{ ml: 2 }}
            color="primary"
            variant="outlined"
            type="submit"
          >
            {t('common.save')}
          </Button>
        </Box>
        {isFleetSaving && <Loader overlay />}
      </Box>
    </Form>
  );
};

FleetFormContent.displayName = 'FleetFormContent';
