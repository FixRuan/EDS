describe('Cadastrar Pedido (com dados reais)', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'admin',
      senha: 'admin',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('usuario', JSON.stringify(res.body.funcionario));
    });

    cy.intercept('GET', '**/clientes/selecionar').as('getClientes');
    cy.intercept('GET', '**/produtos').as('getProdutos');

    cy.visit('/pedidos/cadastrar');

    cy.wait('@getClientes');
    cy.wait('@getProdutos');
  });

  it('Deve cadastrar um pedido com sucesso', () => {
    cy.get('select[name="idCliente"]').select(1);

    cy.get('select[name="formaPagamento"]').select('pix');
    cy.get('select[name="status"]').select('pronto');
    cy.get('textarea[name="observacoes"]').type(`Teste pedido ${Date.now()}`);

    cy.get('input[type="checkbox"]').first().check({ force: true });
    cy.get('input[type="number"]').first().clear(); // Quantidade = 1

    cy.get('[data-cy=botao-cadastrar-pedido]').click();

    cy.on('window:alert', (msg) => {
      expect(msg).to.contain('Pedido criado com sucesso');
    });
  });
});
