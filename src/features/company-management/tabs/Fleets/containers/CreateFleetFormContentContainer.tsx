import { ChangeEvent, useState } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { FleetFormContent } from '../components/FleetFormContent';
import { CreateFleetState } from '../types';
import { validateFleetName } from '../components/CreateFleet/validation/validateFleetName';

import { useTenantAssets } from '@/features/common';
import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

interface Props {
  onClose: () => void;
  loading: boolean;
}

export const CreateFleetFormContentContainer = ({ onClose, loading }: Props) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  const { values, handleChange, setFieldValue, validateField, setFieldError } =
    useFormikContext<CreateFleetState>();
  const { assets, isAssetsLoading } = useTenantAssets(values.tenantId);

  const validateNameField = async (name: string) => {
    const errorMessage = await validateFleetName(name, values.tenantId);

    return errorMessage ? t(errorMessage) : '';
  };

  const onSearchTextChange = (value: Maybe<string>) => {
    setSearchText(value ?? '');
  };

  const onSelectedAssetIdsChanged = (assetIds: string[]) => {
    setFieldValue('assetIds', assetIds);
    if (assetIds.length === 0) {
      setFieldError('assetIds', t('company.management.error.assets_required'));
    }
  };

  const onCompanyChange = (node: SelectedCompanyHierarchy) => {
    setFieldValue('assetIds', []);
    setFieldValue('tenantId', node.id);
    validateField('name');
    if (node.id) {
      setFieldError('tenantId', t('company.management.fleet-tenant-validation'));
    } else {
      setFieldError('tenantId', '');
    }
  };

  const onNameChange = (e: ChangeEvent) => {
    handleChange(e);
    validateField('name');
  };

  return (
    <FleetFormContent
      company={null}
      disabledCompany={false}
      isAssetsLoading={isAssetsLoading}
      assets={assets}
      validateName={validateNameField}
      onSearchTextChange={onSearchTextChange}
      onSelectedAssetIdsChanged={onSelectedAssetIdsChanged}
      onCompanyChange={onCompanyChange}
      onNameChange={onNameChange}
      searchText={searchText}
      onClose={onClose}
      isFleetSaving={loading}
    />
  );
};
