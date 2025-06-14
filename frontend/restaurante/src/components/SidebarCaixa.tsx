import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ClipboardText, Hamburger, SignOut } from 'phosphor-react';

import Logo from '../assets/logo.png';

const SidebarCaixa: React.FC = () => {
  const navigate = useNavigate();

  const navSections = [
    {
      title: 'Produtos',
      items: [
        { name: 'Cadastrar Produto', path: '/caixa/produtos/cadastrar', icon: <Hamburger size={20} /> },
        { name: 'Listar Produtos', path: '/caixa/produtos/listar', icon: <Hamburger size={20} /> },
      ],
    },
    {
      title: 'Pedidos',
      items: [
        { name: 'Listar Pedidos', path: '/caixa/pedidos/listar', icon: <ClipboardText size={20} /> },
      ],
    },
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
            to="/caixa/dashboard"
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

        {navSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-4 text-sm text-gray-400 uppercase tracking-wide mb-2">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => (
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
          </div>
        ))}
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

export default SidebarCaixa;
