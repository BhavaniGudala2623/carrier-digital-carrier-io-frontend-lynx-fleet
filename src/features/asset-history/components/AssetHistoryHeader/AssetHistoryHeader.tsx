import { HistoryFrequency, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';

import { AssetHistoryTabs } from '../../types';

import { SubHeaderLeftContent } from './SubHeaderLeftContent';
import { SubHeaderRightContent } from './SubHeaderRightContent';

import { TableBoxHeader } from '@/components/TableBox';

interface IAssetHistoryHeaderProps {
  selectedTab: AssetHistoryTabs;
  selectedView: Maybe<string | number>;
  quickDate: Maybe<QuickDate>;
  frequency: Maybe<HistoryFrequency>;
  email?: string;
  onTabChange: (tab: AssetHistoryTabs) => void;
  onSelectedViewChange: (view: Maybe<string | number>) => void;
  onReportDialogOpen: (open: boolean) => void;
}

export const AssetHistoryHeader = (props: IAssetHistoryHeaderProps) => {
  const {
    selectedView,
    quickDate,
    frequency,
    onSelectedViewChange,
    email,
    onReportDialogOpen,
    selectedTab,
    onTabChange,
  } = props;

  return (
    <TableBoxHeader spaceBetween>
      <SubHeaderLeftContent selectedTab={selectedTab} onTabChange={onTabChange} />
      <SubHeaderRightContent
        selectedTab={selectedTab}
        selectedView={selectedView}
        quickDate={quickDate}
        frequency={frequency}
        email={email}
        onReportDialogOpen={onReportDialogOpen}
        onSelectedViewChange={onSelectedViewChange}
      />
    </TableBoxHeader>
  );
};
