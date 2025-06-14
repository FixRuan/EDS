import React, { useEffect, useState } from 'react';
import {api} from '../../services/api'; // cliente com token incluído

interface Funcionario {
  idFuncionario: number;
  nome: string;
  funcao: string;
  horarioTrabalho: string;
  login: string;
}

const ListarFuncionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [erro, setErro] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Funcionario>>({});

  useEffect(() => {
    buscarFuncionarios();
  }, []);

 const buscarFuncionarios = async () => {
  try {
    const response = await api.get('/funcionarios');
    const apenasNaoAdmins = response.data.filter(
      (f: Funcionario) => f.funcao.toLowerCase() !== 'administrador'
    );
    setFuncionarios(apenasNaoAdmins);
  } catch (error) {
    setErro('Erro ao buscar funcionários.');
    console.error(error);
  }
};

  const handleEditar = (funcionario: Funcionario) => {
    setEditandoId(funcionario.idFuncionario);
    setEditForm({ ...funcionario });
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setEditForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (id: number) => {
    try {
      await api.put(`/funcionarios/${id}`, editForm);
      setEditandoId(null);
      setEditForm({});
      buscarFuncionarios();
    } catch (error) {
      setErro('Erro ao salvar alterações.');
      console.error(error);
    }
  };

  const handleExcluir = async (id: number) => {
    try {
      await api.delete(`/funcionarios/${id}`);
      buscarFuncionarios();
    } catch (error) {
      setErro('Erro ao excluir funcionário.');
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full bg-[#18191A] pt-16 px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Listar Funcionários</h1>
        <p className="text-gray-400 mb-6">Funcionários cadastrados no sistema.</p>

        {erro && <p className="text-red-400 mb-4">{erro}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed bg-gray-800 rounded-md overflow-hidden">
            <thead>
              <tr className="bg-yellow-500 text-[#18191A] text-left">
                <th className="py-3 px-4 w-20">ID</th>
                <th className="py-3 px-4 w-48">Nome</th>
                <th className="py-3 px-4 w-48">Função</th>
                <th className="py-3 px-4 w-48">Horário</th>
                <th className="py-3 px-4 w-48">Login</th>
                <th className="py-3 px-4 w-48">Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((func) => (
                <tr key={func.idFuncionario} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3 px-4">{func.idFuncionario}</td>

                  {editandoId === func.idFuncionario ? (
                    <>
                      <td className="py-3 px-4">
                        <input
                          name="nome"
                          value={editForm.nome || ''}
                          onChange={handleChange}
                          className="bg-gray-900 text-white p-1 rounded w-full max-w-[150px] truncate"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          name="funcao"
                          value={editForm.funcao || ''}
                          onChange={handleChange}
                          className="bg-gray-900 text-white p-1 rounded w-full max-w-[150px] truncate"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          name="horarioTrabalho"
                          value={editForm.horarioTrabalho || ''}
                          onChange={handleChange}
                          className="bg-gray-900 text-white p-1 rounded w-full max-w-[150px] truncate"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          name="login"
                          value={editForm.login || ''}
                          onChange={handleChange}
                          className="bg-gray-900 text-white p-1 rounded w-full max-w-[150px] truncate"
                        />
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          onClick={() => handleSalvar(func.idFuncionario)}
                          className="bg-green-500 px-3 py-1 rounded hover:brightness-90"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={handleCancelar}
                          className="bg-gray-500 px-3 py-1 rounded hover:brightness-90"
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4">{func.nome}</td>
                      <td className="py-3 px-4">{func.funcao}</td>
                      <td className="py-3 px-4">{func.horarioTrabalho}</td>
                      <td className="py-3 px-4">{func.login}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          onClick={() => handleEditar(func)}
                          className="bg-yellow-500 text-[#18191A] px-3 py-1 rounded hover:brightness-90"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(func.idFuncionario)}
                          className="bg-red-500 px-3 py-1 rounded hover:brightness-90"
                        >
                          Remover
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {funcionarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    Nenhum funcionário encontrado.
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

export default ListarFuncionarios;
