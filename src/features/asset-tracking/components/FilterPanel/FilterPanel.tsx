import Box from '@carrier-io/fds-react/Box';

import { AutocompleteFilterContainer } from '../../containers/AutocompleteFilterContainer';

import { TableBoxHeader } from '@/components/TableBox';
import { CompanyHierarchySelector } from '@/components';

export const FilterPanel = () => (
  <TableBoxHeader spaceBetween>
    <Box display="flex" alignItems="center">
      <Box>
        <CompanyHierarchySelector />
      </Box>
      <Box mx={1}>
        <AutocompleteFilterContainer />
      </Box>
    </Box>
  </TableBoxHeader>
);
