describe('Listar Funcionários', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'admin',
      senha: 'admin',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('usuario', JSON.stringify(res.body.funcionario));
    });

    cy.visit('/funcionarios/listar');
  });

  it('Deve carregar a lista de funcionários (exceto administradores)', () => {
    cy.get('table').should('be.visible');
    cy.get('tbody tr').its('length').should('be.gte', 1);

    cy.get('tbody tr').then(($rows) => {
      const funcoes = [];
      $rows.each((_, row) => {
        const funcao = Cypress.$(row).find('td').eq(2).text().toLowerCase();
        funcoes.push(funcao);
      });
      funcoes.forEach((funcao) => {
        expect(funcao).not.to.eq('administrador');
      });
    });
  });

  it('Deve permitir editar e salvar um funcionário (último da lista)', () => {
    cy.get('tbody tr').last().as('ultimaLinha');

    const novoNome = `Teste Edit ${Date.now()}`;
    cy.get('@ultimaLinha').contains('Editar').click();
    cy.get('@ultimaLinha').find('input[name="nome"]').clear().type(novoNome);
    cy.get('@ultimaLinha').contains('Salvar').click();
    cy.get('@ultimaLinha').find('td').eq(1).should('contain.text', novoNome);
  });

  it('Deve permitir cancelar a edição (último da lista)', () => {
    cy.get('tbody tr').last().as('ultimaLinha');

    cy.get('@ultimaLinha').contains('Editar').click();
    cy.get('@ultimaLinha').find('input[name="nome"]').clear().type('Temporário');
    cy.get('@ultimaLinha').contains('Cancelar').click();

    cy.get('@ultimaLinha').find('input[name="nome"]').should('not.exist');
  });

  it('Deve permitir remover um funcionário (último da lista)', () => {
    cy.get('tbody tr').last().as('ultimaLinha');

    cy.get('@ultimaLinha').find('td').eq(1).invoke('text').then((nomeFuncionario) => {
      cy.get('@ultimaLinha').contains('Remover').click();
      cy.on('window:confirm', () => true);
      cy.contains(nomeFuncionario).should('not.exist');
    });
  });
});
