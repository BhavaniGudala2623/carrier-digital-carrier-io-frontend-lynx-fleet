import { AssetsTabProvider, CompaniesTabProvider, FleetsTabProvider, UsersTabProvider } from '../tabs';

export const DataGridProvider = ({ children }: { children: JSX.Element }) => (
  <CompaniesTabProvider>
    <AssetsTabProvider>
      <FleetsTabProvider>
        <UsersTabProvider>{children}</UsersTabProvider>
      </FleetsTabProvider>
    </AssetsTabProvider>
  </CompaniesTabProvider>
);
