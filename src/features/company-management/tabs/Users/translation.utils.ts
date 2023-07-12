import { Maybe, UserEditErrorType } from '@carrier-io/lynx-fleet-types';

export const defaultEditUserErrorTranslationKey = 'user.management.user.update-error';

export const getEditUserErrorTranslationKey = (type: Maybe<UserEditErrorType>) => {
  if (!type) {
    return defaultEditUserErrorTranslationKey;
  }
  const errorTranslationKeyMap = {
    userIsGroupOwner: 'user.management.user.update-error-userIsGroupOwner',
    userIsPrimaryContact: 'user.management.user.update-error-userIsPrimaryContact',
  };

  return errorTranslationKeyMap[type] || defaultEditUserErrorTranslationKey;
};
