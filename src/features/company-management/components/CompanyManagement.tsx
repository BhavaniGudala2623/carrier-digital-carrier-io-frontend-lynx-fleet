import { SubHeaderContainer, DataGridContainer } from '../containers';
import { EditCompanyDialog } from '../tabs/Companies/EditCompanyDialog';
import { EditCompanyProvider } from '../tabs/Companies/providers';

import { TableBox, TableBoxHeader } from '@/components/TableBox';

export const CompanyManagement = () => (
  <TableBox>
    <EditCompanyProvider>
      <TableBoxHeader>
        <SubHeaderContainer />
      </TableBoxHeader>
      <DataGridContainer />
      <EditCompanyDialog />
    </EditCompanyProvider>
  </TableBox>
);
