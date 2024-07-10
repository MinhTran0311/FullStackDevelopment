describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Testing User',
      username: 'testuser',
      password: '123test',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('/')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('Login', function () {
    it('Succeeds with correct credentials', function () {
      cy.contains('Log in to application').click()
      cy.get('#username').type('testuser')
      cy.get('#password').type('123test')
      cy.get('#login-button').click()
      cy.contains('Testing User logged in')
    })

    it('Fails with wrong credentials', function () {
      cy.contains('Log in to application').click()
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('#noti')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Testing User logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testuser', password: '123test' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('input[placeholder="title"]').type('Test blog')
      cy.get('input[placeholder="author"]').type('Author Name')
      cy.get('input[placeholder="url"]').type('http://newblog.com')
      cy.contains('save').click()

      cy.contains('a new blog Test blog by Author Name added')
    })

    describe('and a blog exits', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Test blog',
          author: 'Test author',
          url: 'Test url',
        })
      })

      it('A blog can be liked', function () {
        cy.contains('Test blog Test author').contains('view').click()
        cy.contains('Test blog').parent().contains('like').click()
        cy.contains('Test blog').parent().contains('likes: 1')
      })

      it('The user who created a blog can delete it', function () {
        cy.contains('Test blog Test author').contains('view').click()
        cy.contains('Test blog').parent().contains('remove').click()
        cy.get('html').should('not.contain', 'Test blog Test author')
      })

      it('Other users cannot see the delete button', function () {
        cy.get('#logout-button').click()

        const newUser = {
          name: 'Another User',
          username: 'anotheruser',
          password: 'anotherpassword',
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users/`, newUser)
        cy.login({ username: 'anotheruser', password: 'anotherpassword' })

        cy.contains('Test blog Test author').contains('view').click()
        cy.contains('Test blog').parent().should('not.contain', 'remove')
      })
    })

    it('Blogs are ordered by likes', function () {
      cy.createBlog({
        title: 'First blog',
        author: 'Author 1',
        url: 'http://firstblog.com',
      })
      cy.createBlog({
        title: 'Second blog',
        author: 'Author 2',
        url: 'http://secondblog.com',
      })
      cy.createBlog({
        title: 'Third blog',
        author: 'Author 3',
        url: 'http://thirdblog.com',
      })

      cy.get('.blog').eq(0).should('contain', 'First blog Author 1')
      cy.get('.blog').eq(1).should('contain', 'Second blog Author 2')
      cy.get('.blog').eq(2).should('contain', 'Third blog Author 3')

      cy.likeBlog({
        title: 'Second blog',
        author: 'Author 2',
        expectedLikes: '1',
      })

      cy.likeBlog({
        title: 'Second blog',
        author: 'Author 2',
        expectedLikes: '2',
      })
      cy.likeBlog({
        title: 'Second blog',
        author: 'Author 2',
        expectedLikes: '3',
      })
      cy.likeBlog({
        title: 'Third blog',
        author: 'Author 3',
        expectedLikes: '1',
      })

      cy.get('.blog').eq(0).should('contain', 'Second blog Author 2')
      cy.get('.blog').eq(1).should('contain', 'Third blog Author 3')
      cy.get('.blog').eq(2).should('contain', 'First blog Author 1')
    })
  })
})
