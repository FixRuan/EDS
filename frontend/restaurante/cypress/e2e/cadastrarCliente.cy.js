describe('Cadastro de Cliente (com autenticação)', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'admin',
      senha: 'admin',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('usuario', JSON.stringify(res.body.funcionario));
    });

    cy.visit('/clientes/cadastrar');
  });

  it('Cadastra cliente com sucesso', () => {
    const nome = `Cliente Teste ${Date.now()}`;
    const telefone = `1199${Math.floor(Math.random() * 10000000)}`;
    const endereco = 'Rua Cypress Teste';

    cy.get('input[name="nome"]').type(nome);
    cy.get('input[name="telefone"]').type(telefone);
    cy.get('input[name="endereco"]').type(endereco);

    cy.get('button[type="submit"]').click();

    cy.contains('Cliente cadastrado com sucesso!').should('be.visible');

    cy.get('input[name="nome"]').should('have.value', '');
    cy.get('input[name="telefone"]').should('have.value', '');
    cy.get('input[name="endereco"]').should('have.value', '');
  });
});
