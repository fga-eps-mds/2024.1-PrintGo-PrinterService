import request from 'supertest';
import { server } from '../../src/server';
import { prisma } from '../../src/database';
import fs from 'fs';


function generateRandomSerialNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return `${randomNumber}`;
}

describe("Report Controller", () => {

    afterAll(() => {
        server.close();
    });

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

    let impressoraId: number;

    beforeAll(async () => {
        let response = await prisma.impressora.create({
            data: defaultPrinter
        });

        impressoraId = response.id;
    });


    describe("List Reports by Contract", () => {
        const url = '/report/contract/12345';

        it('should list all printers and return a 200 status', async () => {
            const response = await request(server)
                .get(url);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Sucesso: Impressoras listadas com sucesso!');
            expect(response.body.data).toBeInstanceOf(Array);
        });

        it('should return a 500 status and an error message on database error in listing', async () => {
            jest.spyOn(require('../../src/repository/Impressora.repository'), 'listImpressorasContract')
                .mockImplementationOnce(() => {
                    return false;
                });

            const response = await request(server)
                .get(url);

            expect(response.status).toBe(500);
            expect(response.body.error).toBe(undefined);
            expect(response.body.message).toBe('Erro: Não foi possível listar impressoras.');

            jest.restoreAllMocks();
        });

        it('should return a 500 status and an error message on exception in listing', async () => {
            jest.spyOn(require('../../src/repository/Impressora.repository'), 'listImpressorasContract')
                .mockImplementationOnce(() => {
                    throw new Error();
                });

            const response = await request(server)
                .get(url);

            expect(response.status).toBe(500);
            expect(response.body.error).toBe(true);

            jest.restoreAllMocks();
        });
    });

    describe("Retrieve Report", () => {
        const url = '/report/';

        it('should retrieve a report and return a 500 status', async () => {
            const response = await request(server).get(url + impressoraId.toString());

            expect(response.status).toBe(500);
            jest.restoreAllMocks();
        });

        it('should return a 500 status and an error message on database error in retrieving', async () => {
            jest.spyOn(require('../../src/repository/Impressora.repository'), 'findImpressoraWithReport')
                .mockImplementationOnce(() => {
                    return false;
                });

            const response = await request(server)
                .get(url + impressoraId.toString());

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Relatório não encontrado");

            jest.restoreAllMocks();
        });

        it('should return a 500 status and an error message on exception in retrieving', async () => {
            jest.spyOn(require('../../src/usecases/report/generate.report'), 'createPdf')
                .mockImplementationOnce(() => {
                    return false
                });

            jest.spyOn(require('../../src/usecases/report/generate.report'), 'generateReport')
                .mockImplementationOnce(() => {
                    return false
                });

            const response = await request(server)
                .get(url + impressoraId.toString());

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });

    describe("Retrieve Month Report", () => {
        const url = '/report/month/';

        it('should retrieve a report and return a 500 status', async () => {
            const response = await request(server).get(url + impressoraId.toString());

            expect(response.status).toBe(500);
            jest.restoreAllMocks();
        });

        it('should return a 500 status and an error message on database error in retrieving month report', async () => {
            jest.spyOn(require('../../src/repository/Impressora.repository'), 'findImpressoraWithReport')
                .mockImplementationOnce(() => {
                    return false;
                });

            const response = await request(server)
                .get(url + impressoraId.toString());

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Relatório não encontrado");

            jest.restoreAllMocks();
        });

        it('should return a 500 status and an error message on exception in retrieving month report', async () => {
            jest.spyOn(require('../../src/usecases/report/generate.report'), 'createPdf')
                .mockImplementationOnce(() => {
                    return false
                });

            jest.spyOn(require('../../src/usecases/report/generate.report'), 'generateMonthReport')
                .mockImplementationOnce(() => {
                    return false
                });

            const response = await request(server)
                .get(url + impressoraId.toString());

            expect(response.status).toBe(500);

            jest.restoreAllMocks();
        });
    });
});
