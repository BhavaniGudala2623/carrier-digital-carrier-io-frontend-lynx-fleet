import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Device, Maybe } from '@carrier-io/lynx-fleet-types';

import { BreadcrumbsLink } from '@/components/Breadcrumbs';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { routes } from '@/routes';

export const useDeviceCommissioningBreadcrumbs = ({ selectedDevice }: { selectedDevice?: Maybe<Device> }) => {
  const { setBreadcrumbsSettings } = useApplicationContext();
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumbsSettings({
      customActions: [
        <BreadcrumbsLink
          key={routes.deviceManagement.path}
          item={{ path: routes.deviceManagement.path, title: t(routes.deviceManagement.title) }}
          isLastItem={false}
        />,
        <BreadcrumbsLink
          key="device-item"
          item={{
            path: routes.deviceCommissioning.path.replace(':deviceId', selectedDevice?.id ?? ''),
            title: selectedDevice?.imei ?? '',
          }}
          isLastItem
        />,
      ],
    });

    return () => setBreadcrumbsSettings({ customActions: null });
  }, [selectedDevice, setBreadcrumbsSettings, t]);
};
