/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function CadastrarPedido() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    { idProduto: number; quantidade: number }[]
  >([]);

  const [pedido, setPedido] = useState({
    idCliente: null as number | null,
    idFuncionario: null as number | null,
    formaPagamento: "dinheiro",
    observacoes: "",
    status: "preparando",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const funcionarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");

        if (!funcionarioLogado?.idFuncionario) {
          alert("Funcionário não autenticado.");
          return;
        }

        setPedido((prev) => ({ ...prev, idFuncionario: funcionarioLogado.idFuncionario }));

        const [resClientes, resProdutos] = await Promise.all([
          api.get("/clientes/selecionar"),
          api.get("/produtos"),
        ]);

        setClientes(resClientes.data);
        setProdutos(resProdutos.data.filter((p: { disponivel: boolean }) => p.disponivel));
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        alert("Erro ao carregar dados para o formulário.");
      }
    }

    fetchData();
  }, []);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setPedido((prev) => ({
      ...prev,
      [name]: name === "idCliente" ? (value ? Number(value) : null) : value,
    }));
  }

  function toggleProduto(idProduto: number) {
    setProdutosSelecionados((prev) => {
      const existente = prev.find((p) => p.idProduto === idProduto);
      if (existente) {
        return prev.filter((p) => p.idProduto !== idProduto);
      } else {
        return [...prev, { idProduto, quantidade: 1 }];
      }
    });
  }

  function alterarQuantidade(idProduto: number, novaQtd: number) {
    setProdutosSelecionados((prev) =>
      prev.map((p) => (p.idProduto === idProduto ? { ...p, quantidade: novaQtd } : p))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const resPedido = await api.post("/pedidos", pedido);
      const { idPedido } = resPedido.data;

      await Promise.all(
        produtosSelecionados.map((prod) =>
          api.post("/pedido-produto", {
            idPedido,
            idProduto: prod.idProduto,
            quantidade: prod.quantidade,
          })
        )
      );

      alert("Pedido criado com sucesso!");
      setPedido({
        idCliente: null,
        idFuncionario: pedido.idFuncionario,
        formaPagamento: "dinheiro",
        observacoes: "",
        status: "preparando",
      });
      setProdutosSelecionados([]);
    } catch (error) {
      console.error("Erro ao cadastrar pedido:", error);
      alert("Erro ao cadastrar pedido.");
    }
  }

  return (
    <div className="w-full h-full bg-[#18191A]">
      <div className="p-8 max-w-3xl mx-auto text-white bg-[#18191A]">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400">Cadastrar Pedido</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <select
              name="idCliente"
              value={pedido.idCliente ?? ""}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-[#1f1f1f] border border-gray-600 rounded p-2 text-white"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
            <select
              name="formaPagamento"
              value={pedido.formaPagamento}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-[#1f1f1f] border border-gray-600 rounded p-2 text-white"
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="pix">Pix</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={pedido.status}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-[#1f1f1f] border border-gray-600 rounded p-2 text-white"
            >
              <option value="preparando">Preparando</option>
              <option value="pronto">Pronto</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Observações</label>
            <textarea
              name="observacoes"
              value={pedido.observacoes}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-[#1f1f1f] border border-gray-600 rounded p-2 text-white"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-yellow-400 mb-2">Produtos</h2>
            <div className="grid grid-cols-1 gap-3">
              {produtos.map((prod) => {
                const selecionado = produtosSelecionados.find((p) => p.idProduto === prod.idProduto);
                return (
                  <div key={prod.idProduto} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!selecionado}
                      onChange={() => toggleProduto(prod.idProduto)}
                      className="form-checkbox h-4 w-4 text-yellow-400"
                    />
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                      {prod.nome} (R$ {prod.preco.toFixed(2)})
                    </span>
                    {selecionado && (
                      <input
                        type="number"
                        min={1}
                        value={selecionado.quantidade}
                        onChange={(e) => alterarQuantidade(prod.idProduto, Number(e.target.value))}
                        className="w-20 bg-[#1f1f1f] border border-gray-600 rounded p-1 text-white"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            data-cy="botao-cadastrar-pedido"
            className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 font-semibold"
          >
            Cadastrar Pedido
          </button>
        </form>
      </div>
    </div>
  );
}
