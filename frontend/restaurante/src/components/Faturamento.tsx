interface FaturamentoCardProps {
  periodo: string;
  valor: number;
  color: string;
  textColor: string;
}

export function FaturamentoCard({ periodo, valor, color, textColor }: FaturamentoCardProps) {
  return (
    <div className={`p-4 rounded shadow ${color}`}>
      <h3 className={`text-lg font-semibold mb-1 ${textColor}`}>{periodo}</h3>
      <p className={`${textColor} text-xl font-bold`}>R$ {valor.toFixed(2)}</p>
    </div>
  );
}
