describe('Visuals', () => {
    it('should compare screenshot of the entire page', () => {
      cy.visit('')
      cy.compareSnapshot('home-page')
    })
  })