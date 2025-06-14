import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const funcao = usuario?.funcao;

  if (!token) {
    return <Navigate to="/" />;
  }

  if (requiredRole && funcao !== requiredRole) {
    return (
      <div className="text-center p-10 text-white">
        <h1 className="text-3xl font-bold text-red-600">Acesso negado</h1>
        <p className="text-lg">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return children;
}
