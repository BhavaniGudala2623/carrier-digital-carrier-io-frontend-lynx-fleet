import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { CsvExportModule } from '@ag-grid-community/csv-export';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { MenuModule } from '@ag-grid-enterprise/menu';

let ALREADY_REGISTERED = false;

export function registerModules() {
  if (!ALREADY_REGISTERED) {
    ModuleRegistry.registerModules([
      ClientSideRowModelModule,
      ColumnsToolPanelModule,
      InfiniteRowModelModule,
      CsvExportModule,
      ExcelExportModule,
      MenuModule,
    ]);

    ALREADY_REGISTERED = true;
  }
}
