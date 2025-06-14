/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../services/api";

function ListarPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoPedidoId, setEditandoPedidoId] = useState<number | null>(null);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<any[]>([]);
  const [formEdicao, setFormEdicao] = useState({
    status: "",
    formaPagamento: "",
    observacoes: "",
    produtos: [] as { idProduto: number; nome: string; preco: number; quantidade: number }[],
  });

  const funcionarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");
  const isCaixa = funcionarioLogado?.funcao === "caixa";

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const [resPedidos, resClientes, resFuncionarios] = await Promise.all([
          api.get("/pedidos"),
          api.get("/clientes/selecionar"),
          api.get("/funcionarios/selecionar"),
        ]);

        const pedidosArray = Array.isArray(resPedidos.data)
          ? resPedidos.data
          : resPedidos.data.pedidos;

        const clientesMap = new Map(resClientes.data.map((c: any) => [c.id, c.nome]));
        const funcionariosMap = new Map(resFuncionarios.data.map((f: any) => [f.id, f.nome]));

        const pedidosComRelacionamentos = await Promise.all(
          pedidosArray.map(async (pedido: any) => {
            try {
              const produtosRes = await api.get(
                `/pedido-produto/pedidos/${pedido.idPedido}/produtos`
              );

              const produtosDetalhados = await Promise.all(
                (Array.isArray(produtosRes.data) ? produtosRes.data : []).map((pp: any) =>
                  api
                    .get(`/produtos/${pp.idProduto}`)
                    .then((res) => ({
                      ...res.data,
                      quantidade: pp.quantidade || 1,
                    }))
                    .catch(() => null)
                )
              );

              return {
                ...pedido,
                cliente: clientesMap.get(pedido.idCliente) || `ID: ${pedido.idCliente}`,
                funcionario:
                  funcionariosMap.get(pedido.idFuncionario) || `ID: ${pedido.idFuncionario}`,
                produtos: produtosDetalhados.filter(Boolean),
              };
            } catch {
              return {
                ...pedido,
                cliente: `Erro cliente ${pedido.idCliente}`,
                funcionario: `Erro funcionario ${pedido.idFuncionario}`,
                produtos: [],
              };
            }
          })
        );

        setPedidos(pedidosComRelacionamentos);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchProdutosDisponiveis() {
      try {
        const res = await api.get("/produtos");
        setProdutosDisponiveis(res.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchPedidos();
    fetchProdutosDisponiveis();
  }, []);

  const handleEditar = (pedido: any) => {
    setEditandoPedidoId(pedido.idPedido);
    setFormEdicao({
      status: pedido.status,
      formaPagamento: pedido.formaPagamento,
      observacoes: pedido.observacoes || "",
      produtos: pedido.produtos.map((p: any) => ({
        idProduto: p.idProduto,
        nome: p.nome,
        preco: p.preco,
        quantidade: p.quantidade || 1,
      })),
    });
  };

  const handleSalvar = async (idPedido: number) => {
    try {
      const pedidoOriginal = pedidos.find((p) => p.idPedido === idPedido);
      if (!pedidoOriginal) return;

      await api.put(`/pedidos/${idPedido}`, {
        status: formEdicao.status,
        formaPagamento: formEdicao.formaPagamento,
        observacoes: formEdicao.observacoes,
        idCliente: pedidoOriginal.idCliente,
        idFuncionario: pedidoOriginal.idFuncionario,
      });

      const produtosAntigos = pedidoOriginal.produtos;
      const produtosNovos = formEdicao.produtos;

      const idsAntigos = produtosAntigos.map((p: any) => p.idProduto);
      const idsNovos = produtosNovos.map((p: any) => p.idProduto);

      const removidos = idsAntigos.filter((id: number) => !idsNovos.includes(id));
      for (const idProduto of removidos) {
        await api.delete(`/pedido-produto/${idPedido}/${idProduto}`);
      }

      for (const produtoNovo of produtosNovos) {
        const existente = produtosAntigos.find((p: any) => p.idProduto === produtoNovo.idProduto);
        if (existente) {
          if (existente.quantidade !== produtoNovo.quantidade) {
            await api.put(`/pedido-produto/${idPedido}/${produtoNovo.idProduto}`, {
              quantidade: produtoNovo.quantidade,
            });
          }
        } else {
          await api.post("/pedido-produto", {
            idPedido,
            idProduto: produtoNovo.idProduto,
            quantidade: produtoNovo.quantidade,
          });
        }
      }

      setPedidos((prev) =>
        prev.map((p) =>
          p.idPedido === idPedido
            ? {
                ...p,
                ...formEdicao,
              }
            : p
        )
      );

      setEditandoPedidoId(null);
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
    }
  };

  const toggleProduto = (produto: any) => {
    setFormEdicao((prev) => {
      const existente = prev.produtos.find((p) => p.idProduto === produto.idProduto);
      if (existente) {
        return {
          ...prev,
          produtos: prev.produtos.filter((p) => p.idProduto !== produto.idProduto),
        };
      } else {
        return {
          ...prev,
          produtos: [...prev.produtos, { ...produto, quantidade: 1 }],
        };
      }
    });
  };

  const alterarQuantidade = (idProduto: number, quantidade: number) => {
    setFormEdicao((prev) => ({
      ...prev,
      produtos: prev.produtos.map((p) =>
        p.idProduto === idProduto ? { ...p, quantidade: Math.max(1, quantidade) } : p
      ),
    }));
  };

  return (
    <div className="w-full h-full bg-[#18191A]">
      <div className="p-8 max-w-5xl mx-auto text-gray-100 bg-[#18191A]">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Listar Pedidos</h1>

        {loading ? (
          <p className="text-center text-gray-400">Carregando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p className="text-center text-gray-400">Nenhum pedido encontrado.</p>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div key={pedido.idPedido} className="bg-[#242526] p-4 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-yellow-300">
                    Pedido #{pedido.idPedido}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pedido.status === "preparando"
                        ? "bg-yellow-500 text-black"
                        : pedido.status === "pronto"
                        ? "bg-green-500 text-black"
                        : pedido.status === "entregue"
                        ? "bg-blue-500 text-white"
                        : pedido.status === "finalizado"
                        ? "bg-purple-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {pedido.status}
                  </span>
                </div>

                <p><strong>Cliente:</strong> {pedido.cliente}</p>
                <p><strong>Funcionário:</strong> {pedido.funcionario}</p>

                {editandoPedidoId === pedido.idPedido ? (
                  <div className="mt-4 space-y-2">
                    <label className="block">
                      Status:
                      <select
                        className="bg-[#3A3B3C] text-white px-2 py-1 rounded ml-2"
                        value={formEdicao.status}
                        onChange={(e) =>
                          setFormEdicao({ ...formEdicao, status: e.target.value })
                        }
                      >
                        <option value="preparando">Preparando</option>
                        <option value="pronto">Pronto</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                        {isCaixa && <option value="finalizado">Finalizado</option>}
                      </select>
                    </label>

                    <label className="block">
                      Forma de Pagamento:
                      <select
                        className="bg-[#3A3B3C] text-white px-2 py-1 rounded ml-2"
                        value={formEdicao.formaPagamento}
                        onChange={(e) =>
                          setFormEdicao({ ...formEdicao, formaPagamento: e.target.value })
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pix">Pix</option>
                        <option value="cartao">Cartão</option>
                      </select>
                    </label>

                    <label className="block">
                      Observações:
                      <textarea
                        className="bg-[#3A3B3C] text-white px-2 py-1 rounded w-full"
                        value={formEdicao.observacoes}
                        onChange={(e) =>
                          setFormEdicao({ ...formEdicao, observacoes: e.target.value })
                        }
                      />
                    </label>

                    <div>
                      <p className="font-medium mb-1">Produtos do Pedido:</p>
                      {produtosDisponiveis.map((prod) => (
                        <div key={prod.idProduto} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formEdicao.produtos.some(
                              (p) => p.idProduto === prod.idProduto
                            )}
                            onChange={() => toggleProduto(prod)}
                          />
                          <span>{prod.nome} - R$ {prod.preco?.toFixed(2)}</span>
                          {formEdicao.produtos.some((p) => p.idProduto === prod.idProduto) && (
                            <input
                              type="number"
                              className="w-16 bg-[#3A3B3C] text-white px-1 py-0.5 rounded"
                              value={
                                formEdicao.produtos.find(
                                  (p) => p.idProduto === prod.idProduto
                                )?.quantidade || 1
                              }
                              min={1}
                              onChange={(e) =>
                                alterarQuantidade(prod.idProduto, Number(e.target.value))
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSalvar(pedido.idPedido)}
                        className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditandoPedidoId(null)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p><strong>Forma de Pagamento:</strong> {pedido.formaPagamento}</p>
                    {pedido.observacoes && (
                      <p><strong>Observações:</strong> {pedido.observacoes}</p>
                    )}
                    <div className="mt-4">
                      <p className="font-medium mb-1">Produtos:</p>
                      <ul className="list-disc list-inside">
                        {pedido.produtos.length === 0 ? (
                          <li className="text-red-400">Nenhum produto encontrado</li>
                        ) : (
                          pedido.produtos.map((prod: any) => (
                            <li key={prod.idProduto}>
                              {prod.nome ?? `Produto ID ${prod.idProduto} sem nome`} - R$ {prod.preco?.toFixed(2)} (Qtd: {prod.quantidade || 1})
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleEditar(pedido)}
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListarPedidos;
