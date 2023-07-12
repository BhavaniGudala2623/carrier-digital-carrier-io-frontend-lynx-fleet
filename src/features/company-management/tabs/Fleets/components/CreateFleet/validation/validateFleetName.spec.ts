import { checkFleetNameUniqueDebounced } from '../checkFleetNameUniqueDebounced';

import { validateFleetName } from './validateFleetName';

jest.mock('../checkFleetNameUniqueDebounced', () => ({
  checkFleetNameUniqueDebounced: jest.fn().mockImplementation((name: string) =>
    Promise.resolve({
      result: name === 'unique',
      error: name === 'unique' ? null : 'Error',
    })
  ),
}));

describe('validateFleetName', () => {
  const company = {
    type: 'COMPANY',
    value: { id: '2222', name: 'Target Company' },
    children: [],
  };

  it('Empty fleet name', async () => {
    const response = await validateFleetName('', company.value.id);
    expect(response).toEqual('company.management.validation.error.fleet-name-required');
  });

  it('Incorrect fleet name', async () => {
    const response = await validateFleetName('./', company.value.id);
    expect(response).toEqual('company.management.validation.error.fleet-name-matches');
  });

  it('Correct fleet name, but already exists', async () => {
    const res = await validateFleetName('not-unique1', company.value.id);
    expect(res).toEqual('company.management.validation.error.fleet-name-exist');
  });

  it('Correct fleet name, does not exist', async () => {
    const res = await validateFleetName('unique', company.value.id);
    expect(res).toEqual('');
  });

  it('Correct fleet name, tenantId is not passed', async () => {
    const res = await validateFleetName('unique');
    expect(res).toEqual('');
  });

  it('checkFleetNameUniqueDebounced unique name', async () => {
    const res = await checkFleetNameUniqueDebounced('unique', '123');
    expect(res).toEqual({ result: true, error: null });
  });

  it('checkFleetNameUniqueDebounced non-unique name', async () => {
    const res = await checkFleetNameUniqueDebounced('non-unique', '123');
    expect(res).toEqual({ result: false, error: 'Error' });
  });
});
