import { generateReport, generateMonthReport, createPdf } from '../../src/usecases/report/generate.report';
import { createReport } from '../../src/usecases/report/generate.pdf';
import { Impressora } from '../../src/types/Impressora.type';
import { RelatorioData as ReportData } from '../../src/types/Relatorio.type';
import fs from 'fs';

jest.mock('fs', () => ({
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn(),
}));

describe('generateReport', () => {
    it('should generate a report', () => {
        const impressora: Impressora = {
            id: 1,
            enderecoIp: 'test ip',
            estaNaRede: true,
            dataInstalacao: new Date(),
            ativo: true,
            contadorInstalacaoPB: 100,
            contadorInstalacaoCor: 200,
            contadorAtualPB: 100,
            contadorAtualCor: 200,
            localizacao: 'test location',
            modeloId: 'test model',
            numContrato: '456',
            numSerie: '123',
            relatorio: {
                id: 1,
                contadorPBDiff: 0,
                contadorCorDiff: 0,
                contadorPB: 0,
                contadorCor: 0,
                resultadoAtual: 0,
                ultimaAtualizacao: new Date(),
                impressoraId: 1,
                ultimoResultado: 0,

            },
        };

        const result = generateReport(impressora);
        expect(result).toBeDefined();
    });
});

describe('generateMonthReport', () => {
    it('should generate a monthly report', () => {
        const impressora: Impressora = {
            id: 1,
            enderecoIp: 'test ip',
            estaNaRede: true,
            dataInstalacao: new Date(),
            ativo: true,
            contadorInstalacaoPB: 100,
            contadorInstalacaoCor: 200,
            contadorAtualPB: 100,
            contadorAtualCor: 200,
            localizacao: 'test location',
            modeloId: 'test model',
            numContrato: '456',
            numSerie: '123',
            relatorio: {
                id: 1,
                contadorPBDiff: 0,
                contadorCorDiff: 0,
                contadorPB: 0,
                contadorCor: 0,
                resultadoAtual: 0,
                ultimaAtualizacao: new Date(),
                impressoraId: 1,
                ultimoResultado: 0,

            },
        };

        const result = generateMonthReport(impressora);
        expect(result).toBeDefined();
    });
});

jest.mock('fs', () => ({
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn(),
}));

jest.mock('../../src/usecases/report/generate.pdf', () => ({
    createReport: jest.fn(),
}));

describe('createPdf', () => {
    it('should create a PDF', async () => {
        const reportData: ReportData = {
            lastReportDate: new Date(),
            newReportDate: new Date(),
            printerSerial: '123',
            contractNumber: '456',
            installationDate: new Date(),
            blackWhiteCount: 100,
            blackWhiteCountDiff: 0,
            colorCount: 200,
            colorCountDiff: 0,
            location: 'test location',
            model: 'test model',
            previousGrowth: 0,
            currentGrowth: 0,
        };

        (createReport as jest.Mock).mockResolvedValue(Buffer.from('test'));

        const result = await createPdf(reportData);
        expect(result).toContain('.pdf');
        expect(fs.mkdirSync).toHaveBeenCalledWith('./printer_reports', { recursive: true });
        expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should handle errors when creating report', async () => {
        const reportData: ReportData = {
            lastReportDate: new Date(),
            newReportDate: new Date(),
            printerSerial: '123',
            contractNumber: '456',
            installationDate: new Date(),
            blackWhiteCount: 100,
            blackWhiteCountDiff: 0,
            colorCount: 200,
            colorCountDiff: 0,
            location: 'test location',
            model: 'test model',
            previousGrowth: 0,
            currentGrowth: 0,
        };

        (createReport as jest.Mock).mockRejectedValue(new Error('Test error'));

        const result = await createPdf(reportData);
        expect(result).toBe(false);
    });
});
