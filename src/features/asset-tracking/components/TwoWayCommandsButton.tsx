import Button, { ButtonProps } from '@carrier-io/fds-react/Button';
import { useState } from 'react';

import { TwoWayCommandDialog } from '../features/TwoWayCommandDialog';

import type { SnapshotDataEx } from '@/features/common';

interface TwoWayCommandsButtonProps {
  selectedAsset: SnapshotDataEx | null;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  children: JSX.Element;
  testId?: string;
}

export const TwoWayCommandsButton = ({
  selectedAsset,
  variant = 'outlined',
  size,
  color,
  children,
  testId,
}: TwoWayCommandsButtonProps) => {
  const [twoWayDialogOpen, setTwoWayDialogOpen] = useState(false);

  const shouldDisableTwoWayCommands = !selectedAsset;

  return (
    <>
      <Button
        disabled={shouldDisableTwoWayCommands}
        onClick={() => setTwoWayDialogOpen(true)}
        size={size}
        variant={variant}
        color={color}
        data-testid={testId}
      >
        {children}
      </Button>
      {twoWayDialogOpen && (
        <TwoWayCommandDialog asset={selectedAsset} onClose={() => setTwoWayDialogOpen(false)} />
      )}
    </>
  );
};
