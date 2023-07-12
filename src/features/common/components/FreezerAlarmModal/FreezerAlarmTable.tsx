import { memo, useMemo } from 'react';
import { FreezerControlType } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Table from '@carrier-io/fds-react/Table';
import TableContainer from '@carrier-io/fds-react/TableContainer';
import TableHead from '@carrier-io/fds-react/TableHead';
import TableRow from '@carrier-io/fds-react/TableRow';
import TableCell from '@carrier-io/fds-react/TableCell';
import TableBody from '@carrier-io/fds-react/TableBody';
import { ColDef } from '@ag-grid-community/core';
import { useTranslation } from 'react-i18next';

import { FreezerAlarmWithRecommendedAction } from '../../types';

import { getColumns } from './freezerAlarmColumns';

import { Loader } from '@/components';

interface FreezerAlarmTableProps {
  data: FreezerAlarmWithRecommendedAction[];
  activeAlarms?: boolean;
  controllerType?: FreezerControlType;
  loading?: boolean;
}

export const FreezerAlarmTable = memo(
  ({ data, controllerType, loading = false, activeAlarms = false }: FreezerAlarmTableProps) => {
    const { t } = useTranslation();

    const columns: ColDef[] = useMemo(
      () => getColumns(t, controllerType, activeAlarms),
      [activeAlarms, controllerType, t]
    );

    return (
      <Box height="15rem">
        {loading ? (
          <Loader overlay />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map(({ headerName, field }, i) => (
                    <TableCell key={field} {...(i === 0 && { sx: { pl: 3 } })}>
                      {headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.code}>
                    {columns.map(({ field, colId }, i) => {
                      const emptyValue = colId === 'recommendation' ? '' : '-';

                      return (
                        <TableCell key={field} {...(i === 0 && { sx: { pl: 3 } })}>
                          {field && row[field] ? row[field.toLowerCase()] : emptyValue}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  }
);

FreezerAlarmTable.displayName = 'FreezerAlarmTable';
