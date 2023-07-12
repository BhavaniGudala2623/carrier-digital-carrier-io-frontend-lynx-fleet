import { useState, useEffect } from 'react';
import { Maybe, AssetRow } from '@carrier-io/lynx-fleet-types';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { validateFleetName } from '../components/CreateFleet/validation/validateFleetName';
import { FleetFormContent } from '../components/FleetFormContent';

import { useAppSelector } from '@/stores';
import { getTenantByIdFromHierarchy } from '@/features/authentication';

export interface EditFleetFormValues {
  name: string;
  assetIds: string[];
  tenantId: string;
}

interface EditFleetFormContentProps {
  assets?: AssetRow[];
  onClose: () => void;
  loading: boolean;
}

export const EditFleetFormContentContainer = ({ onClose, assets, loading }: EditFleetFormContentProps) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const { initialValues, values, setFieldValue, touched, setFieldTouched, setErrors, errors, validateForm } =
    useFormikContext<EditFleetFormValues>();
  const company = useAppSelector((state) => getTenantByIdFromHierarchy(state, values.tenantId));

  useEffect(() => {
    if (values.assetIds.length === 0) {
      setErrors({
        ...errors,
        assetIds: t('company.management.error.assets_required'),
      });
    } else {
      const { assetIds, ...rest } = errors;
      setErrors(rest);
    }

    validateForm(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.assetIds, errors, setErrors, t, validateForm, values.name]);

  const validateNameField = async (name: string) => {
    if (touched.name && initialValues.name !== values.name) {
      const errorMessage = await validateFleetName(name, values.tenantId);

      return errorMessage ? t(errorMessage) : '';
    }

    return '';
  };

  const onSearchTextChange = (value: Maybe<string>) => {
    setSearchText(value ?? '');
  };

  const onSelectedAssetIdsChanged = (assetIds: string[]) => {
    setFieldValue('assetIds', assetIds);
    setFieldTouched('assetIds', true);
  };

  return (
    <FleetFormContent
      company={company ? { type: 'COMPANY', id: company.id, name: company.name } : null}
      disabledCompany
      assets={assets}
      validateName={validateNameField}
      onSearchTextChange={onSearchTextChange}
      onSelectedAssetIdsChanged={onSelectedAssetIdsChanged}
      searchText={searchText}
      onClose={onClose}
      isFleetSaving={loading}
    />
  );
};

EditFleetFormContentContainer.displayName = 'EditFleetFormContentContainer';
