/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Produto {
  idProduto: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: 'lanche' | 'porcao' | 'bebida';
  disponivel: number | boolean;
  quantidadeEstoque: number;
}

export default function ListarProdutos(){
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Produto>>({});

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos(){
    try {
      const response = await axios.get('http://localhost:3000/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error(error);
      setErro('Erro ao buscar produtos.');
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>){
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  async function salvarEdicao(id: number){
    try {
      await axios.put(`http://localhost:3000/produtos/${id}`, {
        ...form,
        preco: parseFloat(form.preco as any),
        quantidadeEstoque: parseInt(form.quantidadeEstoque as any),
      });
      setEditandoId(null);
      buscarProdutos();
    } catch (error) {
      console.error(error);
      setErro('Erro ao salvar alterações.');
    }
  };

  async function excluirProduto(id: number){
    if (!confirm('Deseja realmente excluir este produto?')) return;

    try {
      await axios.delete(`http://localhost:3000/produtos/${id}`);
      buscarProdutos();
    } catch (error) {
      console.error(error);
      setErro('Erro ao excluir produto.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#18191A] pt-16 px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Listar Produtos</h1>
        <p className="text-gray-400 mb-6">Produtos cadastrados no sistema.</p>

        {erro && <p className="text-red-400 mb-4">{erro}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-md overflow-hidden">
           <thead>
            <tr className="bg-yellow-500 text-[#18191A] text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4 min-w-[180px] whitespace-nowrap">Nome</th>
              <th className="py-3 px-4 min-w-[200px]">Descrição</th>
              <th className="py-3 px-4 min-w-[120px] whitespace-nowrap">Preço</th>
              <th className="py-3 px-4">Estoque</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4">Disponível</th>
              <th className="py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.idProduto} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-3 px-4">{produto.idProduto}</td>

                {editandoId === produto.idProduto ? (
                  <>
                    <td className="py-3 px-4 min-w-[180px] whitespace-nowrap">
                      <input
                        type="text"
                        name="nome"
                        value={form.nome ?? ''}
                        onChange={handleChange}
                        className="bg-gray-900 p-1 rounded w-full text-white"
                      />
                    </td>
                    <td className="py-3 px-4 min-w-[200px]">
                      <input
                        type="text"
                        name="descricao"
                        value={form.descricao ?? ''}
                        onChange={handleChange}
                        className="bg-gray-900 p-1 rounded w-full text-white"
                      />
                    </td>
                    <td className="py-3 px-4 min-w-[120px] whitespace-nowrap">
                      <input
                        type="number"
                        name="preco"
                        step="0.01"
                        value={form.preco ?? ''}
                        onChange={handleChange}
                        className="bg-gray-900 p-1 rounded w-full text-white"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        name="quantidadeEstoque"
                        value={form.quantidadeEstoque ?? ''}
                        onChange={handleChange}
                        className="bg-gray-900 p-1 rounded w-full text-white"
                        min={0}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        name="categoria"
                        value={form.categoria ?? 'lanche'}
                        onChange={handleChange}
                        className="bg-gray-900 p-1 rounded w-full text-white"
                      >
                        <option value="lanche">Lanche</option>
                        <option value="porcao">Porção</option>
                        <option value="bebida">Bebida</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        name="disponivel"
                        checked={!!form.disponivel}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="py-3 px-4 space-x-2 flex">
                      <button
                        onClick={() => salvarEdicao(produto.idProduto)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditandoId(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                    <>
                      <td className="py-3 px-4 min-w-[180px] whitespace-nowrap">
                        {produto.nome}
                      </td>
                      <td className="py-3 px-4 min-w-[200px]">{produto.descricao}</td>
                      <td className="py-3 px-4 min-w-[120px] whitespace-nowrap">
                        R$ {produto.preco.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">{produto.quantidadeEstoque}</td>
                      <td className="py-3 px-4 capitalize">{produto.categoria}</td>
                      <td className="py-3 px-4">{produto.disponivel ? 'Sim' : 'Não'}</td>
                      <td className="py-3 px-4 space-x-2 flex">
                        <button
                          onClick={() => {
                            setEditandoId(produto.idProduto);
                            setForm(produto);
                          }}
                          className="bg-yellow-500 text-black px-2 py-1 rounded"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => excluirProduto(produto.idProduto)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Excluir
                        </button>
                      </td>
                    </>
                  )}
                </tr>
            ))}
              {produtos.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
