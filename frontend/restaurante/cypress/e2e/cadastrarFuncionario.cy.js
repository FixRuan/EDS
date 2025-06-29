describe('Validação do formulário de cadastro de funcionário', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'admin',
      senha: 'admin',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('usuario', JSON.stringify(res.body.funcionario));
    });

    cy.visit('/funcionarios/cadastrar');
  });

  it('Deve exibir erros se tentar enviar com campos vazios', () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[name="nome"]')
      .then(($input) => expect($input[0].validationMessage).to.exist);

    cy.get('input[name="funcao"]')
      .then(($input) => expect($input[0].validationMessage).to.exist);

    cy.get('input[name="horarioTrabalho"]')
      .then(($input) => expect($input[0].validationMessage).to.exist);

    cy.get('input[name="login"]')
      .then(($input) => expect($input[0].validationMessage).to.exist);

    cy.get('input[name="senha"]')
      .then(($input) => expect($input[0].validationMessage).to.exist);
  });
});

describe('Cadastrar Funcionário', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      login: 'admin',
      senha: 'admin',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('usuario', JSON.stringify(res.body.funcionario));
    });

    cy.visit('/funcionarios/cadastrar');
  });

  it('Cadastra um novo funcionário com login único', () => {
    const timestamp = Date.now();

    cy.get('input[name="nome"]').clear().type(`Funcionario ${timestamp}`);
    cy.get('input[name="funcao"]').clear().type('garcom');
    cy.get('input[name="horarioTrabalho"]').clear().type('08:00-17:00');
    cy.get('input[name="login"]').clear().type(`funcionario.teste.${timestamp}`);
    cy.get('input[name="senha"]').clear().type('123456');

    cy.get('button[type="submit"]').click();

    cy.contains('Funcionário cadastrado com sucesso!').should('be.visible');

    cy.get('input[name="nome"]').should('have.value', '');
    cy.get('input[name="funcao"]').should('have.value', '');
    cy.get('input[name="horarioTrabalho"]').should('have.value', '');
    cy.get('input[name="login"]').should('have.value', '');
    cy.get('input[name="senha"]').should('have.value', '');
  });
});
