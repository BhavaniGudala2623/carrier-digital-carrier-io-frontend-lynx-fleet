import { LanguageType } from '@carrier-io/lynx-fleet-types';

import { Maybe } from '@/types';
import { fetchGraphqlApi } from '@/utils';

interface GetWialonUrlArgs {
  email: string;
}

interface GetWialonUrlGqlResponse {
  wialonLoginUrl: string;
}

const query = `
  query getWialonUrl($email: String!) {
    wialonLoginUrl(email: $email)
  }
`;

export const wialonOpen = async (email: string, language: Maybe<LanguageType>) => {
  const oktaTokenStorage = localStorage.getItem('okta-token-storage');
  const token = oktaTokenStorage ? JSON.parse(oktaTokenStorage).accessToken.accessToken : '';

  try {
    const data = await fetchGraphqlApi<GetWialonUrlGqlResponse, GetWialonUrlArgs>(
      process.env.REACT_APP_USER_GQL_URL || '',
      token,
      query,
      { email }
    );

    const lang = language ? `&lang=${language.split('-')[0]}` : '';

    window.open(`${data.wialonLoginUrl}${lang}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
