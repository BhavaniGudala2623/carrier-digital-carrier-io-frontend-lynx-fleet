import { AuthState, UserClaims, CustomUserClaim } from '@okta/okta-auth-js';

import { Maybe } from '@/types';

export enum UserGroups {
  CarrierAdmin = 'Carrier_Celsius_Admin',
  CarrierTechnician = 'Carrier_Celsius_Technician',
  FleetAdmin = 'Carrier_Celsius_Fleet_Admin',
  Everyone = 'Everyone',
  CommandAdmin = 'Carrier_Celsius_Command_Admin',
  APIPortalAdmin = 'Carrier_Celsius_API_Portal_Admin',
}

type CustomClaims = Record<string, CustomUserClaim | CustomUserClaim[]> & { groups?: UserGroups[] };

const getGroups = (authState: Maybe<AuthState>): UserGroups[] => {
  const claims: UserClaims<CustomClaims> | undefined = authState?.idToken?.claims;

  if (claims?.groups) {
    return claims.groups;
  }

  return [];
};

export const inAnyGroup = (authState: Maybe<AuthState>, groups: UserGroups[]): boolean => {
  const authGroups = getGroups(authState);

  return groups.some((group) => authGroups.includes(group));
};

export const inAllGroups = (authState: Maybe<AuthState>, groups: UserGroups[]): boolean => {
  const authGroups = getGroups(authState);

  return groups.every((group) => authGroups.includes(group));
};

export const isCarrierAdmin = (authState: Maybe<AuthState>): boolean =>
  inAllGroups(authState, [UserGroups.CarrierAdmin]);

export const isTechnician = (authState: Maybe<AuthState>): boolean =>
  inAllGroups(authState, [UserGroups.CarrierTechnician]);

export const isFleetAdmin = (authState: Maybe<AuthState>): boolean =>
  inAllGroups(authState, [UserGroups.FleetAdmin]);

export const isAPIPortalAdmin = (authState: Maybe<AuthState>): boolean =>
  inAllGroups(authState, [UserGroups.APIPortalAdmin]);
