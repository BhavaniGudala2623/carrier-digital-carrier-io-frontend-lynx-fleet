import { StrictMode } from 'react';

const strictMode = process.env.REACT_APP_STRICT_MODE !== 'false';

export const StrictModeProvider = ({ children }: { children: JSX.Element }) =>
  strictMode ? <StrictMode>{children}</StrictMode> : children;
