import { Context, useContext } from 'react';

export const useNullableContext = <T>(context: Context<T>): NonNullable<T> => {
  const contextValue = useContext(context);

  if (!contextValue) {
    throw Error(`No provider found for ${context.displayName ?? 'Nullable context'}`);
  }

  return contextValue;
};
