import { Maybe } from '@carrier-io/lynx-fleet-types';
import { createContext, ReactElement, useMemo, useState, useContext } from 'react';

interface ITabPanelsContext {
  selectedTab: Maybe<number | string>;
  shouldUnmount: boolean;
  compartment1GroupOpen: boolean;
  setCompartment1GroupOpen: (open: boolean) => void;
}

interface TabPanelsProps {
  selectedTab: Maybe<string | number>;
  children: ReactElement | ReactElement[];
  shouldUnmount?: boolean;
}

export const TabPanelsContext = createContext<ITabPanelsContext>({
  selectedTab: null,
  shouldUnmount: true,
  compartment1GroupOpen: true,
  setCompartment1GroupOpen: () => {},
});

export const useTabPanelsContext = () => useContext(TabPanelsContext);

export const TabPanelsProvider = ({ selectedTab, children, shouldUnmount = true }: TabPanelsProps) => {
  const [compartment1GroupOpen, setCompartment1GroupOpen] = useState(true);

  const contextValue = useMemo(
    () => ({ selectedTab, shouldUnmount, compartment1GroupOpen, setCompartment1GroupOpen }),
    [selectedTab, shouldUnmount, compartment1GroupOpen, setCompartment1GroupOpen]
  );

  return <TabPanelsContext.Provider value={contextValue}>{children}</TabPanelsContext.Provider>;
};
