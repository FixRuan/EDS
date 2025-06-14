import React, { useState } from 'react';
import axios from 'axios';

const CadastrarProduto: React.FC = () => {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: 'lanche',
    disponivel: true,
    quantidadeEstoque: '',
  });

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      await axios.post('http://localhost:3000/produtos', {
        ...form,
        preco: parseFloat(form.preco),
        quantidadeEstoque: parseInt(form.quantidadeEstoque),
      });
      setMensagem('Produto cadastrado com sucesso!');
      setForm({
        nome: '',
        descricao: '',
        preco: '',
        categoria: 'lanche',
        disponivel: true,
        quantidadeEstoque: '',
      });
    } catch (error) {
      console.error(error);
      setErro('Erro ao cadastrar produto.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#18191A] pt-16 px-8 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cadastrar Produto</h1>
        <p className="text-gray-400 mb-6">Formulário para cadastrar novos produtos.</p>

        {mensagem && <p className="text-green-400 mb-4">{mensagem}</p>}
        {erro && <p className="text-red-400 mb-4">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg">
          <div>
            <label className="block mb-1">Nome:</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-900 text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Descrição:</label>
            <input
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-900 text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Preço:</label>
            <input
              type="number"
              name="preco"
              step="0.01"
              value={form.preco}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-900 text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Quantidade em Estoque:</label>
            <input
              type="number"
              name="quantidadeEstoque"
              value={form.quantidadeEstoque}
              onChange={handleChange}
              required
              min="0"
              className="w-full p-2 rounded bg-gray-900 text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Categoria:</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-900 text-white"
            >
              <option value="lanche">Lanche</option>
              <option value="porcao">Porção</option>
              <option value="bebida">Bebida</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="disponivel"
              checked={form.disponivel}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Disponível</label>
          </div>

          <button
            type="submit"
            className="bg-yellow-500 text-[#18191A] px-4 py-2 rounded hover:brightness-90"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastrarProduto;
