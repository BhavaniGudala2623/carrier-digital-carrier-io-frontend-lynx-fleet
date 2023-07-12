/**
 * $> yarn run nx run-many --target=test --projects=celsius-dashboard --watch
 */
import {
  GROUP_COMPANY_ADMIN,
  GROUP_FLEET_ADMIN,
  GROUP_REPORT_EDITOR,
  GROUP_SUB_COMPANY_ADMIN,
  GROUP_SYSTEM_ADMIN,
} from './constants';
import {
  hasCompanyContentAccess,
  hasCompanyFleetContentAccess,
  hasCompanySubcompanyContentAccess,
  hasSubcompanyFleetContentAccess,
  isCompanyAdmin,
  isFleetAdmin,
  isReportEditor,
  isSystemAdmin,
  isSubCompanyAdmin,
} from './is_has';

describe('is/has test suite', () => {
  it('checks hasCompanyContentAccess()', () => {
    expect(hasCompanyContentAccess('ABC Company', ['ABC Company Admin'])).toBe(true);
    expect(hasCompanyContentAccess('ABC Company', ['DEF Company Admin'])).toBe(false);
  });

  it('checks hasCompanyFleetContentAccess()', () => {
    expect(hasCompanyFleetContentAccess('ABC Company', 'Fleet 1', ['ABC Company::Fleet 1 Admin'])).toBe(true);
    expect(hasCompanyFleetContentAccess('ABC Company', 'Fleet 1', ['DEF Company::Fleet 1 Admin'])).toBe(
      false
    );
  });

  it('checks hasCompanySubcompanyContentAccess()', () => {
    expect(
      hasCompanySubcompanyContentAccess('ABC Company', 'Subsidiary 1', ['ABC Company::Subsidiary 1 Admin'])
    ).toBe(true);
    expect(
      hasCompanySubcompanyContentAccess('ABC Company', 'Subsidiary 1', ['DEF Company::Subsidiary 1 Admin'])
    ).toBe(false);
  });

  it('checks hasSubcompanyFleetContentAccess()', () => {
    expect(
      hasSubcompanyFleetContentAccess('ABC Company', 'Subsidiary 1', 'Fleet 1', [
        'ABC Company::Subsidiary 1::Fleet 1 Admin',
      ])
    ).toBe(true);
    expect(
      hasSubcompanyFleetContentAccess('ABC Company', 'Subsidiary 1', 'Fleet 1', [
        'DEF Company::Subsidiary 1::Fleet 1 Admin',
      ])
    ).toBe(false);
  });

  it('checks isCompanyAdmin()', () => {
    expect(isCompanyAdmin([GROUP_COMPANY_ADMIN])).toBe(true);
    expect(isCompanyAdmin(['foo'])).toBe(false);
  });

  it('checks isFleetAdmin()', () => {
    expect(isFleetAdmin([GROUP_FLEET_ADMIN])).toBe(true);
    expect(isFleetAdmin(['foo'])).toBe(false);
  });

  it('checks isReportEditor()', () => {
    expect(isReportEditor([GROUP_REPORT_EDITOR])).toBe(true);
    expect(isReportEditor(['foo'])).toBe(false);
  });

  it('checks isSystemAdmin()', () => {
    expect(isSystemAdmin([GROUP_SYSTEM_ADMIN])).toBe(true);
    expect(isSystemAdmin(['foo'])).toBe(false);
  });

  it('checks isSubCompanyAdmin()', () => {
    expect(isSubCompanyAdmin([GROUP_SUB_COMPANY_ADMIN])).toBe(true);
    expect(isSubCompanyAdmin(['foo'])).toBe(false);
  });
});
