import { ICellRendererParams } from '@ag-grid-community/core';
import Tooltip from '@carrier-io/fds-react/Tooltip';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { ScheduledPlanDestination } from '@carrier-io/lynx-fleet-types';

type RecipientCellRendererProps = Omit<ICellRendererParams, 'value'> & { value: ScheduledPlanDestination[] };

const HtmlTooltip = styled(Tooltip)({
  tooltip: {
    height: '200px',
    color: '#9d9d9d',
    backgroundColor: '#fff',
    border: 'solid 4px #9d9d9d',
    borderRadius: '4px',
    fontSize: '12px',
    lineHeight: '14px',
  },
});

export function RecipientCellRenderer({ value }: RecipientCellRendererProps): JSX.Element {
  const len = (value || []).length;
  const { t } = useTranslation();

  return (
    <HtmlTooltip
      title={
        <Box sx={{ maxHeight: '200px', overflow: 'auto', px: 0.5, pt: 1 }}>
          {(value || []).map((m) => (
            <Box sx={{ mb: 1 }} key={m.id}>
              {m.address}
            </Box>
          ))}
        </Box>
      }
    >
      <div style={{ color: '#1c1fd3', cursor: 'pointer' }}>{`${len} ${t('assets.reports.grid.recipients', {
        defaultValue: 'recipients',
      }).toLocaleLowerCase()}`}</div>
    </HtmlTooltip>
  );
}
