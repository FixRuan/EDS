CREATE DATABASE restaurante;
USE restaurante;

CREATE TABLE Produto (
    idProduto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    preco FLOAT,
    categoria ENUM('lanche', 'porcao', 'bebida'),
    disponivel BOOLEAN,
    quantidadeEstoque INT DEFAULT 0
);

CREATE TABLE Funcionario (
    idFuncionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    funcao ENUM('caixa', 'garcom', 'administrador'),
    horarioTrabalho VARCHAR(50),
    login VARCHAR(50) UNIQUE,
    senha VARCHAR(255)
);

CREATE TABLE Cliente (
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    telefone VARCHAR(20),
    endereco TEXT
);

CREATE TABLE Pedido (
    idPedido INT PRIMARY KEY AUTO_INCREMENT,
    idCliente INT,
    idFuncionario INT,
    dataHora DATETIME,
    formaPagamento ENUM('dinheiro', 'pix', 'cartao'),
    observacoes TEXT,
    status ENUM('preparando', 'pronto', 'entregue', 'cancelado'),
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente),
    FOREIGN KEY (idFuncionario) REFERENCES Funcionario(idFuncionario)
);

CREATE TABLE Pedido_Produto (
    idPedidoProduto INT PRIMARY KEY AUTO_INCREMENT,
    idPedido INT,
    idProduto INT,
    quantidade INT DEFAULT 1,
    FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido),
    FOREIGN KEY (idProduto) REFERENCES Produto(idProduto)
);
