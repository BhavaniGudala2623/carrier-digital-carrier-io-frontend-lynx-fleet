import { useCallback, useState } from 'react';

export const useSteps = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  return { activeStep, handleNext, handleBack, setActiveStep };
};
