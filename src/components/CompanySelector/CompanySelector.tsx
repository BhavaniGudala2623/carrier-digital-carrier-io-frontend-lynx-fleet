import Box from '@carrier-io/fds-react/Box';
import TreeSelectAutoComplete, {
  TreeItemModel,
  TreeSelectAutoCompleteProps,
} from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';
import { TextFieldProps } from '@carrier-io/fds-react/TextField';
import { useTranslation } from 'react-i18next';
import { ReactNode, SyntheticEvent } from 'react';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { getNodeId } from '../CompanyHierarchySelector';

import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

interface CompanySelectProps {
  treeData: (TreeItemModel & { [key: string]: unknown })[];
  handleNodeSelect?: (e: SyntheticEvent, value: string, nodeId: string) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: ReactNode;
  loading?: boolean;
  selectedNode: SelectedCompanyHierarchy | null;
  inputSetting?: TextFieldProps['inputSetting'];
  onClear?: TreeSelectAutoCompleteProps['onClear'];
  searchBoxChangeHandler?: TreeSelectAutoCompleteProps['searchBoxChangeHandler'];
}

export const CompanySelector = ({
  disabled = false,
  placeholder = '',
  error,
  helperText,
  handleNodeSelect,
  loading,
  treeData,
  selectedNode,
  inputSetting = {},
  onClear,
  searchBoxChangeHandler,
}: CompanySelectProps) => {
  const { t } = useTranslation();

  return (
    <Box>
      <TreeSelectAutoComplete
        highlightMatchedString
        noResults={t('common.no-results-have-been-found')}
        onNodeSelect={handleNodeSelect}
        treeData={treeData}
        isLoading={loading}
        selectedNodeId={selectedNode ? getNodeId(selectedNode.type, selectedNode.id) : undefined}
        textFieldCompProps={{
          size: 'small',
          color: 'secondary',
          fullWidth: true,
          hiddenLabel: true,
          hideBackgroundColor: false,
          error,
          helperText,
          inputSetting: {
            ...inputSetting,
            startAdornment: null,
          },
          placeholder: placeholder || t('common.search'),
          showUnderline: false,
          sx: {
            '.MuiInputBase-root': {
              maxHeight: 48,
              borderRadius: '4px !important',
              backgroundColor: fleetThemeOptions.palette.action.disabledBackground,
              '& > input.MuiInputBase-input': {
                ml: '0 !important',
                height: 31,
              },
              '& > .endAdornment button.MuiButton-root': {
                ...(disabled ? { display: 'none' } : {}),
                width: 29,
                height: 29,
                mr: '-4px',

                '& > svg[data-testid="CloseIcon"]': {
                  width: 20,
                  height: 20,
                  margin: '0 auto',
                },
              },
            },
          },
          disabled,
        }}
        treeSelectProps={{
          closeOptionsOnChange: true,
          controlledBy: 'input',
          showInputArrow: !disabled,
        }}
        searchBoxChangeHandler={searchBoxChangeHandler}
        onClear={onClear}
        showAllOptionsOnOpen
      />
    </Box>
  );
};
