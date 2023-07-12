import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';

import { TemplateLooker } from '../types';
import { getTranslatedTextValue } from '../utils';

import { Loader, TableCellLink as Link } from '@/components';

interface Props {
  templates: TemplateLooker[];
  loading: boolean;
}

export const ReportTemplates = ({ templates, loading }: Props) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" p={3} height="100%">
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Loader />
        </Box>
      ) : (
        <>
          <Typography variant="body2" mb={4}>
            {t('assets.reports.choose-a-template')}
          </Typography>
          {templates.map((template) => {
            // Remove this 'if' when Dashboards and Single Asset Reports will be ready
            if (template?.name === 'Dashboards' || template?.name === 'Single Asset Reports') {
              return null;
            }

            return (
              <Box display="flex" flexDirection="column" key={template?.name} mb={4} width="max-content">
                <Typography variant="h6" mb={2}>
                  {getTranslatedTextValue(template?.name ?? '', t, 'template')}
                </Typography>
                {template?.dashboards?.map((dashboard) => (
                  <Box display="flex" flexDirection="column" key={dashboard?.title} mb={2}>
                    <Link
                      to={`/reports/fleet-reports/${dashboard?.id}`}
                      sx={{ width: 'fit-content' }}
                      underline="always"
                    >
                      <Typography variant="body1" color="primary">
                        {getTranslatedTextValue(dashboard?.title ?? '', t, 'dashboard')}
                      </Typography>
                    </Link>
                    <Typography variant="caption">
                      {getTranslatedTextValue(dashboard?.title ?? '', t, 'description')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          })}
        </>
      )}
    </Box>
  );
};
