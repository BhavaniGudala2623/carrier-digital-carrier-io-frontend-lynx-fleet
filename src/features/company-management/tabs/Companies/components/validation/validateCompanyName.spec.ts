import { validateCompanyName } from './validateCompanyName';

jest.mock('../CreateCompany/validationSchemaCreateCompany', () => ({
  checkCompanyNameAvailabilityDebounced: jest.fn().mockResolvedValue(Promise.resolve(false)),
}));

describe('validateCompanyName', () => {
  const requiredCompanyNameErrorMessage = 'company.management.validation.error.company-name-required';
  const invalidCompanyNameErrorMessage = 'company.management.validation.error.company-name-matches';
  const companyNameExistsErrorMessage = 'company.management.validation.error.company-already-exists';

  it('empty string', async () => {
    const res = await validateCompanyName('', 'Carrier');
    expect(res).toEqual(requiredCompanyNameErrorMessage);
  });

  it('incorrect company name', async () => {
    const res = await validateCompanyName('Carrier!!!', 'Carrier');
    expect(res).toEqual(invalidCompanyNameErrorMessage);
  });

  it('correct company name, but already exists. The new name is not equal to the initial company name', async () => {
    const res = await validateCompanyName('Carrier', 'Test Company');
    expect(res).toEqual(companyNameExistsErrorMessage);
  });

  it('correct company name, but already exists. The new name is equal to the initial company name', async () => {
    const res = await validateCompanyName('Carrier', 'Carrier');
    expect(res).toEqual(undefined);
  });
});
