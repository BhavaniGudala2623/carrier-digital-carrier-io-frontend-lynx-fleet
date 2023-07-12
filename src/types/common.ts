import { AlertProps } from '@carrier-io/fds-react/Alert';
import { AutocompleteProps } from '@carrier-io/fds-react/Autocomplete';
import {
  LanguageType,
  TemperatureType,
  DistanceType,
  VolumeType,
  SpeedType,
  AssetGql,
  Device,
  FlespiData,
  Tenant,
  Fleet,
  ProductFamilyType,
  FreezerControlType,
  CompartmentModeType,
} from '@carrier-io/lynx-fleet-types';
import { RegionType } from '@carrier-io/lynx-fleet-common';
import { ChangeEvent, SyntheticEvent } from 'react';
import { SnackbarCloseReason } from '@mui/material';

export type DialogMode = 'CREATE' | 'EDIT';

export type ExportTaskType = 'NONE' | 'EXCEL' | 'CSV';

export type AlertColor = AlertProps['severity'];

export type Maybe<T> = import('@carrier-io/lynx-fleet-types').Maybe<T>;

export type Object<T> = { [key: string]: T };

export type MapStyleType = 'streets' | 'satellite';

export type SelectChangeEvent<T = string> =
  | (Event & { target: { value: T; name: string } })
  | ChangeEvent<HTMLInputElement>;

export type AssetState = 'Alarm' | 'Yes' | 'No';

export interface AssetType {
  key: string;
  color: string;
  assetState: AssetState;
}

export interface ColumnConfig {
  name: string;
  columns?: string[] | undefined;
}

export interface ChartConfigChildrenData {
  label: string;
  i18nKey?: string;
  available: boolean;
  lineType?: string;
  color?: string;
  dataKey?: string;
  colId?: string;
  tooltipValueGetter?: (value: string) => string | undefined;
  statuses?: {
    statusName: string;
    color: string;
    dataKey: string;
    lookerField: Maybe<string>;
  }[];
  lookerField: string;
}

export interface ChartConfigChildren {
  [key: string]: ChartConfigChildrenData;
}
export interface IColumn {
  colId: string;
  isVisible?: boolean;
}
export interface TimelineHeaderDef {
  titleKey: string;
  subTitleKey?: string;
  sortable?: boolean;
  isTemperature?: boolean;
}

export interface IColumnData extends IColumn {
  colConfig: TimelineHeaderDef;
  groupId?: string;
}

export interface IColumnGroup {
  groupId?: string;
  columnDataArr: IColumnData[];
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    i18nKey?: string;
    available: boolean;
    lineType?: string;
    color?: string;
    dataKey?: string;
    rootNode?: boolean;
    colId?: string;
    children: ChartConfigChildren;
    lookerField: string;
  };
}

export interface SnackbarAlertAction {
  callback: (...args: unknown[]) => void;
  label: string;
}

export interface SnackbarAlert {
  id: string;
  message: AlertProps['children'];
  severity?: AlertColor;
  action?: SnackbarAlertAction;
  handleClose?: (event?: Event | SyntheticEvent, reason?: SnackbarCloseReason) => void;
  autoHideDuration?: number | null;
}

export interface AppPreferences {
  language: LanguageType;
  temperature: TemperatureType;
  distance: DistanceType;
  volume: VolumeType;
  speed: SpeedType;
  timezone: string;
}

export interface DeviceSnapshotData {
  asset?: Maybe<Pick<AssetGql, 'id' | 'name'>>;
  device?: Maybe<Device>;
  tenant?: Maybe<Pick<Tenant, 'id' | 'name'>>;
  snapshot?: Partial<FlespiData>;
}

export type FlespiDataField = keyof FlespiData;

export interface OptionItem extends Record<string, unknown> {
  id: string;
  name: string;
}

export type OptionItemDescription = OptionItem & {
  description?: string;
};

export type FleetRow = {
  fleet: Fleet;
  tenant: Pick<Tenant, 'id' | 'name' | 'parentId'>;
};

export type FormAutocompleteProps = Omit<
  AutocompleteProps,
  'options' | 'renderInput' | 'classes' | 'defaultValue' | 'value' | 'onChange'
>;

export interface Dictionary<T> {
  [index: string]: T;
}

export type RegionTypeEx = RegionType | 'UDEFINED';

export interface ProductFamily {
  family: ProductFamilyType;
  controllers: FreezerControlType[];
  heControllers?: FreezerControlType[];
}

export type CompartmentModeTypeLowercase = Lowercase<CompartmentModeType>;
