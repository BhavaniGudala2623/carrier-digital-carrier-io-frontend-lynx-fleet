/* eslint-disable react/no-unused-class-component-methods */
import { useEffect, useState } from 'react';
import Select from '@carrier-io/fds-react/Select';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import TextField from '@carrier-io/fds-react/TextField';
import FormControl from '@carrier-io/fds-react/FormControl';
import Box from '@carrier-io/fds-react/Box';
import { TFunction } from 'i18next';

interface CustomAlarmFilterState {
  numAlarms: string;
  operation: 'equals' | 'greater' | 'less';
}

export const CustomAlarmFilter = (
  { filterChangedCallback }: { filterChangedCallback: () => void },
  t: TFunction
) => {
  const [alarmFilter, setAlarmFilter] = useState<CustomAlarmFilterState>({
    numAlarms: '',
    operation: 'equals',
  });

  const operationChange = (e) => {
    const { value } = e.target;

    setAlarmFilter((state) => ({ ...state, operation: value }));
  };

  const numAlarmsChange = (e) => {
    const { value } = e.target;

    setAlarmFilter((state) => ({ ...state, numAlarms: value }));
  };

  useEffect(() => {
    filterChangedCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarmFilter]);

  return (
    <Box sx={{ display: 'inline-block', width: '200px', 'text-align': 'center', padding: '10px' }}>
      <FormControl variant="outlined" size="small">
        <Select
          value={alarmFilter.operation}
          defaultValue="equals"
          name="operation"
          sx={{ width: '150px' }}
          onChange={operationChange}
        >
          <MenuItem value="equals">{t('common.equals')}</MenuItem>
          <MenuItem value="greater">{t('common.greater-than')}</MenuItem>
          <MenuItem value="less">{t('common.less')}</MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      <TextField
        value={alarmFilter.numAlarms}
        onChange={numAlarmsChange}
        showBorder
        size="small"
        sx={{ width: '150px' }}
        type="number"
      />
    </Box>
  );
};
