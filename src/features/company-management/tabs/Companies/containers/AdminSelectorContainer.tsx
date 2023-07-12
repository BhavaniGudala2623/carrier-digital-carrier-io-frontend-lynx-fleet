import { useMemo } from 'react';
import { SelectProps } from '@carrier-io/fds-react/Select';
import Box from '@carrier-io/fds-react/Box';
import { isString } from 'lodash-es';
import { User } from '@carrier-io/lynx-fleet-types';

import { AdminSelector } from '../components';
import { PrimaryContactProps } from '../types';

interface AdminSelectorContainerProps {
  handleOpen: () => void;
  setPrimaryContactFields: (data: PrimaryContactProps) => void;
  setPrimaryContactRef: (data: PrimaryContactProps) => void;
  users: User[];
}

export const AdminSelectorContainer = ({
  handleOpen,
  setPrimaryContactFields,
  setPrimaryContactRef,
  users,
}: AdminSelectorContainerProps) => {
  const userEmails = useMemo(() => users.map(({ email }) => email) ?? [], [users]);
  const userDictionary = useMemo(
    () => users.reduce((acc, { email, fullName }) => ({ ...acc, [email]: fullName }), {}),
    [users]
  );

  const handleChange: SelectProps['onChange'] = async ({ target }) => {
    const user = users.find(
      ({ email }) => email.toLowerCase() === (isString(target?.value) && target.value.toLowerCase())
    );
    if (user) {
      const data = {
        email: user.email.toLowerCase(),
        name: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      };

      setPrimaryContactFields(data);
      setPrimaryContactRef(data);
    }
  };

  return (
    <Box position="relative" sx={{ minHeight: 48 }} mb={2} mt={1}>
      <AdminSelector
        handleOpen={handleOpen}
        handleChange={handleChange}
        userDictionary={userDictionary}
        options={userEmails}
      />
    </Box>
  );
};
