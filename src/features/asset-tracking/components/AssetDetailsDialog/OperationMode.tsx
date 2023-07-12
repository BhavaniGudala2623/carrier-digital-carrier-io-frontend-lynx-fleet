import { FC } from 'react';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';

export interface OperationModeProps {
  truMode?: JSX.Element;
}

export const OperationMode: FC<OperationModeProps> = ({ truMode = null }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="subtitle2" color={(theme) => theme.palette.text.secondary}>
        {t('assets.asset.table.op-mode')}
      </Typography>
      {truMode}
    </Box>
  );
};
