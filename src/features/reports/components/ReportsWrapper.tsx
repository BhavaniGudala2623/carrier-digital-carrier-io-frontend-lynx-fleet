import { useContext, useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Paper from '@carrier-io/fds-react/Paper';
import { Alert } from '@carrier-io/fds-react';
import { LookerService } from '@carrier-io/lynx-fleet-data-lib';

import { LookerUserContext } from '../context';
import { TemplateLooker } from '../types';

import { ReportsMine } from './ReportsMine';
import { ReportTemplates } from './ReportTemplates';

interface ReportsWrapperProps {
  selectedId: string;
}

export const ReportsWrapper = memo(({ selectedId }: ReportsWrapperProps) => {
  const {
    state: { user, authSuccessful: isLookerAuthSuccessful, userDataLoading },
  } = useContext(LookerUserContext);
  const { t } = useTranslation();

  const [templates, setTemplates] = useState<TemplateLooker[]>([]);
  const [loading, setLoading] = useState(false);

  async function getReportTemplates() {
    setLoading(true);

    try {
      const templatesLooker = await LookerService.searchFoldersByParentId(
        process.env.REACT_APP_LOOKER_REPORTS_TEMPLATES_ID ?? '',
        user?.accessToken || ''
      );

      setTemplates(templatesLooker);
    } catch (error) {
      throw new Error(`Error searchFoldersByParentId: ${error}`);
    }
  }

  useEffect(() => {
    if (user?.id) {
      getReportTemplates().finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <Paper square sx={{ width: '100%', height: '100%' }}>
      {!isLookerAuthSuccessful && !userDataLoading && (
        <Alert severity="error">{t('looker.errors.retrieve-user-details')}</Alert>
      )}
      {/** commented until proper solution for all scheduled reports
       * will be ready
       */}
      {/* {ctx.authSuccessful && selectedId === 'all' && <ReportsAll ctx={ctx} />} */}
      {isLookerAuthSuccessful && selectedId === 'templates' && (
        <ReportTemplates templates={templates} loading={loading} />
      )}
      {isLookerAuthSuccessful && selectedId === 'mine' && (
        <ReportsMine lookerUserId={user?.id} lookerUserAccessToken={user?.accessToken} />
      )}
    </Paper>
  );
});

ReportsWrapper.displayName = 'ReportsWrapper';
