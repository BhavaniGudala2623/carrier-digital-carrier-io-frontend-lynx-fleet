/**
 * is...() and has...() functions
 */
import {
  GROUP_COMPANY_ADMIN,
  GROUP_FLEET_ADMIN,
  GROUP_REPORT_EDITOR,
  GROUP_SUB_COMPANY_ADMIN,
  GROUP_SYSTEM_ADMIN,
} from './constants';

function hasCompanyContentAccess(companyName: string, groupNames: string[]): boolean {
  return groupNames.includes(`${companyName} Admin`);
}

function hasCompanyFleetContentAccess(companyName: string, fleetName: string, groupNames: string[]): boolean {
  return groupNames.includes(`${companyName}::${fleetName} Admin`);
}

function hasCompanySubcompanyContentAccess(
  companyName: string,
  subcompanyName: string,
  groupNames: string[]
): boolean {
  return groupNames.includes(`${companyName}::${subcompanyName} Admin`);
}

function hasSubcompanyFleetContentAccess(
  companyName: string,
  subcompanyName: string,
  fleetName: string,
  groupsNames: string[]
): boolean {
  return groupsNames.includes(`${companyName}::${subcompanyName}::${fleetName} Admin`);
}

function isCompanyAdmin(groupNames: string[]): boolean {
  return groupNames.includes(GROUP_COMPANY_ADMIN);
}

function isFleetAdmin(groupNames: string[]): boolean {
  return groupNames.includes(GROUP_FLEET_ADMIN);
}

function isReportEditor(groupNames: string[]): boolean {
  return groupNames.includes(GROUP_REPORT_EDITOR);
}

function isSubCompanyAdmin(groupNames: string[]): boolean {
  return groupNames.includes(GROUP_SUB_COMPANY_ADMIN);
}

function isSystemAdmin(groupNames: string[]): boolean {
  return groupNames.includes(GROUP_SYSTEM_ADMIN);
}

export {
  hasCompanyContentAccess,
  hasCompanyFleetContentAccess,
  hasCompanySubcompanyContentAccess,
  hasSubcompanyFleetContentAccess,
  isCompanyAdmin,
  isFleetAdmin,
  isReportEditor,
  isSystemAdmin,
  isSubCompanyAdmin,
};
