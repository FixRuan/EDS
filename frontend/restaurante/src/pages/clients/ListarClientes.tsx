import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Cliente {
  idCliente: number;
  nome: string;
  telefone: string;
  endereco: string;
}

export default function ListarClientes(){
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [erro, setErro] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Cliente>>({});

  // Buscar lista
  async function fetchClientes(){
    try {
      const { data } = await api.get<Cliente[]>('/clientes');
      setClientes(data);
    } catch (err) {
      setErro('Erro ao buscar clientes.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Iniciar edição
  function startEdit(cliente: Cliente){
    setEditingId(cliente.idCliente);
    setEditData({ nome: cliente.nome, telefone: cliente.telefone, endereco: cliente.endereco });
    setErro('');
  };

  // Cancelar edição
  function cancelEdit(){
    setEditingId(null);
    setEditData({});
  };

  // Capturar mudança nos inputs de edição
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>){
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Salvar edição
  async function saveEdit(id: number){
    try {
      await api.put(`/clientes/${id}`, editData);
      // Atualiza a lista localmente
      setClientes((old) =>
        old.map((c) =>
          c.idCliente === id ? { ...c, ...(editData as Cliente) } : c
        )
      );
      cancelEdit();
    } catch (err) {
      setErro('Erro ao salvar alterações.');
      console.error(err);
    }
  };

  async function handleExcluir(id: number){
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      setClientes((old) => old.filter((c) => c.idCliente !== id));
    } catch (err) {
      setErro('Erro ao excluir cliente.');
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full bg-[#18191A] pt-16">
      <div className="p-8 max-w-5xl mx-auto bg-[#18191A]">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Clientes Cadastrados</h1>
        {erro && <p className="text-red-400 mb-4">{erro}</p>}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-gray-900 text-white border border-gray-700">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b border-gray-700 text-left">Nome</th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">Telefone</th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">Endereço</th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.idCliente} className="hover:bg-gray-800 transition">
                  {editingId === cliente.idCliente ? (
                    <>
                      <td className="py-3 px-4 border-b border-gray-700">
                        <input
                          name="nome"
                          value={editData.nome || ''}
                          onChange={handleEditChange}
                          className="w-full bg-gray-800 text-white p-1 rounded border border-gray-600"
                        />
                      </td>
                      <td className="py-3 px-4 border-b border-gray-700">
                        <input
                          name="telefone"
                          value={editData.telefone || ''}
                          onChange={handleEditChange}
                          className="w-full bg-gray-800 text-white p-1 rounded border border-gray-600"
                        />
                      </td>
                      <td className="py-3 px-4 border-b border-gray-700">
                        <input
                          name="endereco"
                          value={editData.endereco || ''}
                          onChange={handleEditChange}
                          className="w-full bg-gray-800 text-white p-1 rounded border border-gray-600"
                        />
                      </td>
                      <td className="py-3 px-4 border-b border-gray-700 space-x-2 flex flex-row">
                        <button
                          onClick={() => saveEdit(cliente.idCliente)}
                          className="bg-green-500 text-black px-1 py-1 rounded hover:brightness-90 transition"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-600 text-white px-1 py-1 rounded hover:brightness-90 transition"
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 border-b border-gray-700">{cliente.nome}</td>
                      <td className="py-3 px-4 border-b border-gray-700">{cliente.telefone}</td>
                      <td className="py-3 px-4 border-b border-gray-700">{cliente.endereco}</td>
                      <td className="py-3 px-4 border-b border-gray-700 space-x-2 flex">
                        <button
                          onClick={() => startEdit(cliente)}
                          className="bg-yellow-500 text-black px-3 py-1 rounded hover:brightness-90 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(cliente.idCliente)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:brightness-90 transition"
                        >
                          Excluir
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">
                    Nenhum cliente cadastrado.
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
