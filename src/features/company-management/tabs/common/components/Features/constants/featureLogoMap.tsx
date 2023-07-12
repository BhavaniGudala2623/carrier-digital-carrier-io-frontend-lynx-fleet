import { FeatureType } from '@carrier-io/lynx-fleet-types';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import RouterOutlinedIcon from '@mui/icons-material/RouterOutlined';

import {
  AdvancedTrackingIcon,
  ApiPortalIcon,
  AssetTrackingIcon,
  CommandHistoryIcon,
  CompanyManagementIcon,
  NotificationsIcon,
  ReportsIcon,
} from '@/components';

const iconsStyle = { width: '24px', height: '24px' };

export const featureLogoMap: Omit<Record<FeatureType, JSX.Element>, 'fleet'> = {
  geofence: <LocationOnOutlinedIcon style={iconsStyle} />,
  company: <CompanyManagementIcon style={iconsStyle} />,
  asset: <AssetTrackingIcon style={iconsStyle} />,
  user: <SupervisedUserCircleOutlinedIcon style={iconsStyle} />,
  device: <RouterOutlinedIcon style={iconsStyle} />,
  '2WayCmd': <CommandHistoryIcon style={iconsStyle} />,
  notification: <NotificationsIcon style={iconsStyle} />,
  scheduledReports: <ReportsIcon style={iconsStyle} />,
  apiPortal: <ApiPortalIcon style={iconsStyle} />,
  advancedTracking: <AdvancedTrackingIcon style={iconsStyle} />,
};
