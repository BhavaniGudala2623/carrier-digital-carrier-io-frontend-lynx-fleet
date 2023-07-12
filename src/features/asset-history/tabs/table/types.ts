export type ParamsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    changedFields?: Set<string>;
  };
};
