import React from 'react';
import SidebarCaixa from '../components/SidebarCaixa';
import { Outlet } from 'react-router-dom';

const LayoutCaixa: React.FC = () => {
  return (
    <div className="flex">
      <SidebarCaixa />
      <main className="flex-1 bg-[#18191A] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutCaixa;
