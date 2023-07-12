import { useCallback, useEffect, useState } from 'react';
import { DocumentNode, useMutation, useQuery } from '@apollo/client';
import {
  GetEntityByIdArgs,
  GetEntityByIdGqlResponse,
  Maybe,
  UpdateEntityArgs,
  UpdateEntityGqlResponse,
} from '@carrier-io/lynx-fleet-types';

import { getObjectDifference } from '../utils';

interface UseEditOne {
  id: string;
  entityKey: string;
  updateEntityKey: string;
  getOneEntityQuery: DocumentNode;
  updateOneEntityQuery: DocumentNode;
  refetchQueries: DocumentNode[];
  skipQuery?: boolean;
  onSuccessCallBack: () => void;
}

interface UseEditOneReturnValue<T> {
  loading: boolean;
  queryError: Maybe<string>;
  mutationError: Maybe<string>;
  onSave: (valuesToFindDiff: T, values?: Partial<T>) => void;
  entity: Maybe<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEditOne<T extends Record<string, any>>({
  id,
  entityKey,
  updateEntityKey,
  getOneEntityQuery,
  updateOneEntityQuery,
  refetchQueries,
  skipQuery,
  onSuccessCallBack,
}: UseEditOne): UseEditOneReturnValue<T> {
  const [loading, setLoading] = useState(false);
  const [queryError, setQueryError] = useState<Maybe<string>>(null);
  const [mutationError, setMutationError] = useState<Maybe<string>>(null);

  const {
    loading: qLoading,
    error: qError,
    data: qData,
  } = useQuery<GetEntityByIdGqlResponse<T>, GetEntityByIdArgs>(getOneEntityQuery, {
    variables: {
      id,
    },
    errorPolicy: 'all',
    skip: skipQuery,
  });

  const [updateEntity, { loading: mLoading, error: mError }] = useMutation<
    UpdateEntityGqlResponse<T>,
    UpdateEntityArgs<T>
  >(updateOneEntityQuery, {
    refetchQueries,
  });

  useEffect(() => {
    setLoading(qLoading || mLoading);
  }, [qLoading, mLoading]);

  useEffect(() => {
    setQueryError(qError?.graphQLErrors?.[0]?.message || qError?.message || null);
  }, [qError]);

  useEffect(() => {
    setMutationError(mError?.graphQLErrors?.[0]?.message || mError?.message || null);
  }, [mError]);

  const entity = qData ? qData[entityKey] : null;

  const onSave = useCallback(
    async (valuesToFindDiff: T, values?: Partial<T>) => {
      if (!entity) {
        return;
      }
      try {
        await updateEntity({
          variables: {
            [updateEntityKey]: {
              id,
              ...getObjectDifference(Object.assign(valuesToFindDiff), Object.assign(entity)),
              ...(values || {}),
            },
          },
        });
        onSuccessCallBack();
      } catch (err) {
        if (err instanceof Error) {
          setMutationError(err.message);
        }
      }
    },
    [id, onSuccessCallBack, entity, updateEntity, updateEntityKey]
  );

  return {
    loading,
    queryError,
    mutationError,
    onSave,
    entity,
  };
}
