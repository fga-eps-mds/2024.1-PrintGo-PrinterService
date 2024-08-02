import { RelatorioData as ReportDTO } from '../../types/Relatorio.type';
import { Impressora } from '../../types/Impressora.type';
import { generateReport } from './generate.report';
import { updateReport as editReport } from '../../repository/Report.repository';

export const updateReport = async (impressora: Impressora): Promise<void> => {
    const { relatorio } = impressora;

    if (!relatorio) {
        console.log('Relatório não encontrado para a impressora');
        return;
    }

    const now = new Date();
    const lastUpdated = new Date(relatorio.ultimaAtualizacao);

    const diffInMillis = now.getTime() - lastUpdated.getTime();
    const diffInDays = diffInMillis / (1000 * 60 * 60 * 24);

    if (diffInDays < 30) {
        console.log('Não passaram 30 dias desde a última atualização.');
        return;
    }

    const reportData: ReportDTO = generateReport(impressora);
    console.log(reportData);

    try {
        console.log(await editReport(relatorio.id, reportData));
    } catch (error) {
        console.error('Erro ao atualizar o relatório:', error);
    }
};
