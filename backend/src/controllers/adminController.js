import * as funcionarioService from '../services/adminService.js';

// Obtem faturamento do dia, semana e mês
export async function obterFaturamento(req, reply) {
  try {
    const hoje = new Date();

    const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const inicioDiaStr = inicioDia.toISOString().slice(0, 19).replace('T', ' ');

    const fimDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);
    const fimDiaStr = fimDia.toISOString().slice(0, 19).replace('T', ' ');

    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - 7);
    const inicioSemanaStr = inicioSemana.toISOString().slice(0, 19).replace('T', ' ');

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const inicioMesStr = inicioMes.toISOString().slice(0, 19).replace('T', ' ');

    const fimPeriodoStr = fimDiaStr;

    const [faturamentoDiario, faturamentoSemanal, faturamentoMensal] = await Promise.all([
      funcionarioService.calcularFaturamentoPeriodo(inicioDiaStr, fimDiaStr),
      funcionarioService.calcularFaturamentoPeriodo(inicioSemanaStr, fimPeriodoStr),
      funcionarioService.calcularFaturamentoPeriodo(inicioMesStr, fimPeriodoStr),
    ]);

    reply.send({
      diario: faturamentoDiario,
      semanal: faturamentoSemanal,
      mensal: faturamentoMensal,
    });
  } catch (error) {
    console.error('Erro ao buscar faturamento do dashboard:', error);
    reply.code(500).send({ message: 'Erro ao obter faturamento.' });
  }
}

// Obtem itens mais vendidos no dia, semana e mês
export async function obterMaisVendidos(req, reply) {
  try {
    const hoje = new Date();

    const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0);
    const fimDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999);

    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - 7);
    inicioSemana.setHours(0, 0, 0, 0);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0, 0, 0, 0);

    const [itensDiarios, itensSemanais, itensMensais] = await Promise.all([
      funcionarioService.calcularItensMaisVendidos(inicioDia.toISOString(), fimDia.toISOString()),
      funcionarioService.calcularItensMaisVendidos(inicioSemana.toISOString(), hoje.toISOString()),
      funcionarioService.calcularItensMaisVendidos(inicioMes.toISOString(), hoje.toISOString()),
    ]);

    reply.send({
      diario: itensDiarios,
      semanal: itensSemanais,
      mensal: itensMensais,
    });
  } catch (error) {
    console.error('Erro ao buscar itens mais vendidos do dashboard:', error);
    reply.code(500).send({ message: 'Erro ao obter itens mais vendidos.' });
  }
}
