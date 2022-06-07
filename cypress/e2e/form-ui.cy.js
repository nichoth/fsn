/// <reference types="cypress" />

describe('the password reset form', () => {
  // beforeEach(() => {
  //   // Cypress starts out with a blank slate for each test
  //   // so we must tell it to visit our website with the `cy.visit()` command.
  //   // Since we want to visit the same URL at the start of all our tests,
  //   // we include it in our beforeEach function so that it runs before each test
  //   cy.visit('http://localhost:3000/')
  // })

  it('displays correct initial state', () => {
    cy.visit('http://localhost:3000/')

    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert
    cy.get('form button').should('be.disabled')

    cy.get('ul.form-instructions li').each(el => {
        expect(el).to.contain('🔘')
    })
  })

  it('shows valid passwords are valid', () => {
    cy.get('#password').type('aaBB1!')
    cy.get('#passwordVerify').type('aaBB1!')

    cy.get('ul.form-instructions li').each(el => {
        expect(el).to.contain('✅')
    })
  })

  it('enables the button if input is valid', () => {
    cy.get('form button').should('not.be.disabled')
  })
})
