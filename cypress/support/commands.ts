// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("loginWith", ({ email, password }) =>
  cy.visit("/auth/login")
    .get("input[id=username]")
      .type(email)
    .get("input[id=password]")
      .type(password)
    .get("button")
      .click()
);

Cypress.Commands.add("buttonHasTooltip", ({ title, tooltip }) =>
  cy
    .get(`[title="${title}"]`).as("button")
      .trigger('mouseover')
    .wait(100)
    .get(`[role="tooltip"]`)
      .contains(tooltip)
    .get(`@button`)
      .trigger('mouseout')
);
