import { ReactElement } from 'react';

import { ContentDrawer } from '@/components';
import { ContentRoute } from '@/components/layouts';

export interface ContentWithDrawerContainerProps {
  children?: ReactElement | ReactElement[];
  drawer?: ReactElement;
  noDrawerPadding?: boolean;
}

export const ContentWithDrawerContainer = ({
  children,
  drawer,
  noDrawerPadding,
}: ContentWithDrawerContainerProps) => (
  <div className="ContentContainer">
    {drawer && <ContentDrawer noPadding={noDrawerPadding}>{drawer}</ContentDrawer>}
    <ContentRoute>{children}</ContentRoute>
  </div>
);
