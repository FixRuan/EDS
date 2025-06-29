describe('Cadastrar Produto (com dados reais)', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'admin',
      senha: 'admin',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('usuario', JSON.stringify(res.body.funcionario));
    });

    cy.visit('/produtos/cadastrar');
  });

  it('Deve cadastrar um produto com sucesso', () => {
    const nomeUnico = `Produto ${Date.now()}`;

    cy.get('input[name="nome"]').type(nomeUnico);
    cy.get('input[name="descricao"]').type('Um produto de teste.');
    cy.get('input[name="preco"]').type('9.99');
    cy.get('input[name="quantidadeEstoque"]').type('10');
    cy.get('select[name="categoria"]').select('bebida');
    cy.get('input[name="disponivel"]').check();

    cy.get('button[type="submit"]').click();

    cy.contains('Produto cadastrado com sucesso!').should('be.visible');

    cy.get('input[name="nome"]').should('have.value', '');
    cy.get('input[name="descricao"]').should('have.value', '');
    cy.get('input[name="preco"]').should('have.value', '');
    cy.get('input[name="quantidadeEstoque"]').should('have.value', '');
    cy.get('select[name="categoria"]').should('have.value', 'lanche');
    cy.get('input[name="disponivel"]').should('be.checked');
  });
});
