import { Impressora } from '../../types/Impressora.type';
import { RelatorioData as ReportData } from '../../types/Relatorio.type';
import { createReport } from './generate.pdf';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const generateReport = (impressora: Impressora): ReportData => {
    const {
        relatorio,
        numSerie,
        numContrato,
        dataInstalacao,
        localizacao,
        modeloId,
        contadorAtualPB,
        contadorAtualCor
    } = impressora;

    const reportPB: number = contadorAtualPB - relatorio.contadorPB;
    const reportCor: number = contadorAtualCor - relatorio.contadorCor;
    const reportLocation: string = `${localizacao.split(';')[0]}, ${localizacao.split(';')[1]} - ${localizacao.split(';')[2]}`;
    const reportCurrentGrowth: number = (reportPB + reportCor) / (relatorio.contadorPB + relatorio.contadorCor) * 100;

    return {
        lastReportDate: relatorio.ultimaAtualizacao,
        newReportDate: new Date(),
        printerSerial: numSerie,
        contractNumber: numContrato,
        installationDate: dataInstalacao,
        blackWhiteCount: contadorAtualPB,
        blackWhiteCountDiff: reportPB,
        colorCount: contadorAtualCor,
        colorCountDiff: reportCor,
        location: reportLocation,
        model: modeloId,
        previousGrowth: relatorio.resultadoAtual,
        currentGrowth: reportCurrentGrowth,
    }
}

export const generateMonthReport = (impressora: Impressora): ReportData => {
    const {
        relatorio,
        numSerie,
        numContrato,
        dataInstalacao,
        localizacao,
        modeloId,
    } = impressora;

    const reportLocation: string = `${localizacao.split(';')[0]}, ${localizacao.split(';')[1]} - ${localizacao.split(';')[2]}`;
    return {
        lastReportDate: relatorio.ultimaAtualizacao,
        newReportDate: new Date(),
        printerSerial: numSerie,
        contractNumber: numContrato,
        installationDate: dataInstalacao,
        blackWhiteCount: relatorio.contadorPB,
        blackWhiteCountDiff: relatorio.contadorPBDiff,
        colorCount: relatorio.contadorCor,
        colorCountDiff: relatorio.contadorCorDiff,
        location: reportLocation,
        model: modeloId,
        previousGrowth: relatorio.ultimoResultado,
        currentGrowth: relatorio.resultadoAtual,
    }
}

export const createPdf = async (reportData: ReportData): Promise<string | false> => {
    try {
        const pdfBuffer = await createReport(reportData);
        const fileName: string = uuidv4() + '.pdf'; // Usando uuidv4 para gerar um identificador único
        const filePath: string = `./printer_reports/${fileName}`;
        // Escreve o buffer do PDF em um arquivo e cria diretório caso não exista
        fs.mkdirSync('./printer_reports', { recursive: true });
        // Escreve o buffer do PDF em um arquivo
        fs.writeFileSync(filePath, pdfBuffer);
        console.log('PDF gerado com sucesso!');
        return filePath;
    } catch (err) {
        console.error('Erro ao gerar o PDF:', err);
        return false;
    }
};


