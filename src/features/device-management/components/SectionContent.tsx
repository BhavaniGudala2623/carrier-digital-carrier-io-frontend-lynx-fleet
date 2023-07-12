import { Section } from '../types';

import { DeviceSection, AssetSection, NotesSection, SensorSection, DatacoldSection } from './sections';

export const sections: Section[] = [
  {
    id: 'device',
    title: 'device.management.drawer.device',
  },
  {
    id: 'asset',
    title: 'assets.management.drawer.asset',
  },
  {
    id: 'sensors',
    title: 'device.management.sensor.config.sensors-title',
  },
  {
    id: 'datacold',
    title: 'device.management.sensor.config.sensors-datacold-title',
  },
  {
    id: 'notes',
    title: 'device.management.device.commissioning.notes',
  },
];

export const getSectionContent = (section: Section): JSX.Element | null => {
  switch (section.id) {
    case 'device':
      return <DeviceSection />;

    case 'asset':
      return <AssetSection />;

    case 'notes':
      return <NotesSection />;

    case 'sensors':
      return <SensorSection />;

    case 'datacold':
      return <DatacoldSection />;

    default:
      break;
  }

  return null;
};
