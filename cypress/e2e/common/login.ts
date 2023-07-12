import { Given, When, But, And, Then } from 'cypress-cucumber-preprocessor/steps';

When('I log in', () => {
  cy.loginWith({
    email: '.env.TODO',
    password: '.env.TODO',
  });
});

Then("I'm logged in", () => {
  cy.contains('Hi,');
});

Then("I'm not logged in", () => {
  cy.get('body').find('input[type=password]').should('have.length', 1);
});

When('I switch language to {string}', (string) => {
  const languageSwitcher = cy.get('body').find('div[role="button"]');
  languageSwitcher.click();
  cy.get('span').contains(string).click();
});

Then('I see {string} on the page', (string) => {
  cy.contains(string);
});
