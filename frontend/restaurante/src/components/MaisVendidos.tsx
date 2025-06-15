interface ItemMaisVendido {
  nome: string;
  totalVendido: number;
}

interface ItensMaisVendidosListProps {
  titulo: string;
  itens: ItemMaisVendido[];
}

export function ItensMaisVendidosList({ titulo, itens }: ItensMaisVendidosListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">{titulo}</h2>
      {itens.length === 0 ? (
        <p className="text-gray-600">Nenhum item vendido neste período.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {itens.map((item, idx) => (
            <li key={idx} className="py-2 flex justify-between">
              <span className="font-medium text-gray-700">{item.nome}</span>
              <span className="text-gray-600">{item.totalVendido} vendidos</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
