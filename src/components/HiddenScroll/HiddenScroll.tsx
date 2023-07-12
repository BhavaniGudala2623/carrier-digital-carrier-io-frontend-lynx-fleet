import { FC } from 'react';

import './styles.scss';

interface HiddenScrollProps {
  children: JSX.Element | string;
}

export const HiddenScroll: FC<HiddenScrollProps> = ({ children }) => (
  <div className="hidden-scroll">{children}</div>
);
