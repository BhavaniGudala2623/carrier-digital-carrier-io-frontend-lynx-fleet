import { LynxAction, LynxActionRequest, Maybe } from '@carrier-io/lynx-fleet-types';

export const companyActionPayload = (
  action: LynxAction,
  subjectId: string,
  objectId?: Maybe<string>,
  objectType?: Maybe<string>
): LynxActionRequest => ({
  action,
  subjectId,
  subjectType: 'COMPANY',
  objectId,
  objectType,
});
