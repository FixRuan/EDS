import { FaturamentoCard } from "../components/Faturamento";
import { ItensMaisVendidosList } from "../components/MaisVendidos";
import { useDashboardData } from "../components/DashboardData";

function Dashboard() {
  const { faturamento, itensMaisVendidos, loading, error } = useDashboardData();

  if (loading) return <p>Carregando dados do dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8">
        Bem-vindo ao painel de administração do restaurante. Use a barra lateral para navegar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FaturamentoCard periodo="Diário" valor={faturamento.diario} color="bg-green-100" textColor="text-green-700" />
        <FaturamentoCard periodo="Semanal" valor={faturamento.semanal} color="bg-blue-100" textColor="text-blue-700" />
        <FaturamentoCard periodo="Mensal" valor={faturamento.mensal} color="bg-purple-100" textColor="text-purple-700" />
      </div>

      <div className="mt-8 space-y-8">
        <ItensMaisVendidosList titulo="Itens Mais Vendidos - Diário" itens={itensMaisVendidos.diario} />
        <ItensMaisVendidosList titulo="Itens Mais Vendidos - Semanal" itens={itensMaisVendidos.semanal} />
        <ItensMaisVendidosList titulo="Itens Mais Vendidos - Mensal" itens={itensMaisVendidos.mensal} />
      </div>
    </div>
  );
}

export default Dashboard;
