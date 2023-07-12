import { LynxActionRequest } from '@carrier-io/lynx-fleet-types';
import { HasPermission as RbacHasPermission } from '@carrier-io/rbac-provider-react';

export type HasPermissionProps = LynxActionRequest & {
  children: JSX.Element;
};

/**
 * Conditional rendering component.
 * Uses `RbacContext` and provided props to determine whether to show it's children
 */
export const HasPermission = ({
  children,
  action,
  objectId,
  objectType,
  subjectId,
  subjectType,
}: HasPermissionProps) => (
  <RbacHasPermission
    action={action}
    subjectId={subjectId}
    subjectType={subjectType}
    objectId={objectId}
    objectType={objectType}
  >
    {children}
  </RbacHasPermission>
);
