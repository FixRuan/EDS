describe('Tela de Login - Testes com dados reais', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Exibe alerta se ambos os campos estiverem vazios', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alerta');
    });

    cy.get('button[type="submit"]').click();

    cy.get('@alerta').should('have.been.calledWith', 'Preencha login e senha');
  });

  it('Exibe alerta se o campo de login estiver vazio', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alerta');
    });

    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    cy.get('@alerta').should('have.been.calledWith', 'Preencha login e senha');
  });

  it('Exibe alerta se o campo de senha estiver vazio', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alerta');
    });

    cy.get('input[name="email"]').type('admin');
    cy.get('button[type="submit"]').click();

    cy.get('@alerta').should('have.been.calledWith', 'Preencha login e senha');
  });

  it('Login com ADMIN (admin/admin) redireciona para /dashboard', () => {
    cy.get('input[name="email"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
  });

  it('Login com GARÇOM (garcom/123456) redireciona para /garcom/dashboard', () => {
    cy.get('input[name="email"]').type('garcom');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/garcom/dashboard');
  });

  it('Login com CAIXA (caixa/123456) redireciona para /caixa/dashboard', () => {
    cy.get('input[name="email"]').type('caixa');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/caixa/dashboard');
  });

  it('Login com credenciais inválidas exibe alerta', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alerta');
    });

    cy.get('input[name="email"]').type('invalido');
    cy.get('input[name="password"]').type('errado');
    cy.get('button[type="submit"]').click();

    cy.get('@alerta').should('have.been.calledWith', 'Login ou senha inválidos.');
  });
});
