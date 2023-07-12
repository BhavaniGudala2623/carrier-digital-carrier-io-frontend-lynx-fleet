import { IAggFuncParams } from '@/types';

export const ParentSum = ({ values, data }: IAggFuncParams, field: 'assetCount' | 'userCount') => {
  const childrenSum = values.reduce((acc: number, value: number) => acc + Number(value), 0);

  return childrenSum + Number(data?.[field]);
};
