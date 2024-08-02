import { PrismaClient } from "@prisma/client";
import { Relatorio } from '../types/Relatorio.type';
import { RelatorioData as ReportDTO } from '../types/Relatorio.type';

const relatorioClient = new PrismaClient().relatorio;

export const findById = async (id: number): Promise<Relatorio | false> => {
    try {
        const relatorio = await relatorioClient.findUnique({
            where: {
                impressoraId: id,
            },
        });
        return relatorio;
    }
    catch (error) {
        console.error("Erro ao buscar relatório: ", error);
        return false;
    }
}

export const updateReport = async (id: number, reportDTO: ReportDTO): Promise<Relatorio | false> => {
    try {
        const updatedReport = await relatorioClient.update({
            where: { id: id },
            data: {
                contadorPB: reportDTO.blackWhiteCount,
                contadorCor: reportDTO.colorCount,
                ultimoResultado: reportDTO.previousGrowth,
                resultadoAtual: reportDTO.currentGrowth,
                ultimaAtualizacao: reportDTO.newReportDate,
                contadorPBDiff: reportDTO.blackWhiteCountDiff,
                contadorCorDiff: reportDTO.colorCountDiff,
            }
        });

        return updatedReport;
    } catch (error) {
        console.error("Erro ao editar padrão de impressora", error);
        return false
    }
}

