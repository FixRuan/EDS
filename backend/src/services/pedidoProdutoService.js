import db from '../models/db.js';

export async function associateProdutoToPedido(idPedido, idProduto, quantidade = 1) {
  await db.query(
    'UPDATE Produto SET quantidadeEstoque = quantidadeEstoque - ? WHERE idProduto = ? AND quantidadeEstoque >= ?',
    [quantidade, idProduto, quantidade]
  );

  await db.query(
    'INSERT INTO Pedido_Produto (idPedido, idProduto, quantidade) VALUES (?, ?, ?)',
    [idPedido, idProduto, quantidade]
  );

  return { idPedido, idProduto, quantidade };
}

export async function disassociateProdutoFromPedido(idPedido, idProduto) {
  const [[{ quantidade }]] = await db.query(
    'SELECT quantidade FROM Pedido_Produto WHERE idPedido = ? AND idProduto = ?',
    [idPedido, idProduto]
  );

  await db.query(
    'DELETE FROM Pedido_Produto WHERE idPedido = ? AND idProduto = ?',
    [idPedido, idProduto]
  );

  await db.query(
    'UPDATE Produto SET quantidadeEstoque = quantidadeEstoque + ? WHERE idProduto = ?',
    [quantidade, idProduto]
  );

  return { idPedido, idProduto, message: 'Associação excluída com sucesso' };
}

export async function getProdutosByPedidoId(idPedido) {
  const [rows] = await db.query(
    `SELECT p.idProduto, p.nome, p.descricao, p.preco, p.categoria, p.disponivel, pp.quantidade
     FROM Produto p
     JOIN Pedido_Produto pp ON p.idProduto = pp.idProduto
     WHERE pp.idPedido = ?`,
    [idPedido]
  );
  return rows;
}

export async function getPedidosByProdutoId(idProduto) {
  const [rows] = await db.query(
    `SELECT pe.idPedido, pe.idCliente, pe.idFuncionario, pe.dataHora, pe.formaPagamento, pe.observacoes, pe.status
     FROM Pedido pe
     JOIN Pedido_Produto pp ON pe.idPedido = pp.idPedido
     WHERE pp.idProduto = ?`,
    [idProduto]
  );
  return rows;
}

export async function updateQuantidadeProdutoDoPedido(idPedido, idProduto, novaQuantidade) {
  const [[{ quantidade: quantidadeAtual }]] = await db.query(
    'SELECT quantidade FROM Pedido_Produto WHERE idPedido = ? AND idProduto = ?',
    [idPedido, idProduto]
  );

  if (quantidadeAtual === undefined) {
    throw new Error('Associação não encontrada');
  }

  const diferenca = novaQuantidade - quantidadeAtual;

  const [produtoRows] = await db.query(
    'SELECT quantidadeEstoque FROM Produto WHERE idProduto = ?',
    [idProduto]
  );
  const { quantidadeEstoque } = produtoRows[0];

  if (diferenca > 0 && quantidadeEstoque < diferenca) {
    throw new Error('Estoque insuficiente');
  }

  await db.query(
    'UPDATE Produto SET quantidadeEstoque = quantidadeEstoque - ? WHERE idProduto = ?',
    [diferenca, idProduto]
  );

  await db.query(
    'UPDATE Pedido_Produto SET quantidade = ? WHERE idPedido = ? AND idProduto = ?',
    [novaQuantidade, idPedido, idProduto]
  );

  return { idPedido, idProduto, quantidade: novaQuantidade };
}
