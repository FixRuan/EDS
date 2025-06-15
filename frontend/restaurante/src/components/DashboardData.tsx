import { useEffect, useState } from "react";
import axios from "axios";

interface FaturamentoDashboard {
  diario: number;
  semanal: number;
  mensal: number;
}

interface ItemMaisVendido {
  nome: string;
  totalVendido: number;
}

interface ItensMaisVendidosResponse {
  diario: ItemMaisVendido[];
  semanal: ItemMaisVendido[];
  mensal: ItemMaisVendido[];
}

export function useDashboardData() {
  const [faturamento, setFaturamento] = useState<FaturamentoDashboard>({
    diario: 0,
    semanal: 0,
    mensal: 0,
  });
  const [itensMaisVendidos, setItensMaisVendidos] = useState<ItensMaisVendidosResponse>({
    diario: [],
    semanal: [],
    mensal: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token não encontrado. Faça login novamente.");
          setLoading(false);
          return;
        }

        const [faturamentoRes, maisVendidosRes] = await Promise.all([
          axios.get<FaturamentoDashboard>("http://localhost:3000/admin/dashboard/faturamento", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<ItensMaisVendidosResponse>("http://localhost:3000/admin/dashboard/mais-vendidos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFaturamento(faturamentoRes.data);
        setItensMaisVendidos(maisVendidosRes.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { faturamento, itensMaisVendidos, loading, error };
}
