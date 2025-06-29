describe('Listar Clientes (com backend real)', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'admin',
      senha: 'admin',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('usuario', JSON.stringify(res.body.funcionario));
    });

    cy.visit('/clientes/listar');
  });

  it('Exibe a lista real de clientes', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);

    cy.get('table thead').within(() => {
      cy.contains('Nome');
      cy.contains('Telefone');
      cy.contains('Endereço');
      cy.contains('Ações');
    });
  });

  it('Permite editar um cliente', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Editar').click();

      cy.get('input[name="nome"]').clear().type('Nome Editado Teste');
      cy.contains('Salvar').click();
    });

    cy.contains('Nome Editado Teste').should('exist');
  });

  it('Permite cancelar a edição', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Editar').click();
      cy.get('input[name="nome"]').should('exist');
      cy.contains('Cancelar').click();
    });

    cy.contains('Editar').should('exist');
  });

  it('Permite excluir um cliente após confirmação', () => {
    cy.on('window:confirm', () => true);

    cy.get('table tbody tr').last().find('td').first().invoke('text').then((nomeCliente) => {
      cy.get('table tbody tr').last().contains('Excluir').click();
      cy.contains(nomeCliente).should('not.exist');
    });
  });
});
