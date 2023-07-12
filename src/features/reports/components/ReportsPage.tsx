import { Alert } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportsTabData } from '@carrier-io/lynx-fleet-types';

import { LookerUserContext } from '../context';
import { isCompanyAdmin, isFleetAdmin, isReportEditor, isSubCompanyAdmin, isSystemAdmin } from '../utils';

import { ReportsSubheader } from './ReportsSubheader';
import { ReportsWrapper } from './ReportsWrapper';

import { Loader } from '@/components';
import { ContentRoute } from '@/components/layouts';
import { TableBox, TableBoxHeader } from '@/components/TableBox';

export const ReportsPage = () => {
  /**
   * we need the context here to possibly hide All Scheduled Reports
   * if the user is not admin-level in some capacity
   */
  const { state: lookerState } = useContext(LookerUserContext);
  const { t } = useTranslation();

  const tabData: ReportsTabData[] = [
    ...[
      {
        id: 'templates',
        label: t('assets.reports.report-templates'),
        adminProtected: false,
      },
    ],
    {
      id: 'mine',
      label: t('assets.reports.my-scheduled-reports'),
      adminProtected: false,
    },
    /** commented until proper solution for all scheduled reports
     * will be ready
     */
    // {
    //   id: 'all',
    //   label: t('assets.reports.all-scheduled-reports'),
    //   adminProtected: true,
    // },
  ];

  const [selectedId, setSelectedId] = useState<ReportsTabData['id']>('templates');

  const userGroupNames = lookerState?.user?.groupNames || [];

  if (!lookerState.userDataLoading && !lookerState.authSuccessful) {
    return <Alert severity="error">{t('looker.errors.retrieve-user-details')}</Alert>;
  }

  return (
    <ContentRoute>
      <TableBox>
        <TableBoxHeader
          sxPaper={{ mb: 0, py: 0, minHeight: 56 }}
          stylePaper={{ borderRadius: '8px 8px 0 0' }}
          spaceBetween
          dividers
        >
          <ReportsSubheader
            tabData={tabData}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            isAdmin={
              isCompanyAdmin(userGroupNames) ||
              isFleetAdmin(userGroupNames) ||
              isSubCompanyAdmin(userGroupNames) ||
              isSystemAdmin(userGroupNames) ||
              isReportEditor(userGroupNames)
            }
          />
        </TableBoxHeader>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            flex: 1,
            borderRadius: '0 0 8px 8px',
          }}
        >
          <ReportsWrapper selectedId={selectedId} />
        </Box>
        <span>{lookerState?.userDataLoading && <Loader overlay />}</span>
      </TableBox>
    </ContentRoute>
  );
};
