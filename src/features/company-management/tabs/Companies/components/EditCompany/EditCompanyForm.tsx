import { Formik, useFormikContext } from 'formik';
import { Company, Maybe, TenantsHierarchyTenant } from '@carrier-io/lynx-fleet-types';

import { getSteps, getStepContentForCarrierAdmin, getStepContent } from '../Steps';
import { useEditCompany } from '../../providers';
import { ContactFieldToPrimaryContactMap } from '../../../../constants';
import { isRegionValid } from '../validation';

import { validationSchemaEditCompany } from './validation/validationSchemaEditCompany';

import { useAppSelector } from '@/stores';
import { StepperComponent } from '@/components/Stepper/StepperComponent';
import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';
import { getAuthTenantsHierarchy } from '@/features/authentication';

interface IEditCompanyForm {
  onSubmit: (values: Company, imutableValues?: { features: Company['features'] }) => void;
  company: Company;
  activeStep: number;
  onClickNext: () => void;
  onClickBack: () => void;
  onClose: () => void;
  loading: boolean;
  isCarrierAdmin: boolean;
}

function EditCompanyFormContent({
  activeStep,
  onClickNext,
  onClickBack,
  onClose,
  loading,
  isCarrierAdmin,
}: Pick<
  IEditCompanyForm,
  'activeStep' | 'onClickNext' | 'onClickBack' | 'loading' | 'onClose' | 'isCarrierAdmin'
>) {
  const { isValid, values } = useFormikContext();

  const isFormContentValid = isValid && isRegionValid(values as Company);

  return (
    <StepperComponent
      loading={loading}
      activeStep={activeStep}
      onClickNext={onClickNext}
      onClickBack={onClickBack}
      onClose={onClose}
      getSteps={getSteps(isCarrierAdmin)}
      getStepContent={isCarrierAdmin ? getStepContentForCarrierAdmin(true) : getStepContent}
      isFormContentValid={isFormContentValid}
    />
  );
}

function getParentCompany(
  company: Company,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tenants?: TenantsHierarchyTenant[] | null
): Maybe<SelectedCompanyHierarchy> {
  if (!company?.parentId) {
    return null;
  }

  const parent = tenants?.find(({ id }) => company.parentId === id);

  if (company?.parentId && parent) {
    return {
      type: 'COMPANY',
      id: parent.id,
      name: parent.name,
    };
  }

  if (company?.parentName) {
    return {
      id: company?.parentId,
      name: company?.parentName ?? '',
      type: 'COMPANY',
    };
  }

  return null;
}

export function EditCompanyForm({
  onSubmit,
  company,
  activeStep,
  onClickNext,
  onClickBack,
  onClose,
  loading,
  isCarrierAdmin,
}: IEditCompanyForm) {
  const { users } = useEditCompany();
  const tenantsHierarchy = useAppSelector(getAuthTenantsHierarchy);

  const parentCompany = getParentCompany(company, tenantsHierarchy?.tenants);

  const handleSubmit = (values: Company & { parentCompany?: Maybe<SelectedCompanyHierarchy> }) => {
    const { parentCompany: pCompany, features, ...input } = values;

    onSubmit(input, { features });
  };

  const handleClickNext = (
    initialValues: Company & { parentCompany?: Maybe<SelectedCompanyHierarchy> },
    values: Company & { parentCompany?: Maybe<SelectedCompanyHierarchy> },
    setFieldValue: (key: string, value: string, shouldValidate?: boolean) => void
  ) => {
    onClickNext();
    const contactEmail = values.contactInfo?.email;

    // assigning initial contact info as the new admin hasn't been created
    if (
      initialValues?.contactInfo?.email !== contactEmail &&
      !users.find(({ email }) => email === contactEmail)
    ) {
      Object.entries(ContactFieldToPrimaryContactMap).forEach(([key, value]) => {
        setFieldValue(key, initialValues?.contactInfo?.[value] ?? '', true);
      });
    }
  };

  return (
    <Formik
      initialValues={{ ...company, parentCompany }}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={validationSchemaEditCompany}
      validateOnChange
      validateOnBlur
      validateOnMount
      initialTouched={{
        // @ts-ignore
        contactInfo: { email: true, name: true, lastName: true, country: true, phone: true },
      }}
    >
      {({ values, initialValues, setFieldValue }) => (
        <EditCompanyFormContent
          loading={loading}
          activeStep={activeStep}
          onClickNext={() => handleClickNext(initialValues, values, setFieldValue)}
          onClickBack={onClickBack}
          onClose={onClose}
          isCarrierAdmin={isCarrierAdmin}
        />
      )}
    </Formik>
  );
}
