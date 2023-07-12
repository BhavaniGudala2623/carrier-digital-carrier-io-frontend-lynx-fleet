import { DetailsContainer } from '../../containers';

import { SelectUsers } from './SelectUsers';
import { AssignRoles } from './AssignRoles';
import { Features } from './Features';

type GetStepContentOptionsType = { editMode: boolean; activeStep: number };

export function getStepContent(step: number, { editMode, activeStep }: GetStepContentOptionsType) {
  const steps: JSX.Element[] = [
    <DetailsContainer editMode={editMode} />,
    <SelectUsers />,
    <AssignRoles activeStep={activeStep} />,
    <Features />,
  ];

  return steps[step];
}
