import { ApolloQueryResult } from '@apollo/client';
import { LastKey, PageArgs, PageResponse } from '@carrier-io/lynx-fleet-types';

type FetchFunc = (variables: PageArgs) => Promise<ApolloQueryResult<Record<string, unknown>>>;

export const fetchAllRecords = async <T>(
  fetchFunc: FetchFunc,
  params?: {
    scanLimit?: number;
    queryName?: string;
  }
): Promise<T[]> => {
  const result: T[] = [];
  let lastKey: LastKey | undefined;

  do {
    const { data } = await fetchFunc({ lastKey, scanLimit: params?.scanLimit });

    const pageResponse = (
      params?.queryName ? data[params.queryName] : data[Object.keys(data)[0] ?? '']
    ) as PageResponse<T, LastKey>;

    const { success, error, docs } = pageResponse;
    lastKey = pageResponse.lastKey;

    if (!success) {
      throw new Error(error);
    }

    if (docs?.length) {
      result.push(...docs);
    }
  } while (lastKey);

  return result;
};
