import React, { useState } from 'react';
import { api } from '../../services/api';

const CadastrarCliente: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
  });

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMensagem('');
    setErro('');

    try {
      const response = await api.post('/clientes', formData);

      setMensagem('Cliente cadastrado com sucesso!');
      setFormData({
        nome: '',
        telefone: '',
        endereco: '',
      });
    } catch (error: any) {
      if (error.response && error.response.data?.message) {
        setErro(error.response.data.message);
      } else {
        setErro('Erro ao cadastrar cliente.');
      }
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full bg-[#18191A] pt-16">
      <div className="p-8 max-w-xl mx-auto bg-[#18191A]">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Cadastrar Cliente</h1>
        <p className="text-gray-400 mb-6">Preencha os dados abaixo para adicionar um novo cliente.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['nome', 'telefone', 'endereco'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-300 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                required
                className="w-full p-3 mt-1 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          ))}

          {mensagem && <p className="text-green-400">{mensagem}</p>}
          {erro && <p className="text-red-400">{erro}</p>}

          <button
            type="submit"
            className="w-full h-12 bg-yellow-500 text-[#18191A] font-semibold rounded-md hover:brightness-90 transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastrarCliente;
