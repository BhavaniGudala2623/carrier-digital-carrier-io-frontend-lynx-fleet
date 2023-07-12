import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import Box from '@carrier-io/fds-react/Box';

import { Header } from '../../Header';
import { Aside } from '../../Aside';
import { ExtLoading } from '../../ExtLoading';

import { selectExtLoading, useAppSelector } from '@/stores';
import { Loader } from '@/components';

import './styles.scss';

export const SinglePageLayout = () => {
  const { t } = useTranslation();
  const isExtLoading = useAppSelector(selectExtLoading);

  return (
    <Box className="SinglePageLayout" sx={{ bgcolor: 'background.desktop' }}>
      {isExtLoading && <ExtLoading text={t('common.loading')} />}
      <Header />
      <Box className="SinglePageLayout-content">
        <Aside />
        <Box display="flex" flexDirection="column" flex={1}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};
