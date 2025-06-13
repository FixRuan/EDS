import { BrowserRouter, Routes, Route} from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import LoginPage from './pages/index';
import Dashboard from './pages/Dashboard';

import CadastrarFuncionario from './pages/funcionarios/CadastrarFuncionario';
import ListarFuncionarios from './pages/funcionarios/ListarFuncionarios';

import CadastrarCliente from './pages/clients/CadastrarCliente';
import ListarClientes from './pages/clients/ListarClientes';

import CadastrarProduto from './pages/products/CadastrarProduto';
import ListarProdutos from './pages/products/ListarProdutos';

import CadastrarPedido from './pages/orders/CadastrarPedido';
import ListarPedidos from './pages/orders/ListarPedidos';


export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="funcionarios/cadastrar" element={<CadastrarFuncionario />} />
          <Route path="funcionarios/listar" element={<ListarFuncionarios />} />

          <Route path="clientes/cadastrar" element={<CadastrarCliente />} />
          <Route path="clientes/listar" element={<ListarClientes />} />

          <Route path="produtos/cadastrar" element={<CadastrarProduto />} />
          <Route path="produtos/listar" element={<ListarProdutos />} />

          <Route path="pedidos/cadastrar" element={<CadastrarPedido />} />
          <Route path="pedidos/listar" element={<ListarPedidos />} />
        </Route>

        <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
              <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
              <p className="text-2xl mb-8">Página não encontrada!</p>
              <p className="text-md text-gray-600">A URL que você tentou acessar não existe.</p>
              <p className="text-md text-gray-600">Por favor, verifique o endereço ou volte para a <a href="/" className="text-blue-600 hover:underline">página inicial</a>.</p>
            </div>
          } />
      </Routes>
    </BrowserRouter>
  );
};
