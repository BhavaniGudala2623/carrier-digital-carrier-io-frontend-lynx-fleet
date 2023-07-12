import { GraphQLError } from 'graphql';

interface GqlResponse {
  errors?: GraphQLError[];
  data?: unknown;
}

export async function fetchGraphqlApi<T, R>(
  url: string,
  authToken: string,
  query: string,
  variables?: R
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const responseData: GqlResponse = await response.json();

  const { errors, data } = responseData;

  if (errors?.length) {
    throw new Error(errors[0].message);
  }

  return data as T;
}
