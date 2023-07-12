import Box from '@carrier-io/fds-react/Box';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import Chip from '@carrier-io/fds-react/Chip';
import { useTranslation } from 'react-i18next';

import { EnrichedEventData } from '../../types';

import { EventsPreviewTable } from './EventsPreviewTable';

import { UserSettings } from '@/providers/UserSettings';

interface EventsPreviewPopupProps {
  isMoving?: boolean;
  events: EnrichedEventData[];
  userSettings: UserSettings;
  setSelectedEventId: (eventId: string) => void;
  selectedEventId?: string;
}

export const EventsPreviewPopup = ({
  events,
  isMoving,
  userSettings,
  setSelectedEventId,
  selectedEventId,
}: EventsPreviewPopupProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: events.length > 1 ? 160 : 110,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        px: '12px',
      }}
    >
      <EventsPreviewTable
        events={events}
        userSettings={userSettings}
        setSelectedEventId={setSelectedEventId}
        selectedEventId={selectedEventId}
      />
      <Box
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          display: 'flex',
          width: '100%',
          height: 70,
          pl: '35px',
        }}
      >
        {isMoving ? (
          <Chip
            label={t('asset.status.summary.powered-moving')}
            size="small"
            // use style here because backgroundColor doesn't work with sx
            style={{
              height: 24,
              borderRadius: '.25rem',
              fontSize: '14px',
              backgroundColor: fleetThemeOptions.palette.success.main,
              color: fleetThemeOptions.palette.common.white,
            }}
          />
        ) : (
          <Chip
            label={t('asset.status.summary.powered-on-stationary')}
            size="small"
            // use style here because backgroundColor doesn't work with sx
            style={{
              height: 24,
              borderRadius: '.25rem',
              fontSize: '0.875rem',
              backgroundColor: fleetThemeOptions.palette.warning.main,
              color: fleetThemeOptions.palette.common.white,
            }}
          />
        )}
      </Box>
    </Box>
  );
};
