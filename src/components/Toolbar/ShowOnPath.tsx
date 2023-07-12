import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface ShowOnPathProps {
  path: string;
  children: ReactNode;
}

export const ShowOnPath = ({ path, children }: ShowOnPathProps) => {
  const location = useLocation();

  if (location.pathname === path) {
    return <div>{children}</div>;
  }

  return null;
};
