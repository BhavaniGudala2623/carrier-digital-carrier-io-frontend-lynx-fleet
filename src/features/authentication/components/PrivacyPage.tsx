import Box from '@carrier-io/fds-react/Box';
import { useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import { UserService } from '@carrier-io/lynx-fleet-data-lib';

import { fetchUserData } from '../stores';

import { TermsOfServiceAndPrivacyPolicy } from './TermsOfServiceAndPrivacyPolicy';

import { useAppDispatch } from '@/stores';
import { showError } from '@/stores/actions';
import { Loader } from '@/components/Loader';
import { getOktaUserEmail } from '@/utils';

export const PrivacyPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authState } = useOktaAuth();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleApprove = () => {
    setSubmitting(true);

    dispatch(UserService.acceptPrivacyPolicy)
      .then(({ data }) => {
        if (data?.acceptPrivacyPolicy.user.privacyPolicyAccepted) {
          const email = getOktaUserEmail(authState);

          dispatch(fetchUserData(email)).then(() => {
            navigate('/');
          });
        } else if (data?.acceptPrivacyPolicy.error) {
          setSubmitting(false);
          showError(dispatch, data.acceptPrivacyPolicy.error);
        }
      })
      .catch((error) => {
        setSubmitting(false);
        showError(dispatch, error);
      });
  };

  const handleReject = () => {
    navigate('/auth/logout');
  };

  return (
    <Box height="100vh" sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      {submitting ? (
        <Loader />
      ) : (
        <TermsOfServiceAndPrivacyPolicy
          open
          acknowledge={false}
          onApprove={() => handleApprove()}
          onReject={() => handleReject()}
        />
      )}
    </Box>
  );
};
