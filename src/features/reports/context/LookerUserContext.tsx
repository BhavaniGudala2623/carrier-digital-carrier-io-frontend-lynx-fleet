/**
 * A context provider for getting current Carrier logged-in user info and correlating
 * with Looker user information
 */
import { useCallback, useEffect, useMemo, useState, Dispatch, SetStateAction, createContext } from 'react';
import { LookerService, UserService } from '@carrier-io/lynx-fleet-data-lib';
import {
  GroupsByIdQueryResponse,
  LookerUserData,
  LookerUserProviderState,
  UserAttributeQueryResponse,
} from '@carrier-io/lynx-fleet-types';

import { GenericChildrenProps } from '../types';
import { transformTokenRequest, USER_ATTRIBUTE_SYNCING } from '../utils';

import { useInterval } from '@/hooks';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { useUserSettings } from '@/providers/UserSettings';

const LookerUserContext = createContext<{
  state: LookerUserProviderState;
  dispatch?: Dispatch<SetStateAction<LookerUserProviderState>>;
}>({
  state: {
    authSuccessful: false,
    userDataLoading: true,
    reauthenticate: false,
    user: {
      id: '',
      accessToken: '',
    },
  },
});

const LookerUserProvider = ({ children }: GenericChildrenProps) => {
  const { appLanguage } = useApplicationContext();
  const {
    userSettings: { email: authUserEmail, timezone },
  } = useUserSettings();
  const [intervalDelay, setIntervalDelay] = useState<number | null>(null);
  const [state, dispatch] = useState<LookerUserProviderState>({
    authSuccessful: false,
    userDataLoading: true,
    reauthenticate: false,
    user: {
      id: '',
      accessToken: '',
    },
  });

  /**
   * Check to see if it's time to refresh the Looker access token
   * expiresIn is a number representing current time + 1 hour since the context was created or refreshed
   */
  function shouldRefreshToken(accessToken: string, expiresIn: number): boolean {
    if (!accessToken) {
      return false;
    }

    const now = new Date().getTime();

    // are we within 10 minutes of expiration?
    return expiresIn - now <= 60000 * 10;
  }

  /**
   * Carrier GraphQL getLookerAccessToken()
   * @returns
   */
  const authenticateLookerUser = useCallback(
    async (email: string) =>
      new Promise<LookerUserData>(
        // eslint-disable-next-line no-async-promise-executor
        async (
          resolve,
          reject // eslint-disable-next-line consistent-return
        ) => {
          try {
            // If email is bad, throw
            if (!email) {
              throw new Error('Invalid credentials (email)');
            }

            // Looker access token
            // retry will happen every 30 secs when the API gateway times out
            let retryCount = 0;
            const retryMax = 30;

            const lookerTokenRetryLoop = async () => {
              try {
                const res = await UserService.getLookerAccessToken({
                  email: email.toLowerCase(),
                  timezone,
                  locale: appLanguage,
                });

                const lookerAccessToken = res?.data?.getLookerAccessToken?.lookerAccessToken;

                const userDataObject = transformTokenRequest(
                  lookerAccessToken,
                  appLanguage,
                  timezone,
                  new Date(new Date().setHours(new Date().getHours() + 1)).getTime()
                );
                resolve(userDataObject);
              } catch {
                if (retryCount < retryMax) {
                  retryCount += 1;
                  await lookerTokenRetryLoop();
                } else {
                  throw new Error('Unable to fetch Looker token.');
                }
              }
            };

            await lookerTokenRetryLoop();
          } catch (_) {
            reject(new Error('Unable to retrieve Looker token information.'));
          }
        }
      )
        // //////////////////////////////////////////////////////////
        // Step 2: Check access token for "syncing" or
        // Fetch group names by the groupIds[] from above
        // //////////////////////////////////////////////////////////
        .then(
          async (
            userDataObject: LookerUserData
          ): Promise<{ userDataObject: LookerUserData; groupNames: string[] }> => {
            /**
             * If the access token is "syncing", then fire up the useInterval hook
             * by setting the intervalDelay value and then throw an error to terminate
             * the promise chain and bypass downstream 401s.
             */
            if (userDataObject.accessToken === USER_ATTRIBUTE_SYNCING) {
              if (!intervalDelay) {
                setIntervalDelay(5000);
              }
              throw new Error('User is synchronizing with Looker.');
            }

            // continuing on with group fetching
            try {
              const groups: GroupsByIdQueryResponse[] = await LookerService.fetchGroupsById(
                userDataObject?.groupIds || [],
                userDataObject?.accessToken || ''
              );

              return {
                userDataObject,
                groupNames: (groups || []).map((m: GroupsByIdQueryResponse) => m.name),
              };
            } catch (_) {
              throw new Error('Unable to retrieve user group information.');
            }
          }
        )
        // //////////////////////////////////////////////////////////
        // Step 3: Fetch user attributes by user ID
        // //////////////////////////////////////////////////////////
        .then(async (data) => {
          try {
            if (data) {
              const { userDataObject, groupNames } = data;

              const attributeData: UserAttributeQueryResponse[] =
                await LookerService.fetchUserAttributesByUserId(
                  userDataObject.id,
                  userDataObject.accessToken
                );

              // successful auth...check null / "syncing"
              let authSuccessful = false;
              if (userDataObject.accessToken && userDataObject.accessToken !== USER_ATTRIBUTE_SYNCING) {
                authSuccessful = true;
              }

              // dispatch to set the "final" context object
              dispatch((st) => ({
                ...st,
                authSuccessful,
                user: {
                  ...userDataObject,
                  groupNames,
                  userAttributes: attributeData,
                },
              }));

              // turn off the interval
              if (authSuccessful) {
                setIntervalDelay(null);
              }
            }
          } catch (_) {
            throw new Error('Unable to retrieve user attribute information.');
          }

          dispatch((st) => ({ ...st, userDataLoading: false, reauthenticate: false }));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(`Error with authenticateLookerUser: ${error}`);
          dispatch((st) => ({ ...st, userDataLoading: false }));
        }),
    [appLanguage, intervalDelay, timezone]
  );

  /**
   * This use effect will fire if state.reauthenticate is true
   * state.reauthenticate is set back to false in the authentication Promise chain
   */
  useEffect(() => {
    if (authUserEmail && state.reauthenticate && appLanguage) {
      authenticateLookerUser(authUserEmail);
    }
  }, [appLanguage, authUserEmail, authenticateLookerUser, state.reauthenticate, timezone]);

  useEffect(() => {
    dispatch((st) => ({
      ...st,
      user: {
        ...st.user,
        timezone,
      },
    }));
  }, [timezone]);

  /**
   * This interval is run if the access_token is the string 'syncing' as returned
   * from the middleware.  This interval get cancelled when user is successfully authenticated.
   */
  useInterval(async () => {
    if (authUserEmail && intervalDelay !== null) {
      authenticateLookerUser(authUserEmail);
    }
  }, intervalDelay);

  /**
   * This useInterval is for refreshing the Looker token if it is near expiration
   */
  useInterval(async () => {
    if (shouldRefreshToken(state?.user?.accessToken || '', Number(state?.user?.expiresIn))) {
      const res = await LookerService.refreshLookerToken({ userToken: state?.user?.accessToken || '' });
      if (res?.data?.getRefreshToken?.token) {
        dispatch((st) => ({
          ...st,
          user: {
            ...st.user,
            accessToken: res?.data?.getRefreshToken?.token,
            expiresIn: new Date(new Date().setHours(new Date().getHours() + 1)).getTime(),
          },
        }));
      }
    }
  }, 60000 * 3); // run every 3 minutes

  useEffect(() => {
    dispatch((st) => ({
      ...st,
      authSuccessful: false,
      userDataLoading: true,
      reauthenticate: true,
    }));
  }, [appLanguage, timezone]);

  /**
   * For reusability sake, no more business logic should be in this Context.
   * Please delegate context-specific business logic to whatever [children] are wrapped
   */
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <LookerUserContext.Provider value={contextValue}>{children}</LookerUserContext.Provider>;
};

export { LookerUserContext, LookerUserProvider };
