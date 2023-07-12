import { GroupRole, User } from '@carrier-io/lynx-fleet-types';

import { getGroupsWhereUserIsOwner } from './user.utils';

describe('User utils', () => {
  describe('getGroupsWhereUserIsOwner', () => {
    const user: User = {
      firstName: 'Joe',
      lastName: 'Doe',
      fullName: 'Joe Doe',
      email: 'test@mail.com',
      phone: '+11111111',
      status: 'ACTIVE',
      tenantId: '0893220e-cb3e-4645-a823-a8cdfca09cfc',
      wialonUserId: 1111,
      lastModified: '2022-04-20T05:42:52.545Z',
      primary: false,
      role: null,
      tenant: { id: '0893220e-cb3e-4645-a823-a8cdfca09cfc', name: 'Company' },
      groups: [],
    };
    it('Returns correct group list', () => {
      const user1 = {
        ...user,
        groups: [
          {
            group: {
              name: 'Test_Group',
              id: '1111',
            },
            user: {
              role: 'Owner' as GroupRole,
            },
          },
          {
            group: {
              name: 'Test_Group1',
              id: '1111',
            },
            user: {
              role: 'Member' as GroupRole,
            },
          },
        ],
      };
      const expectedResult = [
        {
          name: 'Test_Group',
          id: '1111',
        },
      ];

      const res = getGroupsWhereUserIsOwner(user1);
      expect(res).toEqual(expectedResult);
    });
    it('Returns empty group list #1', () => {
      const user2 = {
        ...user,
        groups: [
          {
            group: {
              name: 'Test_Group',
              id: '1111',
            },
            user: {
              role: 'Manager' as GroupRole,
            },
          },
          {
            group: {
              name: 'Test_Group1',
              id: '1111',
            },
            user: {
              role: 'Member' as GroupRole,
            },
          },
        ],
      };

      const res = getGroupsWhereUserIsOwner(user2);
      expect(res).toEqual([]);
    });

    it('Returns empty group list #2', () => {
      const res = getGroupsWhereUserIsOwner(user);
      expect(res).toEqual([]);
    });
  });
});
