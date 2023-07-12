import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import Typography from '@carrier-io/fds-react/Typography';
import { SelectProps } from '@carrier-io/fds-react/Select';
import { Add as AddIcon } from '@mui/icons-material';

import { CreateCompanyFormData } from '../../../types';

import { FormSelect } from '@/components/FormSelect';

interface AdminSelectorProps {
  handleOpen: () => void;
  handleChange: SelectProps['onChange'];
  userDictionary: Record<string, string>;
  options: string[];
}

export const AdminSelector = ({ handleOpen, handleChange, userDictionary, options }: AdminSelectorProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<CreateCompanyFormData>();

  return (
    <div>
      {options.length > 0 && (
        <>
          <Typography variant="inputLabel" color="text.secondary">
            {t('company.management.company-admin')}
          </Typography>
          <FormSelect
            value={values?.contactInfo?.email?.toLowerCase() ?? ''}
            name="companyInfo.email"
            onChange={handleChange}
            options={options}
            dictionary={userDictionary}
            required
          />
        </>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          {t('company.management.required-fields')}
        </Typography>
        <Button startIcon={<AddIcon />} variant="text" color="primary" onClick={handleOpen}>
          {t('company.management.add-user')}
        </Button>
      </Box>
    </div>
  );
};

AdminSelector.displayName = 'AdminSelector';
