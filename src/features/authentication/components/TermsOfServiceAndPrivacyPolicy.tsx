import TermsOfService, { TermsOfServiceProps } from '@carrier-io/fds-react/patterns/SignIn/TermsOfService';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import Box from '@carrier-io/fds-react/Box';

import { PRIVACY_POLICY_PDF_EN, TERMS_OF_SERVICE_PDF_EN } from '@/constants/policy';

export const TermsOfServiceAndPrivacyPolicy: FC<Partial<TermsOfServiceProps>> = (props) => {
  const { t } = useTranslation();

  return (
    <Box>
      <TermsOfService
        acknowledge
        labelClose={t('common.close')}
        labelDownloadPDF={t('common.download-pdf')}
        labelEntry={t('policy.button')}
        labelApprove={t('policy.accept')}
        labelReject={t('policy.decline')}
        labelAcknowledgement={t('policy.acknowledge')}
        tabsConfiguration={[
          {
            id: '1',
            title: t('auth.celsius.login.terms-of-service'),
            // @ts-ignore
            // TODO remove ts-ignore after FDS component fix
            content: (
              <iframe
                width={900}
                height={490}
                src={`${TERMS_OF_SERVICE_PDF_EN}#toolbar=0`}
                title={t('auth.celsius.login.terms-of-service')}
                data-testid="terms-of-service-frame"
              />
            ),
            linkToPDF: TERMS_OF_SERVICE_PDF_EN,
          },
          {
            id: '2',
            title: t('policy.privacy'),
            // @ts-ignore
            // TODO remove ts-ignore after FDS component fix
            content: (
              <iframe
                width={900}
                height={490}
                src={`${PRIVACY_POLICY_PDF_EN}#toolbar=0`}
                title={t('policy.privacy')}
                data-testid="policy-privacy-frame"
              />
            ),
            linkToPDF: PRIVACY_POLICY_PDF_EN,
          },
        ]}
        title={t('policy.button')}
        {...props}
      />
    </Box>
  );
};
