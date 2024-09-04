import request from 'supertest';
import express from 'express';
import { prisma } from '../../src/database';
import dashboardRoutes from '../../src/routes/dashboard.route';
import * as dashboardRepository from '../../src/repository/Impressora.repository'; 
import { server } from '../../src/server';

function generateRandomSerialNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return `${randomNumber}`;
}

describe("Dashboard Controller", () => {
    const app = express();
    app.use(express.json());
    app.use('/dashboard', dashboardRoutes); 

    beforeEach(async () => {
        await prisma.impressora.deleteMany({});
        await prisma.padrao.deleteMany({});
    });




    const defaultPrinter = {
        modeloId: "modeloXYZ",
        enderecoIp: "192.168.1.100",
        numContrato: "12345",
        numSerie: generateRandomSerialNumber(),
        estaNaRede: true,
        localizacao: "Goiânia;Workstation A;Workstation B",
        dataInstalacao: "2024-01-01T00:00:00.000Z",
        contadorInstalacaoPB: 0,
        contadorInstalacaoCor: 0,
        contadorRetiradaPB: 0,
        contadorRetiradaCor: 0,
        contadorAtualPB: 100,
        contadorAtualCor: 50,
        ativo: true,
    };
    
    const defaultPadrao = {
        id: 1,
        modelo: "Imprime Baixo 3000",
        marca: "Epston",
        colorido: false,
        tipo: "Multifuncional laser colorido",
        oidModelo: "1.3.6.1.2.1.1.1.0",
        oidNumeroSerie: "1.3.6.1.2.1.43.5.1.1.17.1",
        oidFirmware: "1.3.6.1.2.1.43.5.1.1.16.1",
        oidTempoAtivo: "1.3.6.1.2.1.1.3.0",
        oidDigitalizacoes: "1.3.6.1.2.1.43.10.2.1.4.1.1",
        oidCopiasPB: "1.3.6.1.2.1.43.10.2.1.4.1.2",
        oidTotalGeral: "1.3.6.1.2.1.43.10.2.1.4.1.4"
    }

    describe("GET /filtro-opcoes", () => {
        it("should return the filter options", async () => {
            const printer1 = { ...defaultPrinter, numSerie: generateRandomSerialNumber(), dataContador: new Date('2024-08-01') };
            const printer2 = { ...defaultPrinter, numSerie: generateRandomSerialNumber(), dataContador: new Date('2024-07-01') };

            await prisma.impressora.createMany({
                data: [printer1, printer2],
            });

            const res = await request(app).get('/dashboard/filtro-opcoes');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                cidades: ['Goiânia'],
                regionais: ['Workstation A'],
                unidades: ['Workstation B'],
                periodos: ['2024-08', '2024-07'],
            });
        });

        it("should return 500 if there is an error fetching filter options", async () => {
    
            const mockGetFiltroOpcoes = jest.spyOn(dashboardRepository, 'getFiltroOpcoes').mockImplementationOnce(() => {
                throw new Error("Database Error");
            });

            const res = await request(app).get('/dashboard/filtro-opcoes');


            expect(mockGetFiltroOpcoes).toHaveBeenCalled();

            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Erro ao buscar opções de filtro.");
        });
    });
    describe("GET /dashboard-data", () => {
        it("should return the dashboard data", async () => {
            const padraoColor = { ...defaultPadrao, modelo: "colorModel", colorido: true, id:2 };
            const padraoPB = { ...defaultPadrao, modelo: "pbModel"};

            await prisma.padrao.createMany({
                data: [padraoColor, padraoPB],
            });

            const printer1 = { ...defaultPrinter, numSerie: generateRandomSerialNumber(), modeloId: padraoColor.id.toString() };
            const printer2 = { ...defaultPrinter, numSerie: generateRandomSerialNumber(), modeloId: padraoPB.id.toString() };
            const printer3 = { ...defaultPrinter, numSerie: generateRandomSerialNumber(), modeloId: padraoPB.id.toString() };

            await prisma.impressora.createMany({
                data: [printer1, printer2, printer3],
            });

            const res = await request(app).get('/dashboard/dashboard-data');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                impressoras: expect.arrayContaining([
                    expect.objectContaining({
                        localizacao: printer1.localizacao,
                        dataContador: null,
                        contadorAtualPB: 100,
                        contadorAtualCor: 50,
                        modeloId: padraoColor.id.toString(),
                    }),
                    expect.objectContaining({
                        localizacao: printer2.localizacao,
                        dataContador: null,
                        contadorAtualPB: 100,
                        contadorAtualCor: 50,
                        modeloId: padraoPB.id.toString(),
                    }),
                    expect.objectContaining({
                        localizacao: printer3.localizacao,
                        dataContador: null,
                        contadorAtualPB: 100,
                        contadorAtualCor: 50,
                        modeloId: padraoPB.id.toString(), 
                    }),
                ]),
                totalColorPrinters: 1,
                totalPbPrinters: 2,
                colorModelIds: [padraoColor.id.toString()],
                pbModelIds: [padraoPB.id.toString()],
            });
        });

        it("should return 500 if there is an error fetching dashboard data", async () => {
            const mockGetDashboardData = jest.spyOn(dashboardRepository, 'getDashboardData').mockImplementationOnce(() => {
                throw new Error("Database Error");
            });

            const res = await request(app).get('/dashboard/dashboard-data');

            expect(mockGetDashboardData).toHaveBeenCalled();
            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Erro ao buscar os dados do dashboard.");
        });
    });
});


