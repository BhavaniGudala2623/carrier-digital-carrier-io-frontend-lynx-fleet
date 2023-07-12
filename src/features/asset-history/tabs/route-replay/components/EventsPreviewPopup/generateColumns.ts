import { PopupPreviewColumns } from '../../types';

import { Columns } from '@/types';
import { UserSettings } from '@/providers/UserSettings';

type GenerateColumnsProps = {
  userSettings: UserSettings;
};

export const generateColumns = ({ userSettings }: GenerateColumnsProps): PopupPreviewColumns | Columns => {
  const { dateFormat, timezone } = userSettings;

  return [
    {
      colId: 'event',
      field: 'name',
      cellRenderer: 'eventCellRenderer',
      minWidth: 340,
      maxWidth: 340,
      lockPosition: 'left',
      flex: 3,
    },
    {
      colId: 'time',
      field: 'time',
      cellRenderer: 'dateTimeCellRenderer',
      cellRendererParams: { options: { dateFormat, timezone } },
      maxWidth: 101,
      lockPosition: 'right',
      flex: 1,
    },
  ];
};
