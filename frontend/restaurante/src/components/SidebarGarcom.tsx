import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ClipboardText, SignOut } from 'phosphor-react';

import Logo from '../assets/logo.png';

const SidebarGarcom: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Cadastrar Pedido', path: '/garcom/pedidos/cadastrar', icon: <ClipboardText size={20} /> },
    { name: 'Listar Pedidos', path: '/garcom/pedidos/listar', icon: <ClipboardText size={20} /> },
  ];

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('funcao');
    navigate('/');
  }

  return (
    <aside className="w-80 min-h-screen bg-[#18191A] text-white shadow-lg flex flex-col">
      <div className="flex p-6 items-center justify-center border-b border-gray-700">
        <img src={Logo} width={200} alt="" />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-6 overflow-auto">
        <div>
          <NavLink
            to="/garcom/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition duration-200 ${
                isActive
                  ? 'bg-yellow-500 text-[#18191A] shadow-md'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <ClipboardText size={20} />
            Dashboard
          </NavLink>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition duration-200 ${
                  isActive
                    ? 'bg-yellow-500 text-[#18191A] shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="px-4 mb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-base font-medium transition"
        >
          <SignOut size={20} weight="bold" />
          Sair
        </button>
      </div>

      <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-700">
        &copy; 2025 Restaurante Fácil. Todos os direitos reservados.
      </div>
    </aside>
  );
};

export default SidebarGarcom;
