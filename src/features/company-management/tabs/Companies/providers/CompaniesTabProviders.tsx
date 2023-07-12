import { createContext, useContext, useMemo, useState } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { CompaniesTableView } from '../types';

type CompaniesTabContextValue = {
  tableView: CompaniesTableView;
  setTableView: (newView: CompaniesTableView) => void;
};

const CompaniesTabContext = createContext<Maybe<CompaniesTabContextValue>>(null);

export const useCompaniesTabState = () => {
  const context = useContext(CompaniesTabContext);

  if (!context) {
    throw Error('No provider found for CompaniesTabContext');
  }

  return context;
};

export const CompaniesTabProvider = ({ children }: { children: JSX.Element }) => {
  const [tableView, setTableView] = useState<CompaniesTableView>(CompaniesTableView.Companies);

  const contextValue = useMemo(
    () => ({
      tableView,
      setTableView,
    }),
    [tableView, setTableView]
  );

  return <CompaniesTabContext.Provider value={contextValue}>{children}</CompaniesTabContext.Provider>;
};
