import { ErrorCodeType } from '@carrier-io/lynx-fleet-types';

import { getLiteralTypeAsStr } from './getLiteralTypeAsStr';

export const getErrorCodeTypeAsStr = (code: ErrorCodeType): string =>
  getLiteralTypeAsStr<ErrorCodeType>(code);
