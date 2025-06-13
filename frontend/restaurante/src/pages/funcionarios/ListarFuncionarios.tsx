import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/funcionarios');
        setFuncionarios(response.data);
      } catch (error: any) {
        setErro('Erro ao buscar funcionários.');
        console.error(error);
      }
    };

    fetchFuncionarios();
  }, []);

  return (
    <div className="w-full h-full bg-[#18191A] pt-16 px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Listar Funcionários</h1>
        <p className="text-gray-400 mb-6">Funcionários cadastrados no sistema.</p>

        {erro && <p className="text-red-400 mb-4">{erro}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-md overflow-hidden">
            <thead>
              <tr className="bg-yellow-500 text-[#18191A] text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nome</th>
                <th className="py-3 px-4">Função</th>
                <th className="py-3 px-4">Horário</th>
                <th className="py-3 px-4">Login</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((func) => (
                <tr key={func.idFuncionario} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3 px-4">{func.idFuncionario}</td>
                  <td className="py-3 px-4">{func.nome}</td>
                  <td className="py-3 px-4">{func.funcao}</td>
                  <td className="py-3 px-4">{func.horarioTrabalho}</td>
                  <td className="py-3 px-4">{func.login}</td>
                </tr>
              ))}
              {funcionarios.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
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
