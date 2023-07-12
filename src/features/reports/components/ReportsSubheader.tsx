import { useTransition, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { ReportsTabData } from '@carrier-io/lynx-fleet-types';
import Tabs from '@carrier-io/fds-react/Tabs';
import Tab from '@carrier-io/fds-react/Tab';

export type ReportsSubheaderProps = {
  tabData: ReportsTabData[];
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
  isAdmin?: boolean;
};

export const ReportsSubheader = ({
  tabData,
  selectedId,
  setSelectedId,
  isAdmin = false,
}: ReportsSubheaderProps) => {
  const [, startTransition] = useTransition();

  const handleTabChange = (_event: ChangeEvent<{}>, value: string) => {
    startTransition(() => {
      setSelectedId(value);
    });
  };

  return (
    <Tabs value={selectedId} onChange={handleTabChange} sx={{ minHeight: 56 }} invertIndicator>
      {tabData.map((tab) =>
        isAdmin && !tab.adminProtected ? (
          <Tab key={tab.id} label={tab.label} value={tab.id} sx={{ minHeight: 56 }} />
        ) : null
      )}
    </Tabs>
  );
};
