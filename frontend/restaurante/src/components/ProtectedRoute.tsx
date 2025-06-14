/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, requiredRole }: any) {
  const token = localStorage.getItem('token');
  const funcao = localStorage.getItem('funcao');

  if (!token) {
    return <Navigate to="/" />;
  }

  if (requiredRole && funcao !== requiredRole) {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold text-red-600">Acesso negado</h1>
        <p className="text-lg">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return children;
}
