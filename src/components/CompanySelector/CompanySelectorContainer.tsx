import { ReactNode, SyntheticEvent, useMemo, useState, useCallback, memo } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import { TextFieldProps } from '@carrier-io/fds-react/TextField';
import { TreeSelectAutoCompleteProps } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';

import { getCompanyHierarchyByNodeId, getTreeData } from './utils';
import { CompanySelector } from './CompanySelector';

import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';
import { useAppSelector } from '@/stores';
import { getAuth } from '@/features/authentication';

interface CompanySelectContainerProps {
  company: Maybe<SelectedCompanyHierarchy>;
  onCompanyChange?: (node: SelectedCompanyHierarchy) => void;
  disabled?: boolean;
  placeholder?: string;
  inputSetting?: TextFieldProps['inputSetting'];
  error?: boolean;
  helperText?: ReactNode;
  onClear?: TreeSelectAutoCompleteProps['onClear'];
  searchBoxChangeHandler?: TreeSelectAutoCompleteProps['searchBoxChangeHandler'];
  excludeCompanies?: string[];
}

export const CompanySelectorContainer = memo(
  ({
    company,
    onCompanyChange,
    disabled = false,
    placeholder,
    error,
    inputSetting,
    helperText,
    searchBoxChangeHandler,
    onClear,
    excludeCompanies,
  }: CompanySelectContainerProps) => {
    const { t } = useTranslation();
    const [selectedNode, setSelectedNode] = useState<SelectedCompanyHierarchy | null>(company);
    const { tenantsHierarchy, loading } = useAppSelector(getAuth);

    const treeData = useMemo(
      () => getTreeData(t, tenantsHierarchy, false, excludeCompanies),
      [t, tenantsHierarchy, excludeCompanies]
    );

    const handleNodeSelect = useCallback(
      (_e: SyntheticEvent, newValue: string, nodeId: string) => {
        const data = getCompanyHierarchyByNodeId(nodeId, newValue);
        onCompanyChange?.(data);
        setSelectedNode(data);
      },
      [onCompanyChange]
    );

    return (
      <CompanySelector
        handleNodeSelect={handleNodeSelect}
        treeData={treeData}
        loading={loading}
        selectedNode={selectedNode}
        disabled={disabled}
        helperText={helperText}
        error={error}
        placeholder={placeholder}
        inputSetting={inputSetting}
        searchBoxChangeHandler={searchBoxChangeHandler}
        onClear={onClear}
      />
    );
  }
);

CompanySelectorContainer.displayName = 'CompanySelectorContainer';
