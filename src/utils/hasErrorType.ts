import { ErrorCodeType } from '@carrier-io/lynx-fleet-types';

import { getErrorCodeTypeAsStr } from './getErrorCodeTypeAsStr';

export const hasErrorType = (error: string | undefined, errorCode: ErrorCodeType): boolean =>
  error?.includes(getErrorCodeTypeAsStr(errorCode)) ?? false;
