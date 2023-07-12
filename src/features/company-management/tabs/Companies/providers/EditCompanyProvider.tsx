import { createContext, useContext, useMemo, useState } from 'react';
import { Maybe, User } from '@carrier-io/lynx-fleet-types';

import { useToggle } from '@/hooks';

type EditCompanyIdType = Maybe<string>;

type EditCompanyContextType = {
  isCompanyEditDialogOpen: boolean;
  handleOpenEditCompanyForm: (id: string) => void;
  handleCloseEditCompanyForm: () => void;
  companyId: EditCompanyIdType;
  activeStep: number;
  setNextStep: () => void;
  setPrevStep: () => void;
  users: User[];
  setUsers: (data: User[]) => void;
};

const EditCompanyContext = createContext<EditCompanyContextType>({
  isCompanyEditDialogOpen: false,
  handleOpenEditCompanyForm: (id: string) => id,
  handleCloseEditCompanyForm: () => {},
  companyId: null,
  activeStep: 0,
  setNextStep: () => {},
  setPrevStep: () => {},
  users: [],
  setUsers: () => {},
});

export const useEditCompany = () => {
  const context = useContext(EditCompanyContext);

  if (!context) {
    throw Error('No provider found for EditCompanyContext');
  }

  return context;
};

export const EditCompanyProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const {
    value: isCompanyEditDialogOpen,
    toggleOn: showEditCompanyForm,
    toggleOff: hideEditCompanyForm,
  } = useToggle(false);

  const [companyId, setCompanyId] = useState<EditCompanyIdType>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [activeStep, setActiveStep] = useState(0);

  const contextValue = useMemo(() => {
    const handleOpenEditCompanyForm = (id: string) => {
      showEditCompanyForm();
      setCompanyId(id);
      setActiveStep(0);
    };

    const handleCloseEditCompanyForm = () => {
      hideEditCompanyForm();
      setCompanyId(null);
      setUsers([]);
    };

    const setNextStep = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const setPrevStep = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return {
      isCompanyEditDialogOpen,
      handleOpenEditCompanyForm,
      handleCloseEditCompanyForm,
      companyId,
      activeStep,
      setNextStep,
      setPrevStep,
      users,
      setUsers,
    };
  }, [
    isCompanyEditDialogOpen,
    companyId,
    activeStep,
    showEditCompanyForm,
    hideEditCompanyForm,
    users,
    setUsers,
  ]);

  return <EditCompanyContext.Provider value={contextValue}>{children}</EditCompanyContext.Provider>;
};
