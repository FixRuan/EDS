/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const resPedidos = await axios.get("http://localhost:3000/pedidos");
        const pedidosArray = Array.isArray(resPedidos.data)
          ? resPedidos.data
          : resPedidos.data.pedidos;

        const pedidosComRelacionamentos = await Promise.all(
          pedidosArray.map(async (pedido: any) => {
            try {
              const [clienteRes, funcionarioRes, produtosRes] = await Promise.all([
                pedido.idCliente
                  ? axios.get(`http://localhost:3000/clientes/${pedido.idCliente}`)
                  : Promise.resolve({ data: { nome: "-" } }),
                pedido.idFuncionario
                  ? axios.get(`http://localhost:3000/funcionarios/${pedido.idFuncionario}`)
                  : Promise.resolve({ data: { nome: "-" } }),
                axios.get(`http://localhost:3000/pedido-produto/pedidos/${pedido.idPedido}/produtos`)
              ]);

              const clienteNome = clienteRes.data.nome;
              const funcionarioNome = funcionarioRes.data.nome;

              const produtosDetalhados = await Promise.all(
                (Array.isArray(produtosRes.data) ? produtosRes.data : []).map((pp: any) =>
                  axios
                    .get(`http://localhost:3000/produtos/${pp.idProduto}`)
                    .then((res) => ({
                      ...res.data,
                      quantidade: pp.quantidade || 1,
                    }))
                    .catch(() => null)
                )
              );

              return {
                ...pedido,
                cliente: clienteNome,
                funcionario: funcionarioNome,
                produtos: produtosDetalhados.filter(Boolean),
              };
            } catch (innerError) {
              console.error("Erro ao buscar relacionamentos:", innerError);
              return { ...pedido, cliente: "-", funcionario: "-", produtos: [] };
            }
          })
        );

        setPedidos(pedidosComRelacionamentos);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchProdutosDisponiveis() {
      try {
        const res = await axios.get("http://localhost:3000/produtos");
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

      await axios.put(`http://localhost:3000/pedidos/${idPedido}`, {
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

      // Remover produtos
      const removidos = idsAntigos.filter((id: number) => !idsNovos.includes(id));
      for (const idProduto of removidos) {
        await axios.delete(`http://localhost:3000/pedido-produto/${idPedido}/${idProduto}`);
      }

      // Adicionar ou atualizar produtos
      for (const produtoNovo of produtosNovos) {
        const existente = produtosAntigos.find((p: any) => p.idProduto === produtoNovo.idProduto);
        if (existente) {
          if (existente.quantidade !== produtoNovo.quantidade) {
            // Atualiza quantidade
            await axios.put(`http://localhost:3000/pedido-produto/${idPedido}/${produtoNovo.idProduto}`, {
              quantidade: produtoNovo.quantidade,
            });
          }
        } else {
          // Adiciona novo
          await axios.post("http://localhost:3000/pedido-produto", {
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
        p.idProduto === idProduto
          ? { ...p, quantidade: Math.max(1, quantidade) }
          : p
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
                    <div>
                      <label className="block mb-1 text-sm">Status:</label>
                      <select
                        className="bg-[#3A3B3C] p-2 rounded w-full text-white"
                        value={formEdicao.status}
                        onChange={(e) => setFormEdicao({ ...formEdicao, status: e.target.value })}
                      >
                        <option value="preparando">Preparando</option>
                        <option value="pronto">Pronto</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm">Forma de Pagamento:</label>
                      <select
                        className="bg-[#3A3B3C] p-2 rounded w-full text-white"
                        value={formEdicao.formaPagamento}
                        onChange={(e) => setFormEdicao({ ...formEdicao, formaPagamento: e.target.value })}
                      >
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pix">PIX</option>
                        <option value="cartao">Cartão</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm">Observações:</label>
                      <textarea
                        className="bg-[#3A3B3C] p-2 rounded w-full text-white"
                        value={formEdicao.observacoes}
                        onChange={(e) => setFormEdicao({ ...formEdicao, observacoes: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm">Produtos:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {produtosDisponiveis.map((produto) => {
                          const selecionado = formEdicao.produtos.find((p) => p.idProduto === produto.idProduto);
                          return (
                            <div key={produto.idProduto} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleProduto(produto)}
                                className={`p-2 rounded w-full ${
                                  selecionado
                                    ? "bg-yellow-600 text-black"
                                    : "bg-[#3A3B3C] text-white hover:bg-[#4A4B4C]"
                                }`}
                              >
                                {produto.nome}
                              </button>
                              {selecionado && (
                                <input
                                  type="number"
                                  min={1}
                                  value={selecionado.quantidade}
                                  onChange={(e) =>
                                    alterarQuantidade(produto.idProduto, parseInt(e.target.value, 10))
                                  }
                                  className="w-16 p-1 bg-[#3A3B3C] text-white rounded text-center"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleSalvar(pedido.idPedido)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1 rounded"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditandoPedidoId(null)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded"
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
                        {pedido.produtos.map((prod: any) => (
                          <li key={prod.idProduto}>
                            {prod.nome} - R$ {prod.preco?.toFixed(2)} (Qtd: {prod.quantidade || 1})
                          </li>
                        ))}
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
