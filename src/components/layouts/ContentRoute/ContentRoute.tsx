import { ReactElement } from 'react';

export interface ContentRouteProps {
  children?: ReactElement | ReactElement[];
}

export const ContentRoute = ({ children }: ContentRouteProps) => <div className="Content">{children}</div>;
