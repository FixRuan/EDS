/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

function CadastrarPedido() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<number[]>([]);
  const [pedido, setPedido] = useState({
    idCliente: "",
    idFuncionario: "",
    formaPagamento: "dinheiro",
    observacoes: "",
    status: "preparando"
  });

  useEffect(() => {
    async function fetchData() {
      const [resClientes, resFuncionarios, resProdutos] = await Promise.all([
        axios.get("http://localhost:3000/clientes"),
        axios.get("http://localhost:3000/funcionarios"),
        axios.get("http://localhost:3000/produtos")
      ]);
      setClientes(resClientes.data);
      setFuncionarios(resFuncionarios.data);
      setProdutos(resProdutos.data.filter((p: { disponivel: boolean }) => p.disponivel));
    }
    fetchData();
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setPedido(prev => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(option: any, field: "idCliente" | "idFuncionario") {
    setPedido(prev => ({ ...prev, [field]: option ? option.value : "" }));
  }

  function toggleProduto(idProduto: number) {
    setProdutosSelecionados(prev =>
      prev.includes(idProduto)
        ? prev.filter(id => id !== idProduto)
        : [...prev, idProduto]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const resPedido = await axios.post("http://localhost:3000/pedidos", pedido);
      const { idPedido } = resPedido.data;

      await Promise.all(produtosSelecionados.map(idProduto =>
        axios.post("http://localhost:3000/pedido-produto", { idPedido, idProduto })
      ));

      alert("Pedido criado com sucesso!");
      setPedido({ idCliente: "", idFuncionario: "", formaPagamento: "dinheiro", observacoes: "", status: "preparando" });
      setProdutosSelecionados([]);
    } catch (error) {
      console.error("Erro ao cadastrar pedido:", error);
      alert("Erro ao cadastrar pedido.");
    }
  }

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#1f1f1f',
      borderColor: '#3f3f46',
      color: '#fff',
      padding: '2px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#facc15'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#1f1f1f',
      color: '#fff'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#2c2c2c' : '#1f1f1f',
      color: '#fff',
      cursor: 'pointer'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#fff'
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#fff'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#a1a1aa'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#facc15'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    })
  };

  return (
    <div className="w-full h-full bg-[#18191A]">
    <div className="p-8 max-w-3xl mx-auto text-white bg-[#18191A]">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Cadastrar Pedido</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cliente</label>
          <Select
            options={clientes.map(c => ({ value: c.idCliente, label: c.nome }))}
            value={clientes.map(c => ({ value: c.idCliente, label: c.nome })).find(opt => opt.value === pedido.idCliente) || null}
            onChange={option => handleSelectChange(option, "idCliente")}
            placeholder="Selecione um cliente"
            isClearable
            styles={customSelectStyles}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Funcionário</label>
          <Select
            options={funcionarios.map(f => ({ value: f.idFuncionario, label: f.nome }))}
            value={funcionarios.map(f => ({ value: f.idFuncionario, label: f.nome })).find(opt => opt.value === pedido.idFuncionario) || null}
            onChange={option => handleSelectChange(option, "idFuncionario")}
            placeholder="Selecione um funcionário"
            isClearable
            styles={customSelectStyles}
          />
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
          <div className="grid grid-cols-2 gap-2">
            {produtos.map(prod => (
              <label key={prod.idProduto} className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={produtosSelecionados.includes(prod.idProduto)}
                  onChange={() => toggleProduto(prod.idProduto)}
                />
                <span>{prod.nome} (R$ {prod.preco.toFixed(2)})</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 font-semibold"
        >
          Cadastrar Pedido
        </button>
      </form>
    </div>
    </div>
  );
}

export default CadastrarPedido;
