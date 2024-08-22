import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { server } from '../../src/server';
import { findById, updateReport } from '../../src/repository/Report.repository';
import { RelatorioData as ReportDTO } from '../../src/types/Relatorio.type';

const prisma = new PrismaClient();

function generateRandomSerialNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return `${randomNumber}`;
}

describe('Relatorio Service Integration Tests', () => {
    let createdReportId: number;

    let defaultPrinter = {
        modeloId: "modeloXYZ",
        enderecoIp: "192.168.1.100",
        numContrato: "12345",
        numSerie: generateRandomSerialNumber(),
        estaNaRede: true,
        localizacao: "São Paulo;Workstation A;SubWorkstation 1",
        dataInstalacao: "2024-01-01T00:00:00.000Z",
        contadorInstalacaoPB: 1000,
        contadorInstalacaoCor: 500,
        contadorRetiradaPB: 0,
        contadorRetiradaCor: 0,
        contadorAtualPB: 1200,
        contadorAtualCor: 600,
        ativo: true,
    };

    let createdPrinterId = 0;

    beforeAll(async () => {
        const res = await request(server)
            .post('/')
            .send(defaultPrinter);
        createdPrinterId = res.body.data.id;
    });

    afterAll(async () => {
        server.close();
    });

    it('should find a relatorio by ID', async () => {
        const result = await findById(createdPrinterId);
        expect(result).not.toBe(false);
    });

    it('should not update a relatorio', async () => {
        let createdPrinter = 0;
        let printer = {
            modeloId: "modeloXYZ",
            enderecoIp: "192.168.1.100",
            numContrato: "12345",
            numSerie: generateRandomSerialNumber(),
            estaNaRede: true,
            localizacao: "São Paulo;Workstation A;SubWorkstation 1",
            dataInstalacao: "2024-01-01T00:00:00.000Z",
            contadorInstalacaoPB: 1000,
            contadorInstalacaoCor: 500,
            contadorRetiradaPB: 0,
            contadorRetiradaCor: 0,
            contadorAtualPB: 1200,
            contadorAtualCor: 600,
            ativo: true,
        };

        const res = await request(server)
            .post('/')
            .send(printer);
        createdPrinter = res.body.data.id;

        const updateData: ReportDTO = {
            blackWhiteCount: 1000,
            model: "modeloXYZ",
            location: "São Paulo;Workstation A;SubWorkstation 1",
            printerSerial: "12345",
            contractNumber: "12345",
            lastReportDate: new Date(),
            installationDate: new Date(),
            colorCount: 500,
            previousGrowth: 10,
            currentGrowth: 15,
            newReportDate: new Date(),
            blackWhiteCountDiff: 50,
            colorCountDiff: 30,
        };

        const result = await updateReport(createdPrinter, updateData);
        console.log(result);
        expect(result).not.toBe(false);
    });

    it('should not update a relatorio', async () => {
        const updateData: ReportDTO = {
            blackWhiteCount: 1000,
            model: "modeloXYZ",
            location: "São Paulo;Workstation A;SubWorkstation 1",
            printerSerial: "12345",
            contractNumber: "12345",
            lastReportDate: new Date(),
            installationDate: new Date(),
            colorCount: 500,
            previousGrowth: 10,
            currentGrowth: 15,
            newReportDate: new Date(),
            blackWhiteCountDiff: 50,
            colorCountDiff: 30,
        };

        const result = await updateReport(createdReportId, updateData);
        expect(result).toBe(false);
    });
});

