/* eslint-disable prefer-regex-literals */
/**
 * $> yarn run nx run-many --target=test --projects=celsius-dashboard --watch
 */
import { LookerUserData, LookerUserProviderState } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

import {
  isCompanyAdmin,
  isFleetAdmin,
  isReportEditor,
  isSubCompanyAdmin,
  isSystemAdmin,
  hasCompanyContentAccess,
  hasCompanyFleetContentAccess,
  hasCompanySubcompanyContentAccess,
  hasSubcompanyFleetContentAccess,
} from './is_has';
import {
  crontabToFrequencyRenderer,
  getFolderMatchRegex,
  getFolderWildcardSearchStrings,
  reportGridColumnDefs,
  transformTokenRequest,
  translateDeliveryFormat,
  userNoAccess,
} from './utils';

/**
 * permutations of the wildcard searchstring function
 */
describe('getFolderWildcardSearchStrings()', () => {
  /**
   * empty object
   */
  it('verifies an empty object', () => {
    expect(getFolderWildcardSearchStrings({})).toBeNull();
    expect(getFolderMatchRegex({})).toBeNull();
  });

  /**
   * system admin
   */
  it('verifies system admin', () => {
    const ctx: Partial<LookerUserProviderState> = {
      user: {
        id: '1',
        accessToken: '',
        groupNames: ['admin'],
        userAttributes: [
          {
            name: 'company',
            value: '%, NULL',
          },
          {
            name: 'sub_companies',
            value: '%, NULL',
          },
          {
            name: 'fleets',
            value: '%, NULL',
          },
        ],
      },
    };
    expect(getFolderWildcardSearchStrings(ctx)).toEqual(['%C:%', 'U:%']);
    expect(getFolderMatchRegex(ctx)).toEqual(new RegExp(/C:|U:/));
  });

  /**
   * Company Admin
   */
  it('verifies company admin', () => {
    const ctx: Partial<LookerUserProviderState> = {
      user: {
        id: '1',
        accessToken: '',
        groupNames: ['Some Long Company Name We Need to Chop Admin', 'company_admin'],
        userAttributes: [
          {
            name: 'company',
            value: 'Some Long Company Name We Need to Chop',
          },
          {
            name: 'sub_companies',
            value: '%, NULL',
          },
          {
            name: 'fleets',
            value: '%, NULL',
          },
        ],
      },
    };
    expect(getFolderWildcardSearchStrings(ctx)).toEqual(['%U:1', 'C:SomeLongCompanyNameWeNeedto%']);
    expect(getFolderMatchRegex(ctx)).toEqual(new RegExp(/U:1$|C:SomeLongCompanyNameWeNeedto/));
  });

  /**
   * Sub Company Admin
   */
  it('verifies sub company admin', () => {
    const ctx: Partial<LookerUserProviderState> = {
      user: {
        id: '1',
        accessToken: '',
        groupNames: ['ACME HVAC::Subsidiary 1 With A Long Subsidiary Name Admin', 'sub_company_admin'],
        userAttributes: [
          {
            name: 'company',
            value: 'ACME HVAC',
          },
          {
            name: 'sub_companies',
            value: 'Subsidiary 1 With A Long Subsidiary Name',
          },
          {
            name: 'fleets',
            value: '%, NULL',
          },
        ],
      },
    };
    expect(getFolderWildcardSearchStrings(ctx)).toEqual([
      '%U:1',
      'C:ACMEHVAC::C:Subsidiary1WithALongSubsidi%',
    ]);
    expect(getFolderMatchRegex(ctx)).toEqual(new RegExp(/U:1$|C:ACMEHVAC::C:Subsidiary1WithALongSubsidi/));
  });

  /**
   * Fleet Admin
   */
  it('verifies fleet admin', () => {
    const ctx: Partial<LookerUserProviderState> = {
      user: {
        id: '1',
        accessToken: '',
        groupNames: [
          'ACME HVAC::Subsidiary 1::Fleet ABC Admin',
          'ACME HVAC::Subsidiary 1::Fleet DEF Long Fleet Name Booyah Admin',
          'fleet_admin',
        ],
        userAttributes: [
          {
            name: 'company',
            value: 'ACME HVAC',
          },
          {
            name: 'sub_companies',
            value: 'Subsidiary 1',
          },
          {
            name: 'fleets',
            value: "'Fleet ABC','Fleet DEF Long Fleet Name Booyah'",
          },
        ],
      },
    };
    expect(getFolderWildcardSearchStrings(ctx)).toEqual([
      '%U:1',
      'C:ACMEHVAC::C:Subsidiary1::F:FleetABC%',
      'C:ACMEHVAC::C:Subsidiary1::F:FleetDEFLongFleetNameBooyah%',
    ]);
    expect(getFolderMatchRegex(ctx)).toEqual(
      new RegExp(
        /U:1$|C:ACMEHVAC::C:Subsidiary1::F:FleetABC|C:ACMEHVAC::C:Subsidiary1::F:FleetDEFLongFleetNameBooyah/
      )
    );
  });

  /**
   * Fleet Admin, directly under alpha company
   */
  it('verifies fleet admin directly under alpha company', () => {
    const ctx: Partial<LookerUserProviderState> = {
      user: {
        id: '1',
        accessToken: '',
        groupNames: [
          'ACME HVAC::Fleet ABC Admin',
          'ACME HVAC::Fleet DEF With Super Long Name Admin',
          'fleet_admin',
        ],
        userAttributes: [
          {
            name: 'company',
            value: 'ACME HVAC',
          },
          {
            name: 'sub_companies',
            value: '%, NULL',
          },
          {
            name: 'fleets',
            value: "'Fleet ABC','Fleet DEF With Super Long Name'",
          },
        ],
      },
    };
    expect(getFolderWildcardSearchStrings(ctx)).toEqual([
      '%U:1',
      'C:ACMEHVAC::F:FleetABC%',
      'C:ACMEHVAC::F:FleetDEFWithSuperLongName%',
    ]);

    expect(getFolderMatchRegex(ctx)).toEqual(
      new RegExp(/U:1$|C:ACMEHVAC::F:FleetABC|C:ACMEHVAC::F:FleetDEFWithSuperLongName/)
    );
  });

  /**
   * Report Editor
   */
  it('verifies report editor', () => {
    const ctx: Partial<LookerUserProviderState> = {
      user: {
        id: '1',
        accessToken: '',
        groupNames: [
          'ACME HVAC::Fleet ABC Admin',
          'ACME HVAC::Fleet DEF With Super Long Name Booyah Admin',
          'report_editor',
        ],
        userAttributes: [
          {
            name: 'company',
            value: 'ACME HVAC',
          },
          {
            name: 'sub_companies',
            value: '%, NULL',
          },
          {
            name: 'fleets',
            value: "'Fleet ABC','Fleet DEF With Super Long Name Booyah'",
          },
        ],
      },
    };
    expect(getFolderWildcardSearchStrings(ctx)).toEqual([
      '%U:1',
      'C:ACMEHVAC::F:FleetABC%',
      'C:ACMEHVAC::F:FleetDEFWithSuperLongNameBo%',
    ]);
    expect(getFolderMatchRegex(ctx)).toEqual(
      new RegExp(/U:1$|C:ACMEHVAC::F:FleetABC|C:ACMEHVAC::F:FleetDEFWithSuperLongNameBo/)
    );
  });
});

/**
 * is...() functions
 */
describe('is...() functions', () => {
  it('checks isCompanyAdmin()', () => {
    expect(isCompanyAdmin(['company_admin'])).toBe(true);
    expect(isCompanyAdmin(['foo'])).toBe(false);
  });

  it('checks isFleetAdmin()', () => {
    expect(isFleetAdmin(['fleet_admin'])).toBe(true);
    expect(isFleetAdmin(['foo'])).toBe(false);
  });

  it('checks isReportEditor()', () => {
    expect(isReportEditor(['report_editor'])).toBe(true);
    expect(isReportEditor(['foo'])).toBe(false);
  });

  it('checks isSubCompanyAdmin()', () => {
    expect(isSubCompanyAdmin(['sub_company_admin'])).toBe(true);
    expect(isSubCompanyAdmin(['foo'])).toBe(false);
  });

  it('checks isSystemAdmin()', () => {
    expect(isSystemAdmin(['admin'])).toBe(true);
    expect(isSystemAdmin(['foo'])).toBe(false);
  });
});

/**
 * has...() functions
 */
describe('has...() functions', () => {
  it('checks hasCompanyContentAccess()', () => {
    expect(hasCompanyContentAccess('ABC Company', ['ABC Company Admin'])).toBe(true);
    expect(hasCompanyContentAccess('ABC Company', ['ABC Company'])).toBe(false);
  });

  it('checks hasCompanyFleetContentAccess()', () => {
    expect(hasCompanyFleetContentAccess('ABC Company', 'Fleet 1', ['ABC Company::Fleet 1 Admin'])).toBe(true);
    expect(hasCompanyFleetContentAccess('ABC Company', 'Fleet 1', ['ABC Company::Fleet 1'])).toBe(false);
  });

  it('checks hasCompanySubcompanyContentAccess()', () => {
    expect(
      hasCompanySubcompanyContentAccess('ABC Company', 'ABC Subsidiary', [
        'ABC Company::ABC Subsidiary Admin',
      ])
    ).toBe(true);
    expect(
      hasCompanySubcompanyContentAccess('ABC Company', 'ABC Subsidiary', ['ABC Company::ABC Subsidiary'])
    ).toBe(false);
  });

  it('checks hasSubcompanyFleetContentAccess()', () => {
    expect(
      hasSubcompanyFleetContentAccess('ABC Company', 'ABC Subsidiary', 'Fleet 1', [
        'ABC Company::ABC Subsidiary::Fleet 1 Admin',
      ])
    ).toBe(true);
    expect(
      hasSubcompanyFleetContentAccess('ABC Company', 'ABC Subsidiary', 'Fleet 1', [
        'ABC Company::ABC Subsidiary::Fleet 1',
      ])
    ).toBe(false);
  });

  it('checks userNoAccess()', () => {
    const baseUserDataObject: LookerUserData = {
      id: '30',
      accessToken: '',
      email: '',
      expiresIn: 3600,
      externalGroupId: '',
      externalUserId: '4m_embed_msr',
      firstName: 'Embed',
      groupIds: [4],
      groupNames: [],
      isDisabled: false,
      lastName: '30',
      refreshToken: '',
      tokenType: 'Bearer',
      userAttributes: [],
    };

    expect(userNoAccess(baseUserDataObject, [])).toBe(true);
    expect(userNoAccess(baseUserDataObject, ['admin'])).toBe(false);
    expect(userNoAccess(baseUserDataObject, ['foo', 'bar', 'baz'])).toBe(true);
    expect(userNoAccess({ ...baseUserDataObject, isDisabled: true }, ['admin'])).toBe(true);
  });
});

describe('AG Grid utility functions', () => {
  it('checks translateDeliveryFormat()', () => {
    expect(translateDeliveryFormat('assembled_pdf')).toBe('PDF');
    expect(translateDeliveryFormat('wysiwyg_pdf')).toBe('PDF');
    expect(translateDeliveryFormat('csv')).toBe('CSV zip file');
    expect(translateDeliveryFormat('csv_zip')).toBe('CSV zip file');
    expect(translateDeliveryFormat('inline_json')).toBe('JSON');
    expect(translateDeliveryFormat('json')).toBe('JSON');
    expect(translateDeliveryFormat('json_detail')).toBe('JSON');
    expect(translateDeliveryFormat('json_detail_lite_stream')).toBe('JSON');
    expect(translateDeliveryFormat('json_label')).toBe('JSON');
    expect(translateDeliveryFormat('txt')).toBe('Text');
    expect(translateDeliveryFormat('wysiwyg_png')).toBe('PNG');
    expect(translateDeliveryFormat('no match')).toBe('NO MATCH');
  });

  it('checks the column definitions', () => {
    const mockT = (x: string) => x;

    expect(
      reportGridColumnDefs({}, Function.prototype(), mockT as TFunction, 'M/d/yyyy, h:mm a', 'Asia/Almaty')
    ).toHaveLength(11);
  });
});

describe('transforming GraphQL data to LookerUserData', () => {
  const lang = 'en-US';
  const tz = 'America/New_York';

  it('verifies transformTokenRequest()', () => {
    const tokenExpiration = new Date(new Date().setHours(new Date().getHours() + 1)).getTime();
    const defaultResults = transformTokenRequest({}, lang, tz, tokenExpiration);

    expect(transformTokenRequest({}, lang, tz, tokenExpiration)).toEqual(defaultResults);
    expect(transformTokenRequest({ user: { is_disabled: false } }, lang, tz, tokenExpiration)).toEqual({
      ...defaultResults,
      isDisabled: false,
    });
    expect(transformTokenRequest({ access_token: 'foo' }, lang, tz, tokenExpiration)).toEqual({
      ...defaultResults,
      accessToken: 'foo',
    });
    expect(transformTokenRequest({ user: { last_name: 'Test' } }, lang, tz, tokenExpiration)).toEqual({
      ...defaultResults,
      lastName: 'Test',
    });
    expect(transformTokenRequest({ user: { first_name: 'Embed' } }, lang, tz, tokenExpiration)).not.toEqual({
      ...defaultResults,
      lastName: 'Test',
    });
  });
});

/**
 * crontabToFrequencyRenderer
 */
describe('crontabToFrequencyRenderer()', () => {
  it('verifies the output', () => {
    expect(crontabToFrequencyRenderer('')).toBe('custom');
    expect(crontabToFrequencyRenderer('* * * * *')).toBe('every minute');
    expect(crontabToFrequencyRenderer('*/25 3 * * *')).toBe('minutes, custom');
    expect(crontabToFrequencyRenderer('0 6 * * *')).toBe('daily');
    expect(crontabToFrequencyRenderer('50 19,20 * * *')).toBe('specific days');
    expect(crontabToFrequencyRenderer('* * * 3 *')).toBe('monthly');
    expect(crontabToFrequencyRenderer('* * * 3,4 *')).toBe('specific months');
    expect(crontabToFrequencyRenderer('10 14 * * 1')).toBe('weekly, custom');
    expect(crontabToFrequencyRenderer('0 0 1,15 * *')).toBe('monthly, custom');
    expect(crontabToFrequencyRenderer('0 0 * * 1-5')).toBe('weekly, custom');
    expect(crontabToFrequencyRenderer('39 0 1 1,6,12 *')).toBe('monthly, custom');
    expect(crontabToFrequencyRenderer('5,10 0 10 * 1')).toBe('monthly, custom');
  });
});
