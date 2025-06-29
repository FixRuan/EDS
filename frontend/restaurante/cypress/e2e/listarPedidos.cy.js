describe('Listar Pedidos', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'admin',
      senha: 'admin',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('usuario', JSON.stringify(res.body.funcionario));
    });

    cy.intercept('GET', '**/pedidos').as('getPedidos');
    cy.intercept('GET', '**/clientes/selecionar').as('getClientes');
    cy.intercept('GET', '**/funcionarios/selecionar').as('getFuncionarios');
    cy.intercept('GET', '**/pedido-produto/pedidos/*/produtos').as('getProdutosDoPedido');
    cy.intercept('GET', '**/produtos').as('getProdutosDisponiveis');
    cy.intercept('PUT', '**/pedidos/*').as('putPedido');
    cy.intercept('PUT', '**/pedido-produto/*/*').as('putPedidoProduto');
    cy.intercept('POST', '**/pedido-produto').as('postPedidoProduto');
    cy.intercept('DELETE', '**/pedido-produto/*/*').as('deletePedidoProduto');

    cy.visit('/pedidos/listar');

    cy.wait('@getPedidos');
    cy.wait('@getClientes');
    cy.wait('@getFuncionarios');
    cy.wait('@getProdutosDisponiveis');
  });

  it('Deve exibir lista de pedidos após carregamento', () => {
    cy.get('h1').should('contain.text', 'Listar Pedidos');
    cy.get('p').should('not.contain', 'Carregando pedidos...');
    cy.get('[data-testid="pedido-card"]').should('have.length.greaterThan', 0);
  });

  it('Deve abrir modo de edição de um pedido', () => {
    cy.get('[data-testid="pedido-card"]').first().within(() => {
      cy.contains('Editar').click();
    });

    cy.get('select[name="status"]').should('exist');
    cy.get('select[name="formaPagamento"]').should('exist');
    cy.get('textarea').should('exist');
    cy.get('input[type="checkbox"]').should('exist');
  });

  it('Deve editar e salvar um pedido', () => {
    cy.get('[data-testid="pedido-card"]').first().within(() => {
      cy.contains('Editar').click();

      cy.get('select[name="status"]').select('entregue');
      cy.get('select[name="formaPagamento"]').select('pix');
      cy.get('textarea').clear().type('Observação alterada pelo teste');
      cy.get('input[type="checkbox"]').first().check({ force: true });
      cy.get('input[type="number"]').first().clear({ force: true }); // selecionar quantidade em 1
      cy.contains('Salvar').click();
    });

    cy.wait('@putPedido').its('response.statusCode').should('eq', 200);
    cy.wait(1000);

    cy.get('@putPedidoProduto.all').then((requests) => {
      requests.forEach((req) => {
        expect(req.response.statusCode).to.eq(200);
      });
    });

    cy.get('@postPedidoProduto.all').then((requests) => {
      requests.forEach((req) => {
        expect(req.response.statusCode).to.eq(200);
      });
    });

    cy.get('@deletePedidoProduto.all').then((requests) => {
      requests.forEach((req) => {
        expect(req.response.statusCode).to.eq(200);
      });
    });

    cy.get('[data-testid="pedido-card"]').first().within(() => {
      cy.contains('Editar').should('exist');
      cy.contains('Salvar').should('not.exist');
    });
  });

  it('Deve cancelar a edição do pedido', () => {
    cy.get('[data-testid="pedido-card"]').first().within(() => {
      cy.contains('Editar').click();
      cy.contains('Cancelar').click();
      cy.contains('Editar').should('exist');
      cy.get('select[name="status"]').should('not.exist');
    });
  });
});
