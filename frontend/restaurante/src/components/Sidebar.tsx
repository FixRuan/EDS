import React from 'react';
import { NavLink } from 'react-router-dom';
import { Browsers, ClipboardText, Hamburger, UserPlus, Users,  } from 'phosphor-react';

import Logo from '../assets/logo.png'

const Sidebar: React.FC = () => {
  const navSections = [
    {
      title: 'Funcionários',
      items: [
        { name: 'Cadastrar Funcionários', path: '/funcionarios/cadastrar', icon: <UserPlus size={20} /> },
        { name: 'Listar Funcionários', path: '/funcionarios/listar', icon: <Users size={20} /> },
      ],
    },
    {
      title: 'Clientes',
      items: [
        { name: 'Cadastrar Cliente', path: '/clientes/cadastrar', icon: <UserPlus size={20} /> },
        { name: 'Listar Clientes', path: '/clientes/listar', icon: <Users size={20} /> },
      ],
    },
    {
      title: 'Produtos',
      items: [
        { name: 'Cadastrar Produto', path: '/produtos/cadastrar', icon: <Hamburger size={20} /> },
        { name: 'Listar Produtos', path: '/produtos/listar', icon: <Hamburger size={20} /> },
      ],
    },
    {
      title: 'Pedidos',
      items: [
        { name: 'Cadastrar Pedido', path: '/pedidos/cadastrar', icon: <ClipboardText size={20} /> },
        { name: 'Listar Pedidos', path: '/pedidos/listar', icon: <ClipboardText size={20} /> },
      ],
    },
  ];

  return (
    <aside className="w-80 min-h-screen bg-[#18191A] text-white shadow-lg flex flex-col">
      <div className="flex p-6 items-center justify-center border-b border-gray-700">
        <img src={Logo} width={200} alt=''/>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-6 overflow-auto">
        <div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition duration-200 ${
                isActive
                  ? 'bg-yellow-500 text-[#18191A] shadow-md'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <Browsers size={20} />
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

      <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-700">
        &copy; 2025 Restaurante Fácil. Todos os direitos reservados.
      </div>
    </aside>
  );
};

export default Sidebar;
