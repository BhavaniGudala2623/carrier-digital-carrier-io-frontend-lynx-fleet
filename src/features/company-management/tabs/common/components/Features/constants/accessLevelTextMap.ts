import { AccessLevelType } from '@carrier-io/lynx-fleet-types';

export const accessLevelTextMap: Record<AccessLevelType, string> = {
  full_access: 'company.management.users.create-group.feature-access-level.full',
  create_edit: 'company.management.users.create-group.feature-access-level.create-edit',
  view_only: 'company.management.users.create-group.feature-access-level.view-only',
};
