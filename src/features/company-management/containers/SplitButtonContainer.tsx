import { useCallback, MouseEvent } from 'react';
import { ButtonGroupProps } from '@carrier-io/fds-react/ButtonGroup';
import { PopperProps } from '@carrier-io/fds-react/Popper';

import { SplitButton } from '../components/SplitButton';
import { useCompanyManagementState, companyManagementSlice } from '../stores';

import { useAppDispatch } from '@/stores';

interface IProps {
  buttonGroupProps?: ButtonGroupProps;
  popperProps?: PopperProps;
  options: { label: string; key: string }[];
  placeholder: string;
  onClick: (event: MouseEvent<HTMLButtonElement, MouseEvent>, selectedIndex: string) => void;
}

export const SplitButtonContainer = ({
  buttonGroupProps,
  popperProps,
  options,
  placeholder,
  onClick,
}: IProps) => {
  const { selectedSplitButtonIndex } = useCompanyManagementState();
  const dispatch = useAppDispatch();

  const handleMenuItemClick = useCallback(
    (_event: MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
      dispatch(companyManagementSlice.actions.setSplitButtonIndex(index));
    },
    [dispatch]
  );

  return (
    <SplitButton
      handleMenuItemClick={handleMenuItemClick}
      selectedIndex={selectedSplitButtonIndex}
      buttonGroupProps={buttonGroupProps}
      placeholder={placeholder}
      options={options}
      onClick={onClick}
      popperProps={popperProps}
    />
  );
};
