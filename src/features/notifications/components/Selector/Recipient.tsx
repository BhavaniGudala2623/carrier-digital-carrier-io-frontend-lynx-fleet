import { useEffect, useState } from 'react';
import TextField from '@carrier-io/fds-react/TextField';
import Autocomplete, { AutocompleteProps } from '@carrier-io/fds-react/Autocomplete';
import { useTranslation } from 'react-i18next';
import { MainService } from '@carrier-io/lynx-fleet-data-lib';

import { sortStrings } from '@/utils/sortStrings';

type RecipientSelectorProps = Omit<AutocompleteProps, 'options' | 'renderInput' | 'classes'> & {
  tenantId: string;
};

export function RecipientSelector({ value, onChange, tenantId, ...rest }: RecipientSelectorProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState<string[]>([]);

  useEffect(() => {
    MainService.getRecipients({ tenantId })
      .then(({ data }) => {
        const { getUserAccessibleTenantUsers } = data;

        if (getUserAccessibleTenantUsers.success) {
          setRecipients(
            getUserAccessibleTenantUsers.docs
              ?.reduce((reducedRecipients, recipient) => {
                if (recipient.email) {
                  reducedRecipients.push(recipient.email);
                }

                return reducedRecipients;
              }, [] as string[])
              .sort((a, b) => sortStrings(a, b)) ?? []
          );
        } else {
          throw new Error(getUserAccessibleTenantUsers.error ?? 'Error');
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  }, [tenantId]);

  return (
    <Autocomplete
      freeSolo
      multiple
      limitTags={1}
      options={recipients}
      getOptionLabel={(option) => option}
      value={value}
      onChange={onChange}
      loading={loading}
      renderInput={(params) => <TextField {...params} label={t('common.email')} />}
      {...rest}
    />
  );
}
