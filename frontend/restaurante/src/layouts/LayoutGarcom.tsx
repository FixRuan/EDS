import React from 'react';
import SidebarGarcom from '../components/SidebarGarcom';
import { Outlet } from 'react-router-dom';

const LayoutGarcom: React.FC = () => {
  return (
    <div className="flex">
      <SidebarGarcom />
      <main className="flex-1 bg-[#18191A] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutGarcom;
