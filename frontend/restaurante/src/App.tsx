import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import LayoutCaixa from './layouts/LayoutCaixa';

import LayoutGarcom from './layouts/LayoutGarcom';
import DashboardGarcom from './pages/DashboardGarcom';


import LoginPage from './pages/index';
import Dashboard from './pages/Dashboard';
import DashboardCaixa from './pages/DashboardCaixa';

import CadastrarFuncionario from './pages/funcionarios/CadastrarFuncionario';
import ListarFuncionarios from './pages/funcionarios/ListarFuncionarios';

import CadastrarCliente from './pages/clients/CadastrarCliente';
import ListarClientes from './pages/clients/ListarClientes';

import CadastrarProduto from './pages/products/CadastrarProduto';
import ListarProdutos from './pages/products/ListarProdutos';

import CadastrarPedido from './pages/orders/CadastrarPedido';
import ListarPedidos from './pages/orders/ListarPedidos';

import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página de login */}
        <Route path="/" element={<LoginPage />} />

        {/* ROTAS DO ADMINISTRADOR */}
        <Route element={<MainLayout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute requiredRole="administrador">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="funcionarios/cadastrar"
            element={
              <ProtectedRoute requiredRole="administrador">
                <CadastrarFuncionario />
              </ProtectedRoute>
            }
          />
          <Route
            path="funcionarios/listar"
            element={
              <ProtectedRoute requiredRole="administrador">
                <ListarFuncionarios />
              </ProtectedRoute>
            }
          />

          <Route
            path="clientes/cadastrar"
            element={
              <ProtectedRoute requiredRole="administrador">
                <CadastrarCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="clientes/listar"
            element={
              <ProtectedRoute requiredRole="administrador">
                <ListarClientes />
              </ProtectedRoute>
            }
          />

          <Route
            path="produtos/cadastrar"
            element={
              <ProtectedRoute requiredRole="administrador">
                <CadastrarProduto />
              </ProtectedRoute>
            }
          />
          <Route
            path="produtos/listar"
            element={
              <ProtectedRoute requiredRole="administrador">
                <ListarProdutos />
              </ProtectedRoute>
            }
          />
          <Route
            path="pedidos/cadastrar"
            element={
              <ProtectedRoute requiredRole="administrador">
                <CadastrarPedido />
              </ProtectedRoute>
            }
          />
          <Route
            path="pedidos/listar"
            element={
              <ProtectedRoute requiredRole="administrador">
                <ListarPedidos />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ROTAS DO FUNCIONÁRIO CAIXA */}
        <Route element={<LayoutCaixa />}>
          <Route
            path="caixa/dashboard"
            element={
              <ProtectedRoute requiredRole="caixa">
                <DashboardCaixa />
              </ProtectedRoute>
            }
          />
          <Route
            path="caixa/produtos/cadastrar"
            element={
              <ProtectedRoute requiredRole="caixa">
                <CadastrarProduto />
              </ProtectedRoute>
            }
          />
          <Route
            path="caixa/produtos/listar"
            element={
              <ProtectedRoute requiredRole="caixa">
                <ListarProdutos />
              </ProtectedRoute>
            }
          />
          <Route
            path="caixa/pedidos/listar"
            element={
              <ProtectedRoute requiredRole="caixa">
                <ListarPedidos />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<LayoutGarcom />}>
        <Route
          path="garcom/dashboard"
          element={
            <ProtectedRoute requiredRole="garcom">
              <DashboardGarcom />
            </ProtectedRoute>
          }
        />
        <Route
          path="garcom/pedidos/cadastrar"
          element={
            <ProtectedRoute requiredRole="garcom">
              <CadastrarPedido />
            </ProtectedRoute>
          }
        />
        <Route
          path="garcom/pedidos/listar"
          element={
            <ProtectedRoute requiredRole="garcom">
              <ListarPedidos />
            </ProtectedRoute>
          }
        />
      </Route>

        {/* Página 404 */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
              <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
              <p className="text-2xl mb-8">Página não encontrada!</p>
              <p className="text-md text-gray-600">
                A URL que você tentou acessar não existe.
              </p>
              <p className="text-md text-gray-600">
                Por favor, verifique o endereço ou volte para a{' '}
                <a href="/" className="text-blue-600 hover:underline">
                  página inicial
                </a>.
              </p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
