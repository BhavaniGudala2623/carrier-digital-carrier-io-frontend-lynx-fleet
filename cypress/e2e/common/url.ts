import {
  Given,
  When,
  But,
  And,
  Then,
} from "cypress-cucumber-preprocessor/steps";

Then("the url is {word}", (url) => {
  cy.url()
    .should("eq", `${Cypress.config().baseUrl}${url}`)
});

And("I refresh the page", () => {
  cy.reload()
});

When("I go to {word}", (path) => {
  cy.visit(path)
});
