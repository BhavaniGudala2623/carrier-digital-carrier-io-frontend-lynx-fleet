import { validateEmailUser } from './validateEmailUser';

jest.mock('./createUserEmailValidation', () => ({
  checkEmailAvailabilityDebounced: jest.fn().mockResolvedValue(Promise.resolve(true)),
}));

describe('validateEmailUser', () => {
  const invalidEmailMessage = 'error.enter-valid-email';

  it('empty string', async () => {
    const res = await validateEmailUser('');
    expect(res).toEqual(invalidEmailMessage);
  });

  it('correct email', async () => {
    const res = await validateEmailUser('user@gmail.com');
    expect(res).toEqual('');
  });

  it('incorrect email', async () => {
    const res = await validateEmailUser('usergmail.c');
    expect(res).toEqual(invalidEmailMessage);
  });
});
