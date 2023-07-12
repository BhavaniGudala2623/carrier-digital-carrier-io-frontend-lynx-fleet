import Box from '@carrier-io/fds-react/Box';
import TreeSelectAutoComplete from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';
import { useTranslation } from 'react-i18next';
import { SyntheticEvent, useMemo } from 'react';

import { getTreeData, getCompanyHierarchyByNodeId } from './utils';
import { getNodeId } from './utils/getNodeId';

import { useApplicationContext } from '@/providers/ApplicationContext';
import { useAppSelector } from '@/stores';
import { getAuth } from '@/features/authentication';

export const CompanyHierarchySelector = () => {
  const { t } = useTranslation();
  const {
    setSelectedCompanyHierarchy,
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();
  const { tenantsHierarchy, loading } = useAppSelector(getAuth);

  const treeData = useMemo(() => getTreeData(t, tenantsHierarchy), [t, tenantsHierarchy]);

  const handleNodeSelect = (_e: SyntheticEvent, newValue: string, nodeId: string) => {
    const data = getCompanyHierarchyByNodeId(nodeId, newValue);
    setSelectedCompanyHierarchy(data);
  };

  return (
    <Box>
      <TreeSelectAutoComplete
        highlightMatchedString
        noResults={t('common.no-results-have-been-found')}
        onNodeSelect={handleNodeSelect}
        selectedNodeId={getNodeId(selectedCompanyHierarchy.type, selectedCompanyHierarchy.id)}
        treeData={treeData}
        isLoading={loading}
        textFieldCompProps={{
          color: 'secondary',
          fullWidth: true,
          hiddenLabel: true,
          hideBackgroundColor: false,
          inputSetting: {
            startAdornment: null,
          },
          placeholder: t('common.search'),
          showUnderline: false,
        }}
        treeSelectProps={{
          ButtonComponentProps: {
            variant: 'text',
            fullWidth: true,
            color: 'secondary',
          },
          closeOptionsOnChange: true,
          controlledBy: 'combined',
        }}
        showAllOptionsOnOpen
      />
    </Box>
  );
};
