import { useParams } from 'react-router-dom';
import Card from '@carrier-io/fds-react/Card';
import CardContent from '@carrier-io/fds-react/CardContent';
import Box from '@carrier-io/fds-react/Box';

import { EmbeddedDashboardFleetReports } from './EmbeddedDashboardFleetReports';

import { ContentRoute } from '@/components/layouts';

export const FleetReportsPage = () => {
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
          <CardContent sx={{ p: 0, '&:last-child': { p: 0 } }}>
            {dashboardId && <EmbeddedDashboardFleetReports dashboardId={dashboardId} />}
          </CardContent>
        </Card>
      </Box>
    </ContentRoute>
  );
};
