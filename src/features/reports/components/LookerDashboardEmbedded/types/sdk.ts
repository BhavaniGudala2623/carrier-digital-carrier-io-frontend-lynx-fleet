export type SDKRecord = Record<string, any>;

export type FieldMetadata = {
  label: string;
  is_numeric: boolean;
  name: string;
  sortable: boolean;
  sorted?: { desc: boolean; sort_index: number };
  view: string;
  view_label: string;
  label_short: string;
  value_format: string | null;
};

export type DimensionMetadata = FieldMetadata & {
  is_filter: boolean;
  is_fiscal: boolean;
  is_timeframe: boolean;
  type:
    | 'date_month'
    | 'date_date'
    | 'date_year'
    | 'date_week'
    | 'date_time'
    | 'date_quarter'
    | 'date_month_num'
    | 'date_hour_of_day'
    | 'count_distinct'
    | 'string'
    | 'zipcode'
    | 'number';
};

export type Fields = {
  dimensions?: DimensionMetadata[];
  measures?: FieldMetadata[];
};
