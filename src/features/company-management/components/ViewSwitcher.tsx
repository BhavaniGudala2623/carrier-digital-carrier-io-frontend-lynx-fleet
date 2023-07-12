import { useMemo, KeyboardEvent } from 'react';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import MenuList from '@carrier-io/fds-react/MenuList';
import { useTranslation } from 'react-i18next';

import { ButtonPopper } from './ButtonPopper';

import { useToggle } from '@/hooks';

export type SwitcherOption<T = string> = {
  id: T;
  label: string;
};
interface ViewSwitcherProps<T> {
  selectedView: T;
  options: SwitcherOption<T>[];
  onSelectedViewChange: (view: T) => void;
}

export const ViewSwitcher = <T,>({ selectedView, options, onSelectedViewChange }: ViewSwitcherProps<T>) => {
  const { t } = useTranslation();
  const { value: isOpen, toggle, toggleOff: setClose } = useToggle(false);

  const menuListGrow = 'menu-list-grow';

  const handleListKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setClose();
    }
  };

  const handleChange = (view: SwitcherOption<T>) => () => {
    onSelectedViewChange(view.id);
    setClose();
  };

  const selectedOption = useMemo(() => options.find((o) => o.id === selectedView), [selectedView, options])!;

  return (
    <ButtonPopper isOpen={isOpen} buttonLabel={t(selectedOption.label)} onClose={setClose} onToggle={toggle}>
      <MenuList autoFocusItem={isOpen} id={menuListGrow} onKeyDown={handleListKeyDown}>
        {options.map((option) => (
          <MenuItem key={option.label} onClick={handleChange(option)}>
            {t(option.label)}
          </MenuItem>
        ))}
      </MenuList>
    </ButtonPopper>
  );
};
