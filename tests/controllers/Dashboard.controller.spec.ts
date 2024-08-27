import request from 'supertest';
import { server } from '../../src/server';
import { prisma } from '../../src/database';

describe("Dashboard Controller", () => {
    afterAll(() => {
        server.close();
    });

    afterEach(async () => {
        await prisma.impressora.deleteMany({});
        await prisma.padrao.deleteMany({});
    });

    const defaultPrinter = {
        modeloId: "modeloXYZ",
        enderecoIp: "192.168.1.100",
        numContrato: "12345",
        numSerie: "12345",
        estaNaRede: true,
        localizacao: "Anápolis;Workstation A;SubWorkstation 1",
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

    describe("GET /total-impressoes", () => {
        it("should return the total number of copies", async () => {
            const printer1 = {...defaultPrinter, contadorAtualPB: 100, contadorAtualCor: 50};
            const printer2 = {...defaultPrinter, numSerie: "54321", contadorAtualPB: 200, contadorAtualCor: 150};

            await prisma.impressora.createMany({
                data: [printer1, printer2],
            });

            const res = await request(server).get('/dashboard/total-impressoes');

            expect(res.status).toBe(200);
            expect(res.body.totalImpressions).toBe(500); // 100+50+200+150
        });

        it("should return 500 if there is an error calculating total copies", async () => {
            jest.spyOn(prisma.impressora, 'aggregate').mockImplementationOnce(() => {
                throw new Error("Database Error");
            });

            const res = await request(server).get('/dashboard/total-impressoes');

            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Erro ao calcular impressões totais.");
        });
    });

    describe("GET /color-printers", () => {
        it("should return the number of color printers", async () => {
            const padraoColor = {...defaultPadrao, colorido: true};
            const padrao = await prisma.padrao.create({
                data: padraoColor,
            });
            const printer = {...defaultPrinter, modeloId: padrao.id.toString()};

            await prisma.impressora.create({
                data: printer,
            });

            const res = await request(server).get('/dashboard/color-printers');

            expect(res.status).toBe(200);
            expect(res.body.colorPrintersCount).toBe(1);
        });

        it("should return 500 if there is an error calculating color printers count", async () => {
            jest.spyOn(prisma.impressora, 'count').mockImplementationOnce(() => {
                throw new Error("Database Error");
            });

            const res = await request(server).get('/dashboard/color-printers');

            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Erro ao calcular o número de impressoras coloridas.");
        });
    });

    describe("GET /pb-printers", () => {
        it("should return the number of black and white printers", async () => {
            const padraoPB = {...defaultPadrao, colorido: false};
            const padrao = await prisma.padrao.create({
                data: padraoPB,
            });
            const printer = {...defaultPrinter, modeloId: padrao.id.toString()};

            await prisma.impressora.create({
                data: printer,
            });

            const res = await request(server).get('/dashboard/pb-printers');

            expect(res.status).toBe(200);
            expect(res.body.PbPrintersCount).toBe(1);
        });

        it("should return 500 if there is an error calculating black and white printers count", async () => {
            jest.spyOn(prisma.impressora, 'count').mockImplementationOnce(() => {
                throw new Error("Database Error");
            });

            const res = await request(server).get('/dashboard/pb-printers');

            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Erro ao calcular o número de impressoras pretas e brancas.");
        });
    });

    describe("GET /impressions-by-location", () => {
        it("should return the sum of counters by location", async () => {
            const printer1 = {...defaultPrinter, contadorAtualPB: 100, contadorAtualCor: 50};
            const printer2 = {...defaultPrinter, numSerie: "54321", contadorAtualPB: 200, contadorAtualCor: 150};
            await prisma.impressora.createMany({
                data: [printer1, printer2],
            });

            const res = await request(server).get('/dashboard/impressions-by-location');

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual([
                { localizacao: "Anápolis;Workstation A;SubWorkstation 1", totalPB: 300, totalCor: 200 }
            ]);
        });
    });

    describe("GET /equipment-by-location", () => {
        it("should return the equipment count by location", async () => {
            const printer1 = defaultPrinter;
            const printer2 = {...defaultPrinter, numSerie: "54321"};
            await prisma.impressora.createMany({
                data: [printer1, printer2],
            });

            const res = await request(server).get('/dashboard/equipment-by-location');

            console.log(res.body)

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual([
                {localizacao: "Anápolis;Workstation A;SubWorkstation 1", totalEquipamentos: 2}
            ]);
        });
    });
});
