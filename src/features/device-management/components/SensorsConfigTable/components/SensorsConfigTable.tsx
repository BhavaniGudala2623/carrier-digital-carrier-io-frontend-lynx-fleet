import { useContext, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash-es';
import { ColumnMovedEvent, SortChangedEvent, CellDoubleClickedEvent } from '@ag-grid-community/core';
import { styled } from '@mui/material';
import { BluetoothService } from '@carrier-io/lynx-fleet-data-lib';

import {
  SensorsConfigTableProps,
  SensorVersion,
  ParamsProps,
  SensorValueFormatterTypeParamsProps,
  SensorType,
} from '../../../types';
import { DeviceCommissioningContext } from '../../../providers';
import {
  SensorLocationFormatter,
  ConnectionLocationFormatter,
  SensorCompatibleFormatter,
  SensorInstalledFormatter,
  SensorFieldFormatter,
  SensorMacIdFormatter,
  SensorValueFormatter,
  SensorTypeFormatter,
  ConfirmationFormatter,
} from '../formatters';

import { getSensorGridColumns } from './sensorGridColumns';
import { BluetoothSensorMacIdDialog } from './BluetoothSensorMacIdDialog';

import { getErrorMessage } from '@/utils/getErrorMessage';
import { useUserSettings } from '@/providers/UserSettings';
import { applyComposedColumnsUserSettings } from '@/utils/saved-columns';
import { Table } from '@/components';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { useToggle, useEvent } from '@/hooks';

const StyledTable = styled(Table)({
  '& .ag-cell-last-left-pinned': {
    borderLeftColor: 'white',
  },
  '& .ag-center-cols-container .ag-cell:not(:last-child)': {
    borderRight: '1px solid #E0E0E0',
  },
  '& .ag-center-cols-container .ag-cell:nth-last-child(2)': {
    borderRight: 'none',
  },
  '& .ag-pinned-left-header': {
    borderRightColor: 'addition.divider',
  },
  '& .ag-cell.ag-cell-last-left-pinned:not(.ag-cell-range-right):not(.ag-cell-range-single-cell)': {
    borderRightColor: 'addition.divider',
  },
  '& .ag-pinned-right-header': {
    borderLeftColor: 'addition.divider',
  },
  '& .ag-cell.ag-cell-first-right-pinned:not(.ag-cell-range-left):not(.ag-cell-range-single-cell)': {
    borderLeftColor: 'addition.divider',
  },
  '& .ag-center-cols-container .cellWithDateTimePicker .MuiInputBase-input': {
    paddingLeft: 0,
  },
  '& .ag-center-cols-container .ag-cell.cellWithSelect': {
    '& > div > span': {
      width: '100%',
      '& .MuiSelect-select': {
        padding: 0,
      },
      '& .MuiInputLabel-root': {
        transform: 'translate(0, 10px)',
      },
    },
    '& > div': {
      width: '100%',
    },
  },
  '& .ag-center-cols-container .ag-cell.cellWithSelect .ag-react-container': {
    width: '100%',
  },
  '& .ag-header > div': {
    borderTop: `solid 1px ${'addition.divider'}`,
  },
  '& .ag-header-viewport .ag-header-cell:not(:last-child)': {
    borderRight: (theme) => `1px solid ${theme.palette.addition.divider}`,
  },
  '& .ag-root-wrapper': {
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
  },
});

export function SensorsConfigTable({
  onGridReady,
  onColumnsChanged,
  getMainMenuItems,
  isFuelLevelSensor,
  isDoorSensor,
  isTemperatureSensor,
  isTemperatureSensor1WireBLE,
  handleChangeSensorField,
  handleChangeConfigured,
  toggleFuelLevelConfiguration,
  sensorVersion,
  regularSensorsGridApiRef,
}: SensorsConfigTableProps) {
  const [macIdOptions, setMacIdOptions] = useState<string[]>([]);
  const [selectedMacIdRowData, setSelectedMacIdRowData] = useState<SensorType>();
  const [isLoadingMacIds, setIsLoadingMacIds] = useState(false);
  const { t } = useTranslation();
  const { featureFlags } = useApplicationContext();
  const { permissions, snapshot } = useContext(DeviceCommissioningContext);
  const { userSettings } = useUserSettings();
  const { timezone, dateFormat } = userSettings;
  const { deviceEditAllowed: editAllowed } = permissions;
  const isCommissionedSensor = snapshot.device?.commissionedOn;

  const {
    value: isBluetoothMacIdDialogOpen,
    toggleOn: handleBluetoothMacIdDialogOpen,
    toggleOff: handleBluetoothMacIdDialogClose,
  } = useToggle(false);

  const isFeatureDeviceCommissioningSensorTimestampsEnabled =
    featureFlags.REACT_APP_FEATURE_DEVICE_COMMISSIONING_SENSOR_TIMESTAMPS;

  const isFeatureDeviceCommissioningSensorBLEnabled =
    featureFlags.REACT_APP_FEATURE_DEVICE_COMMISSIONING_SENSOR_BLE;

  const defaultSensorColumns = useMemo(
    () =>
      getSensorGridColumns(
        t,
        editAllowed,
        sensorVersion,
        dateFormat,
        timezone,
        isFeatureDeviceCommissioningSensorTimestampsEnabled,
        isFeatureDeviceCommissioningSensorBLEnabled,
        isTemperatureSensor1WireBLE,
        isCommissionedSensor
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, editAllowed, sensorVersion, dateFormat, timezone, isFeatureDeviceCommissioningSensorTimestampsEnabled]
  );

  const { deviceCommissioningSensorsColumns, deviceCommissioningDatacoldSensorsColumns } = userSettings;

  const savedSensorColumns = useMemo(() => {
    if (sensorVersion === SensorVersion.Regular) {
      return applyComposedColumnsUserSettings(defaultSensorColumns, deviceCommissioningSensorsColumns);
    }

    if (sensorVersion === SensorVersion.Datacold) {
      return applyComposedColumnsUserSettings(
        defaultSensorColumns,
        deviceCommissioningDatacoldSensorsColumns
      );
    }

    return undefined;
  }, [
    sensorVersion,
    deviceCommissioningDatacoldSensorsColumns,
    deviceCommissioningSensorsColumns,
    defaultSensorColumns,
  ]);

  const frameworkComponents = {
    sensorFieldFormatter: SensorFieldFormatter,
    sensorLocationFormatter: (params: ParamsProps) =>
      SensorLocationFormatter(params, {
        handleChangeSensorField,
        isDoorSensor,
        isTemperatureSensor,
        editAllowed,
      }),
    sensorMacIdFormatter: (params: ParamsProps) => SensorMacIdFormatter(params),
    sensorValueFormatter: (params: SensorValueFormatterTypeParamsProps) =>
      SensorValueFormatter(params, { translate: t }),
    sensorTypeFormatter: (params: ParamsProps) =>
      SensorTypeFormatter(params, {
        isTemperatureSensor1WireBLE,
      }),
    sensorInstalledFormatter: (params: ParamsProps) =>
      SensorInstalledFormatter(params, { handleChangeSensorField }),
    connectionLocationFormatter: (params: ParamsProps) =>
      ConnectionLocationFormatter(params, {
        handleChangeSensorField,
        translate: t,
        editAllowed,
      }),
    confirmationFormatter: (params: ParamsProps) =>
      ConfirmationFormatter(params, {
        sx: {
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
        },
        isFuelLevelSensor,
        isTemperatureSensor1WireBLE,
        handleChangeConfigured,
        toggleFuelLevelConfiguration,
        editAllowed,
      }),
    sensorCompatibleFormatter: (params: ParamsProps) =>
      SensorCompatibleFormatter(params, {
        isTemperatureSensor1WireBLE,
        sensorVersion,
      }),
  };

  const handleColumnChange = (params: ColumnMovedEvent | SortChangedEvent) =>
    onColumnsChanged?.(params, defaultSensorColumns);

  const handleColumnChangeDebounced = debounce(handleColumnChange, 300);

  const handleMacIdDoubleClick = (event: CellDoubleClickedEvent) => {
    const clickedColumn = event.colDef.field;
    const { data } = event;
    const { dataField, idField } = data;
    const isTempWirelessSensor = isTemperatureSensor1WireBLE?.(dataField, idField);

    if (clickedColumn === 'sensorMacId' && isTempWirelessSensor && !isCommissionedSensor) {
      setSelectedMacIdRowData(data);
      handleBluetoothMacIdDialogOpen();
    }
  };

  const updateRowData = (updatedData) => {
    if (regularSensorsGridApiRef?.current) {
      const rowNode = regularSensorsGridApiRef.current?.getRowNode(updatedData.dataField);

      if (rowNode) {
        rowNode.setData(updatedData);
        regularSensorsGridApiRef.current?.refreshCells({ rowNodes: [rowNode], force: true });
      }
    }
  };

  const handleChangeMacId = useEvent((macId: string): void => {
    const dataField = selectedMacIdRowData?.dataField;

    updateRowData({ ...selectedMacIdRowData, macId });
    handleChangeSensorField(macId, dataField ?? '', 'macId');
    handleBluetoothMacIdDialogClose();
  });

  useEffect(() => {
    if (isBluetoothMacIdDialogOpen) {
      setIsLoadingMacIds(true);

      BluetoothService.getReadyForCommissionBluetoothSensorsIds()
        .then((response) => {
          const data = response.data?.getReadyForCommissionBluetoothSensorsIds;
          const { success, payload, errors } = data;

          if (success && payload) {
            setMacIdOptions(payload);
          }

          if (errors) {
            const messages = errors.map((error) => getErrorMessage(error));
            // eslint-disable-next-line no-console
            console.error(messages);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(getErrorMessage(error));
        })
        .finally(() => setIsLoadingMacIds(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBluetoothMacIdDialogOpen]);

  return (
    <>
      <StyledTable
        animateRows
        getRowId={({ data }) => data.dataField}
        onGridReady={onGridReady}
        onColumnMoved={handleColumnChange}
        onSortChanged={handleColumnChange}
        onColumnPinned={handleColumnChange}
        onColumnVisible={handleColumnChange}
        onCellDoubleClicked={handleMacIdDoubleClick}
        defaultColDef={{
          suppressSizeToFit: true,
        }}
        onColumnResized={handleColumnChangeDebounced}
        getMainMenuItems={getMainMenuItems}
        columnDefs={savedSensorColumns}
        components={frameworkComponents}
        resizeColumnsToFit
      />
      {isBluetoothMacIdDialogOpen && isFeatureDeviceCommissioningSensorBLEnabled && (
        <BluetoothSensorMacIdDialog
          onClose={handleBluetoothMacIdDialogClose}
          isLoading={isLoadingMacIds}
          macId={(selectedMacIdRowData?.macId ?? '') as string}
          onChangeMacId={handleChangeMacId}
          macIdOptions={macIdOptions}
        />
      )}
    </>
  );
}
