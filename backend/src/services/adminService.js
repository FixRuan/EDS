import db from '../models/db.js';

// Obtem o faturamento do periodo X
export async function calcularFaturamentoPeriodo(inicio, fim) {
  const [rows] = await db.query(
    `
    SELECT 
      DATE(dataHora) AS data, 
      SUM(PP.quantidade * PR.preco) AS faturamento
    FROM Pedido P
    JOIN Pedido_Produto PP ON P.idPedido = PP.idPedido
    JOIN Produto PR ON PP.idProduto = PR.idProduto
    WHERE P.dataHora BETWEEN ? AND ?
      AND P.status NOT IN ('cancelado', 'pendente')
    GROUP BY DATE(P.dataHora)
    ORDER BY data ASC
    `,
    [inicio, fim]
  );

  const total = rows.reduce((acc, curr) => acc + (curr.faturamento || 0), 0);

  return total;
}

// Obtem os itens mais vendidos no período X
export async function calcularItensMaisVendidos(inicio, fim) {
  const query = `
    SELECT 
      PR.nome, 
      SUM(PP.quantidade) AS totalVendido
    FROM Pedido_Produto PP
    JOIN Produto PR ON PP.idProduto = PR.idProduto
    JOIN Pedido P ON PP.idPedido = P.idPedido
    WHERE P.dataHora BETWEEN ? AND ?
      AND P.status NOT IN ('cancelado', 'pendente')
    GROUP BY PR.nome
    ORDER BY totalVendido DESC
    LIMIT 5;
  `;
  const [rows] = await db.query(query, [inicio, fim]);
  return rows;
}