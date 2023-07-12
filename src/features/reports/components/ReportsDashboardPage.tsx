/**
 * Gateway component to reports module, wrapped with the Looker user info context
 */
import { useParams } from 'react-router-dom';
import Card from '@carrier-io/fds-react/Card';
import CardContent from '@carrier-io/fds-react/CardContent';
import Box from '@carrier-io/fds-react/Box';

import { EmbeddedDashboard } from './EmbeddedDashboard';

import { ContentRoute } from '@/components/layouts';

export function ReportsDashboardPage(): JSX.Element {
  const { dashboardId } = useParams<{ dashboardId?: string }>();

  return (
    <ContentRoute>
      <Box
        sx={{
          height: '100%',
          '& > div': { width: '100%', height: '100%' },
        }}
      >
        <Card
          sx={{
            width: '100%',
            height: '100%',
            '& > div': { height: '100%' },
          }}
        >
          <CardContent>{dashboardId && <EmbeddedDashboard dashboardId={dashboardId} />}</CardContent>
        </Card>
      </Box>
    </ContentRoute>
  );
}
