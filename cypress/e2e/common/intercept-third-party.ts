beforeEach(() => {
  cy.intercept('POST', `https://api-iam.intercom.io/messenger/web/ping`, (req) => {
    req.reply()
  })

  cy.intercept('GET', `https://heapanalytics.com/h`, (req) => {
    req.reply({ fixture: 'pixel.gif' })
  })

  cy.intercept('POST', `https://api-iam.intercom.io/**`, (req) => {
    req.reply({})
  })
})
