function Dashboard(){
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <p className="text-lg text-gray-700">Bem-vindo ao painel de administração do restaurante. Use a barra lateral para navegar.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Funcionários</h2>
          <p className="text-gray-600">Gerencie informações de funcionários.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Clientes</h2>
          <p className="text-gray-600">Gerencie informações de clientes.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Produtos</h2>
          <p className="text-gray-600">Gerencie o cardápio e os itens disponíveis.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Pedidos</h2>
          <p className="text-gray-600">Acompanhe e gerencie os pedidos.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
