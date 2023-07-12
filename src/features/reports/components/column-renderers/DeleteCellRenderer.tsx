/**
 * A special tooltip cell renderer for the recipients in the <ReportGrid>
 */
import { ICellRendererParams } from '@ag-grid-community/core';
import Box from '@carrier-io/fds-react/Box';
import { Delete } from '@mui/icons-material';
import IconButton from '@carrier-io/fds-react/IconButton';
import { LookerUserProviderState } from '@carrier-io/lynx-fleet-types';

import { isCompanyAdmin, isSubCompanyAdmin, isSystemAdmin } from '../../utils';

type DeleteCellRendererProps = ICellRendererParams & {
  ctx: Partial<LookerUserProviderState>;
  deleteClickHandler: (planId: string | number) => void;
};

export function DeleteCellRenderer(props: DeleteCellRendererProps): JSX.Element | null {
  const {
    data: { id, user_id },
    ctx,
    deleteClickHandler,
  } = props;

  // If the user is System Admin / Company Admin / Sub Company Admin -OR-
  // the owner of the scheduled plan itself, then it can be deleted
  // Logically, they will only see Scheduled Plans for which they access to anyway in the
  // folder hierarchy
  const canBeDeleted =
    isSystemAdmin(ctx?.user?.groupNames || []) ||
    isCompanyAdmin(ctx?.user?.groupNames || []) ||
    isSubCompanyAdmin(ctx?.user?.groupNames || []) ||
    `${ctx?.user?.id}` === user_id;

  return canBeDeleted ? (
    <Box>
      <IconButton onClick={() => deleteClickHandler(id)}>
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  ) : null;
}
