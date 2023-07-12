/**
 * Utility functions for Looker integration
 */
import { format } from 'date-fns';
import cronParser from 'cron-parser';
import { uniq } from 'lodash-es';
import { TFunction } from 'i18next';
import { ICellRendererParams } from '@ag-grid-community/core';
import {
  Maybe,
  LookerUserAttribute,
  LookerUserData,
  LookerUserProviderState,
  ScheduledPlanDestination,
  ScheduledPlanQueryResponse,
  ScheduledPlanByUserResponse,
} from '@carrier-io/lynx-fleet-types';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { LookerReportType, ScheduledPlan, ScheduledPlanDest } from '../types';

import {
  DELIM,
  USER_ATTRIBUTE_COMPANY,
  LOOKER_NULL_STRING_FILTER,
  USER_ATTRIBUTE_SUB_COMPANY,
  USER_ATTRIBUTE_FLEETS,
} from './constants';
import { isSystemAdmin, isCompanyAdmin, isFleetAdmin, isReportEditor, isSubCompanyAdmin } from './is_has';
import { crontabWildcardOnlyRe, crontabNumOnlyRe, crontabNumAndCommaOnlyRe, crontabComboRe } from './regex';

import { Columns } from '@/types';
import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';
import { formatDate } from '@/utils';

function userNoAccess(userDataObject: LookerUserData, groupNames: string[]): boolean {
  return (
    userDataObject.isDisabled ||
    (!isSystemAdmin(groupNames) &&
      !isCompanyAdmin(groupNames) &&
      !isFleetAdmin(groupNames) &&
      !isReportEditor(groupNames))
  );
}

/**
 * Looker folder names have a max length of 100 characters.
 * Strip out non-alnum and truncate
 * @param folderName
 * @returns
 */
function normalizeFolderPortion(folderPortion: string, truncation: number = 27): string {
  const re = /[^a-zA-Z0-9]/g;

  return folderPortion.trim().replace(re, '').substring(0, truncation);
}

/**
 * This returns a combined regex pattern for filtering on dashboards
 * @param ctx
 * @returns
 */
function getFolderMatchRegex(ctx: Partial<LookerUserProviderState>): RegExp | null {
  const ret: string[] = [];
  const groupNames = ctx?.user?.groupNames || [];
  const userAttributes = ctx?.user?.userAttributes || [];

  // ////////////////////////////////////////////////
  // system admin gets anything starting with "Company"
  // or anything containing "User"
  // ////////////////////////////////////////////////
  if (isSystemAdmin(groupNames)) {
    ret.push('C:', 'U:');
  } else {
    const adminRe = /Admin/;
    const adminReplaceRe = /\s+Admin$/g;

    // this filters our company_admin, All Users, report_editor, etc.
    const adminOnlyGroups = groupNames.filter((f) => adminRe.test(f));

    // everyone else gets their own user folder to start
    // note: the "$" at the end of the regex
    if (ctx?.user?.id) {
      ret.push(`U:${ctx?.user?.id}$`);
    }

    // company admin
    if (isCompanyAdmin(groupNames)) {
      adminOnlyGroups.forEach((g: string) => {
        const parts = g.split(DELIM);
        if (parts.length > 0) {
          const [first] = parts;
          ret.push(`C:${normalizeFolderPortion(first.replace(adminReplaceRe, ''))}`);
        }
      });
    }

    // sub company admin
    if (isSubCompanyAdmin(groupNames)) {
      adminOnlyGroups.forEach((g: string) => {
        const parts = g.split(DELIM);
        if (parts.length > 1) {
          const [first, second] = parts;
          ret.push(
            `C:${normalizeFolderPortion(first.replace(adminReplaceRe, ''))}${DELIM}C:${normalizeFolderPortion(
              second.replace(adminReplaceRe, '')
            )}`
          );
        }
      });
    }

    // fleet admin
    // could be fleets directly under a company or maybe under a sub company
    if (isFleetAdmin(groupNames)) {
      adminOnlyGroups.forEach((g: string) => {
        const parts = g.split(DELIM);
        if (parts.length > 1) {
          const [first, second, third] = parts;

          // no third match means Company -> Fleet
          if (!third) {
            ret.push(
              `C:${normalizeFolderPortion(
                first.replace(adminReplaceRe, '')
              )}${DELIM}F:${normalizeFolderPortion(second.replace(adminReplaceRe, ''))}`
            );
          } else {
            ret.push(
              `C:${normalizeFolderPortion(
                first.replace(adminReplaceRe, '')
              )}${DELIM}C:${normalizeFolderPortion(
                second.replace(adminReplaceRe, '')
              )}${DELIM}F:${normalizeFolderPortion(third.replace(adminReplaceRe, ''))}`
            );
          }
        }
      });
    }

    // this is a special case...could be Company, Sub or Fleet level
    // and we need to calculate and check for LOOKER_NULL_STRING_FILTER
    if (isReportEditor(groupNames)) {
      let companyNullFilter = false;
      let subCompanyNullFilter = false;
      let fleetNullFilter = false;

      // figure out the attribute value for "company"
      const companyAttributeData: string[] = userAttributes
        .filter((f: LookerUserAttribute) => f.name === USER_ATTRIBUTE_COMPANY)
        .map((m: LookerUserAttribute) => m.value.trim());
      if (companyAttributeData.length > 0) {
        const [company] = companyAttributeData;
        if (company === LOOKER_NULL_STRING_FILTER) {
          companyNullFilter = true;
        }
      }

      // figure out the attribute value for "sub_companies"
      const subCompanyAttributeData: string[] = userAttributes
        .filter((f: LookerUserAttribute) => f.name === USER_ATTRIBUTE_SUB_COMPANY)
        .map((m: LookerUserAttribute) => m.value.trim());
      if (subCompanyAttributeData.length > 0) {
        const [sc] = subCompanyAttributeData;
        if (sc === LOOKER_NULL_STRING_FILTER) {
          subCompanyNullFilter = true;
        }
      }

      // figure out the attribute value for "fleets"
      const fleetAttributeData: string[] = userAttributes
        .filter((f: LookerUserAttribute) => f.name === USER_ATTRIBUTE_FLEETS)
        .map((m: LookerUserAttribute) => m.value.trim());
      if (fleetAttributeData.length > 0) {
        const [fl] = fleetAttributeData;
        if (fl === LOOKER_NULL_STRING_FILTER) {
          fleetNullFilter = true;
        }
      }

      // this should probably never happen for a report editor
      // it is the same as System Admin
      if (companyNullFilter && subCompanyNullFilter && fleetNullFilter) {
        ret.push('C:');
      } else if (!companyNullFilter && subCompanyNullFilter && fleetNullFilter) {
        adminOnlyGroups.forEach((g: string) => {
          const parts = g.split(DELIM);
          if (parts.length > 0) {
            const [first] = parts;
            ret.push(`C:${normalizeFolderPortion(first.replace(adminReplaceRe, ''))}`);
          }
        });
      } else if (!companyNullFilter && !subCompanyNullFilter && fleetNullFilter) {
        adminOnlyGroups.forEach((g: string) => {
          const parts = g.split(DELIM);
          if (parts.length > 1) {
            const [first, second] = parts;
            ret.push(
              `C:${normalizeFolderPortion(
                first.replace(adminReplaceRe, '')
              )}${DELIM}C:${normalizeFolderPortion(second.replace(adminReplaceRe, ''))}`
            );
          }
        });
      } else {
        adminOnlyGroups.forEach((g: string) => {
          const parts = g.split(DELIM);
          if (parts.length > 1) {
            const [first, second, third] = parts;

            // no third match means Company -> Fleet
            if (!third) {
              ret.push(
                `C:${normalizeFolderPortion(
                  first.replace(adminReplaceRe, '')
                )}${DELIM}F:${normalizeFolderPortion(second.replace(adminReplaceRe, ''))}`
              );
            } else {
              ret.push(
                `C:${normalizeFolderPortion(
                  first.replace(adminReplaceRe, '')
                )}${DELIM}C:${normalizeFolderPortion(
                  second.replace(adminReplaceRe, '')
                )}${DELIM}F:${normalizeFolderPortion(third.replace(adminReplaceRe, ''))}`
              );
            }
          }
        });
      }
    }
  }

  if (ret.length > 0) {
    return new RegExp(uniq(ret).join('|'));
  }

  return null;
}

/**
 * Given the data in the authState / Looker user context, determine a list of restricted
 * wildcard search strings to use for folder searching.
 * @param ctx
 * @returns
 */
function getFolderWildcardSearchStrings(ctx: Partial<LookerUserProviderState>): string[] | null {
  const ret: string[] = [];
  const groupNames = ctx?.user?.groupNames || [];
  const userAttributes = ctx?.user?.userAttributes || [];

  // ////////////////////////////////////////////////
  // system admin gets anything starting with "Company"
  // or anything containing "User"
  // ////////////////////////////////////////////////
  if (isSystemAdmin(groupNames)) {
    ret.push('%C:%', 'U:%');
  } else {
    const adminRe = /Admin/;
    const adminReplaceRe = /\s+Admin$/g;

    // this filters our company_admin, All Users, report_editor, etc.
    const adminOnlyGroups = groupNames.filter((f) => adminRe.test(f));

    // everyone else gets their own user folder to start
    if (ctx?.user?.id) {
      ret.push(`%U:${ctx?.user?.id}`);
    }

    // company admin
    if (isCompanyAdmin(groupNames)) {
      adminOnlyGroups.forEach((g: string) => {
        const parts = g.split(DELIM);
        if (parts.length > 0) {
          const [first] = parts;
          ret.push(`C:${normalizeFolderPortion(first.replace(adminReplaceRe, ''))}%`);
        }
      });
    }

    // sub company admin
    if (isSubCompanyAdmin(groupNames)) {
      adminOnlyGroups.forEach((g: string) => {
        const parts = g.split(DELIM);
        if (parts.length > 1) {
          const [first, second] = parts;
          ret.push(
            `C:${normalizeFolderPortion(first.replace(adminReplaceRe, ''))}${DELIM}C:${normalizeFolderPortion(
              second.replace(adminReplaceRe, '')
            )}%`
          );
        }
      });
    }

    // fleet admin
    // could be fleets directly under a company or maybe under a sub company
    if (isFleetAdmin(groupNames)) {
      adminOnlyGroups.forEach((g: string) => {
        const parts = g.split(DELIM);
        if (parts.length > 1) {
          const [first, second, third] = parts;

          // no third match means Company -> Fleet
          if (!third) {
            // normalizeFolderPortion(first.replace(adminReplaceRe, ''))
            ret.push(
              `C:${normalizeFolderPortion(
                first.replace(adminReplaceRe, '')
              )}${DELIM}F:${normalizeFolderPortion(second.replace(adminReplaceRe, ''))}%`
            );
          } else {
            ret.push(
              `C:${normalizeFolderPortion(
                first.replace(adminReplaceRe, '')
              )}${DELIM}C:${normalizeFolderPortion(
                second.replace(adminReplaceRe, '')
              )}${DELIM}F:${normalizeFolderPortion(third.replace(adminReplaceRe, ''))}%`
            );
          }
        }
      });
    }

    // this is a special case...could be Company, Sub or Fleet level
    // and we need to calculate and check for LOOKER_NULL_STRING_FILTER
    if (isReportEditor(groupNames)) {
      let companyNullFilter = false;
      let subCompanyNullFilter = false;
      let fleetNullFilter = false;

      // figure out the attribute value for "company"
      const companyAttributeData: string[] = userAttributes
        .filter((f: LookerUserAttribute) => f.name === USER_ATTRIBUTE_COMPANY)
        .map((m: LookerUserAttribute) => m.value.trim());
      if (companyAttributeData.length > 0) {
        const [company] = companyAttributeData;
        if (company === LOOKER_NULL_STRING_FILTER) {
          companyNullFilter = true;
        }
      }

      // figure out the attribute value for "sub_companies"
      const subCompanyAttributeData: string[] = userAttributes
        .filter((f: LookerUserAttribute) => f.name === USER_ATTRIBUTE_SUB_COMPANY)
        .map((m: LookerUserAttribute) => m.value.trim());
      if (subCompanyAttributeData.length > 0) {
        const [sc] = subCompanyAttributeData;
        if (sc === LOOKER_NULL_STRING_FILTER) {
          subCompanyNullFilter = true;
        }
      }

      // figure out the attribute value for "fleets"
      const fleetAttributeData: string[] = userAttributes
        .filter((f: LookerUserAttribute) => f.name === USER_ATTRIBUTE_FLEETS)
        .map((m: LookerUserAttribute) => m.value.trim());
      if (fleetAttributeData.length > 0) {
        const [fl] = fleetAttributeData;
        if (fl === LOOKER_NULL_STRING_FILTER) {
          fleetNullFilter = true;
        }
      }

      // this should probably never happen for a report editor
      // it is the same as System Admin
      if (companyNullFilter && subCompanyNullFilter && fleetNullFilter) {
        ret.push('%C:%');
      } else if (!companyNullFilter && subCompanyNullFilter && fleetNullFilter) {
        adminOnlyGroups.forEach((g: string) => {
          const parts = g.split(DELIM);
          if (parts.length > 0) {
            const [first] = parts;
            ret.push(`C:${normalizeFolderPortion(first.replace(adminReplaceRe, ''))}%`);
          }
        });
      } else if (!companyNullFilter && !subCompanyNullFilter && fleetNullFilter) {
        adminOnlyGroups.forEach((g: string) => {
          const parts = g.split(DELIM);
          if (parts.length > 1) {
            const [first, second] = parts;
            ret.push(
              `C:${normalizeFolderPortion(
                first.replace(adminReplaceRe, '')
              )}${DELIM}C:${normalizeFolderPortion(second.replace(adminReplaceRe, ''))}%`
            );
          }
        });
      } else {
        adminOnlyGroups.forEach((g: string) => {
          const parts = g.split(DELIM);
          if (parts.length > 1) {
            const [first, second, third] = parts;

            // no third match means Company -> Fleet
            if (!third) {
              ret.push(
                `C:${normalizeFolderPortion(
                  first.replace(adminReplaceRe, '')
                )}${DELIM}F:${normalizeFolderPortion(second.replace(adminReplaceRe, ''))}%`
              );
            } else {
              ret.push(
                `C:${normalizeFolderPortion(
                  first.replace(adminReplaceRe, '')
                )}${DELIM}C:${normalizeFolderPortion(
                  second.replace(adminReplaceRe, '')
                )}${DELIM}F:${normalizeFolderPortion(third.replace(adminReplaceRe, ''))}%`
              );
            }
          }
        });
      }
    }
  }

  if (ret.length > 0) {
    return uniq(ret);
  }

  return null;
}

/* *************************************************
 * Column typings and definitions for the Reports AG Grid
 ************************************************* */

// make sure the "data" property of the cell renderer arg mirrors ScheduledPlanQueryResponse
type ReportGridCellRenderer = Omit<ICellRendererParams, 'data'> & {
  data: ScheduledPlanQueryResponse | ScheduledPlanByUserResponse;
};

/**
 * @TODO expand the match possibilities
 * @param fmt
 * @returns
 */
function translateDeliveryFormat(fmt: string): string {
  switch (fmt) {
    case 'assembled_pdf':
    case 'wysiwyg_pdf':
      return 'PDF';
    case 'csv':
    case 'csv_zip':
      return 'CSV zip file';
    case 'inline_json':
    case 'json':
    case 'json_detail':
    case 'json_detail_lite_stream':
    case 'json_label':
      return 'JSON';
    case 'txt':
      return 'Text';
    case 'wysiwyg_png':
      return 'PNG';
    default:
      return fmt.toUpperCase();
  }
}

/**
 * @TODO cron-parser pkg
 * @param crontab
 * @returns
 */
function crontabToFrequencyRenderer(crontab: string): string {
  let ret: string;

  const arr = crontab.split(/\s+/).map((m) => m.trim());

  if (arr.length < 5) {
    return 'custom';
  }

  // short circuit for five "*"
  if (arr.every((el) => crontabWildcardOnlyRe.test(el))) {
    return 'every minute';
  }

  const [first, second, third, fourth, fifth] = arr;

  const hasCustomMinute = !crontabWildcardOnlyRe.test(first);
  const hasCustomHour = !crontabWildcardOnlyRe.test(second);
  const hasCustomDayOfMonth = !crontabWildcardOnlyRe.test(third);
  const hasCustomMonth = !crontabWildcardOnlyRe.test(fourth);
  const hasCustomDayOfWeek = !crontabWildcardOnlyRe.test(fifth);

  // process of elimination
  if (hasCustomDayOfMonth) {
    ret = 'monthly, custom';
  } else if (hasCustomMonth) {
    if (crontabNumOnlyRe.test(fourth)) {
      ret = 'monthly';
    } else {
      ret = 'specific months';
    }
  } else if (hasCustomDayOfWeek) {
    ret = 'weekly, custom';
  } else if (crontabNumOnlyRe.test(first) && crontabNumOnlyRe.test(second)) {
    ret = 'daily';
  } else if (crontabNumAndCommaOnlyRe.test(first) && crontabNumAndCommaOnlyRe.test(second)) {
    ret = 'specific days';
  } else if (hasCustomMinute) {
    if (hasCustomHour) {
      if (crontabComboRe.test(second) || crontabNumAndCommaOnlyRe.test(second)) {
        ret = 'minutes, custom';
      } else {
        ret = 'hourly, custom';
      }
    } else if (crontabComboRe.test(first)) {
      ret = `every ${first.replace(/[^0-9,]/g, '')} minutes`;
    } else {
      ret = 'minute, custom';
    }
  } else if (hasCustomHour) {
    if (crontabComboRe.test(second)) {
      ret = `hourly at ${second.replace(/[^0-9,]/g, '')}`;
    } else {
      ret = 'hourly, custom';
    }
  } else {
    ret = 'every minute';
  }

  return ret;
}

/**
 * crontab-to-time parsing, with optional timezone now
 * https://carrier-digital.atlassian.net/browse/LYNXFLT-3728
 * @param crontab
 * @returns
 */
function crontabToTimeRenderer(
  crontab: string,
  crontabTimezone: string,
  userLocale: string,
  userTimezone: string
) {
  try {
    const interval = cronParser.parseExpression(crontab, { tz: crontabTimezone });
    let d;
    if (userLocale && userTimezone) {
      d = new Date(interval.next().toISOString()).toLocaleString(userLocale, {
        timeZone: userTimezone,
      });
    } else {
      d = new Date(interval.next().toISOString());
    }

    return format(new Date(d), 'HH:mm');
  } catch (e) {
    return '';
  }
}

function deliveryDestinationRenderer(planData: ScheduledPlanDestination[]): string {
  if (planData?.length > 0) {
    const [first] = planData;

    return first?.type || '';
  }

  return 'Unknown';
}

function deliveryFormatRenderer(planData: ScheduledPlanDestination[]): string {
  if (planData?.length > 0) {
    const [first] = planData;

    return translateDeliveryFormat(first?.format || '');
  }

  return 'Unknown';
}

function reportGridColumnDefs(
  ctx: Partial<LookerUserProviderState>,
  deleteClickHandler: (planId: string | number) => void,
  t: TFunction,
  dateFormat: DateFormatType,
  timezone: string
): Columns {
  return [
    {
      field: 'created_at',
      headerName: t('assets.reports.date-created'),
      headerTooltip: t('assets.reports.date-created'),
      cellRenderer: (d: ReportGridCellRenderer) => formatDate(d.data.created_at, dateFormat, { timezone }),
      pinned: 'left',
      lockVisible: true,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      field: 'name',
      headerName: t('assets.reports.report-name'),
      width: 325,
      cellRenderer: 'reportNameCellRenderer',
      cellStyle: (): Record<string, string> => ({
        overflowWrap: 'break-word',
      }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    // this is report type
    {
      field: 'title',
      headerName: t('assets.reports.report-type'),
      cellRenderer: (d: ReportGridCellRenderer) => {
        const parts = d.value.split('__');

        if (parts.length >= 3) {
          return t('assethistory.report.temperature-report');
        }

        if ((d.data as ScheduledPlan)?.type === 'running_hours') {
          return t('assets.reports.fleet-reports.running-hours-report');
        }

        return d.value;
      },
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    // recurrence / interval (weekly, daily, monthly, etc.)
    {
      field: 'crontab',
      headerName: t('assets.reports.recurrence'),
      cellRenderer: 'recurrenceCellRenderer',
      cellStyle: (): Record<string, string> => ({
        textTransform: 'capitalize',
      }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    // GMT delivery
    {
      field: 'crontab',
      headerName: t('assets.reports.gmt-time'),
      headerTooltip: t('assets.reports.gmt-time'),
      cellRenderer: (d: ReportGridCellRenderer) =>
        crontabToTimeRenderer(d.data.crontab, d.data.timezone, ctx?.user?.language || 'en-US', 'GMT'),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    // local delivery
    {
      field: 'crontab',
      headerName: t('assets.reports.local-time'),
      headerTooltip: t('assets.reports.local-time'),
      cellRenderer: (d: ReportGridCellRenderer) =>
        crontabToTimeRenderer(
          d.data.crontab,
          d.data.timezone,
          ctx?.user?.language || 'en-US',
          ctx?.user?.timezone || '' || Intl.DateTimeFormat().resolvedOptions().timeZone
        ),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    // delivery destination
    {
      field: 'scheduled_plan_destination',
      headerName: t('assets.reports.delivery'),
      cellRenderer: (d: ReportGridCellRenderer) =>
        deliveryDestinationRenderer(d.data.scheduled_plan_destination as ScheduledPlanDestination[]),
      cellStyle: (): Record<string, string> => ({
        textTransform: 'capitalize',
      }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    // recipients
    {
      field: 'scheduled_plan_destination',
      headerName: t('assets.reports.recipients'),
      cellRenderer: 'recipientCellRenderer', // <RecipientCellRenderer>
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    // delivery format
    {
      field: 'scheduled_plan_destination',
      headerName: t('assets.reports.format'),
      cellRenderer: (d: ReportGridCellRenderer) =>
        deliveryFormatRenderer(d.data.scheduled_plan_destination as ScheduledPlanDestination[]),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    // delete
    {
      field: 'id',
      headerName: '',
      cellRenderer: 'deleteCellRenderer',
      cellRendererParams: { ctx, deleteClickHandler },
      cellStyle: (): Record<string, string> => ({
        display: 'flex',
        justifyContent: 'flex-end',
      }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: '',
      field: '',
      headerName: '',
      suppressMenu: true,
      sortable: false,
      lockVisible: true,
      minWidth: 1,
      width: 1,
      suppressSizeToFit: false,
      suppressColumnsToolPanel: true,
    },
  ];
}
/**
 * Transform GraphQL getUser() result into context-compatible format
 * @param res
 * @param language
 * @param timezone
 * @param tokenExpiry
 * @returns
 */
function transformTokenRequest(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: any,
  language: Maybe<string> | undefined,
  timezone: Maybe<string> | undefined,
  tokenExpiry: number
): LookerUserData {
  return {
    id: res?.user?.id,
    accessToken: res?.access_token,
    email: res?.user?.email || null,
    expiresIn: tokenExpiry,
    externalGroupId: res?.user?.credentials_embed?.external_group_id || null,
    externalUserId: res?.user?.credentials_embed?.external_user_id || null,
    firstName: res?.user?.first_name || null,
    groupIds: res?.user?.group_ids || [],
    groupNames: [],
    isDisabled: res?.user?.is_disabled,
    language: language || '',
    lastName: res?.user?.last_name || null,
    refreshToken: res?.refresh_token || null,
    timezone: timezone || '',
    tokenType: res?.tokenType || 'Bearer',
    userAttributes: [],
  };
}

function getLookerReportType(lookmlId?: Maybe<string>): LookerReportType {
  if (lookmlId) {
    return 'running_hours';
  }

  return 'temperature';
}

function transformScheduledPlanQueryResponse(data: ScheduledPlanQueryResponse[]): ScheduledPlan[] {
  return data.map(
    (item): ScheduledPlan => ({
      type: getLookerReportType(),
      created_at: typeof item.created_at === 'string' ? item.created_at : '',
      crontab: item.crontab,
      enabled: item.enabled,
      id: item.id.toString(),
      name: item.name,
      timezone: item.timezone,
      title: item.title,
      dashboard_id: item.dashboard_id.toString(),
      scheduled_plan_destination: item.scheduled_plan_destination.map(
        (el): ScheduledPlanDest => ({
          id: el.id.toString(),
          address: el.address,
          format: el.format,
          type: el.type,
        })
      ),
    })
  );
}

function transformScheduledPlanByUserResponse(data: ScheduledPlanByUserResponse[]): ScheduledPlan[] {
  return data.map(
    (item): ScheduledPlan => ({
      ...item,
      type: getLookerReportType(item.lookml_dashboard_id),
    })
  );
}

export {
  crontabToFrequencyRenderer,
  crontabToTimeRenderer,
  getFolderMatchRegex,
  getFolderWildcardSearchStrings,
  normalizeFolderPortion,
  reportGridColumnDefs,
  transformTokenRequest,
  translateDeliveryFormat,
  transformScheduledPlanQueryResponse,
  transformScheduledPlanByUserResponse,
  userNoAccess,
};
