import { lazy, ComponentType } from 'react';

// Usage
// const { Home } = lazyImport(() => import("./Home"), "Home");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyImport<T extends ComponentType<any>, I extends { [K2 in K]: T }, K extends keyof I>(
  factory: () => Promise<I>,
  name: K
): I {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}
