import SidebarCaixa from '../components/SidebarCaixa';
import { Outlet } from 'react-router-dom';

export default function LayoutCaixa(){
  return (
    <div className="flex">
      <SidebarCaixa />
      <main className="flex-1 bg-[#18191A] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
