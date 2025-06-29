describe('Listar Produtos', () => {
  let nomeEditado = '';

  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'admin',
      senha: 'admin',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('usuario', JSON.stringify(res.body.funcionario));
    });

    cy.visit('/produtos/listar');
  });

  it('Deve carregar a lista de produtos corretamente', () => {
    cy.get('table').should('be.visible');

    cy.get('tbody tr').its('length').should('be.gte', 1);

    cy.get('tbody tr').last().within(() => {
      cy.get('td').eq(1).should('not.be.empty');
      cy.get('td').eq(2).should('not.be.empty');
      cy.get('td').eq(3).should('contain.text', 'R$');
    });
  });

  it('Deve permitir editar e salvar um produto', () => {
    nomeEditado = `Produto Editado ${Date.now()}`;

    cy.get('tbody tr').last().as('ultimaLinha');
    cy.get('@ultimaLinha').contains('Editar').click();
    cy.get('@ultimaLinha').find('input[name="nome"]').clear().type(nomeEditado);
    cy.get('@ultimaLinha').find('input[name="preco"]').clear().type('19.99');
    cy.get('@ultimaLinha').contains('Salvar').click();

    cy.get('@ultimaLinha').find('td').eq(1).should('contain.text', nomeEditado);
    cy.get('@ultimaLinha').find('td').eq(3).should('contain.text', '19.99');
  });

  it('Deve permitir cancelar a edição', () => {
    cy.get('tbody tr').last().as('ultimaLinha');

    cy.get('@ultimaLinha').find('td').eq(1).invoke('text').then((nomeOriginal) => {
      cy.get('@ultimaLinha').contains('Editar').click();
      cy.get('@ultimaLinha').find('input[name="nome"]').clear().type('Teste Temporário');
      cy.get('@ultimaLinha').contains('Cancelar').click();

      cy.get('@ultimaLinha').find('td').eq(1).should('contain.text', nomeOriginal);
    });
  });

  it('Deve permitir excluir o produto recém-editado', () => {
    cy.contains(nomeEditado).parents('tr').as('linhaProduto');

    cy.get('@linhaProduto').contains('Excluir').click();
    cy.on('window:confirm', () => true);

    cy.contains(nomeEditado).should('not.exist');
  });
});
