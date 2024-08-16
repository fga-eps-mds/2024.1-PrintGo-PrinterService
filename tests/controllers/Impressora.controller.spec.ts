import request from 'supertest';
import { server } from '../../src/server';

function generateRandomSerialNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return `${randomNumber}`;
}

describe('Impressora Controller', () => {
    let impressoraId: number;
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

    afterAll(() => {
        server.close();
    });

    it('should create a new printer and return a 201 status', async () => {
        const response = await request(server)
            .post('/')
            .send(defaultPrinter);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Sucesso: Impressora cadastrada com sucesso!');
        expect(response.body.data).toHaveProperty('numSerie');
        impressoraId = response.body.data.id;
    });

    it('should generate an error if any field is invalid', async () => {
        let data = { defaultPrinter, ...{ test: test } }

        const response = await request(server)
            .post('/')
            .send(data);

        expect(response.status).toBe(400);
    });

    it('should return a 500 status and an error message on database error in creation', async () => {
        jest.spyOn(require('../../src/repository/Impressora.repository'), 'findImpressoraByNumSerie')
            .mockImplementationOnce(() => {
                true
            });

        jest.spyOn(require('../../src/repository/Impressora.repository'), 'createImpressora')
            .mockImplementationOnce(() => {
                false
            });

        const response = await request(server)
            .post('/')
            .send(defaultPrinter);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro: Não foi possível criar uma impressora.');

        jest.restoreAllMocks();
    });

    it('should return 500 status from try/catch', async () => {
        jest.spyOn(require('../../src/repository/Impressora.repository'), 'findImpressoraByNumSerie')
            .mockImplementationOnce(() => {
                throw new Error('Database error');
            });

        jest.spyOn(require('../../src/repository/Impressora.repository'), 'createImpressora')
            .mockImplementationOnce(() => {
                throw new Error('Database error');
            });

        const response = await request(server)
            .post('/')
            .send(defaultPrinter);

        expect(response.status).toBe(200);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Database error');

        jest.restoreAllMocks();
    });

    it('should generate an error trying to create a printer that exists', async () => {
        const response = await request(server)
            .post('/')
            .send(defaultPrinter);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Erro: Impressora já existe.');
    });

    it('should list all printers and return a 200 status', async () => {
        const response = await request(server)
            .get('/');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sucesso: Impressoras listadas com sucesso!');
        expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return a 500 status and an error message', async () => {
        jest.spyOn(require('../../src/repository/Impressora.repository'), 'listImpressoras')
            .mockImplementationOnce(() => {
                false
            });

        const response = await request(server)
            .get('/');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro: Não foi possível listar impressoras.');

        jest.restoreAllMocks();
    });


    it('should return a 500 status and an error message on database error printer list', async () => {
        jest.spyOn(require('../../src/repository/Impressora.repository'), 'listImpressoras')
            .mockImplementationOnce(() => {
                throw new Error('Database error');
            });

        const response = await request(server)
            .get('/');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro: Ocorreu um erro ao listar as impressoras.');

        jest.restoreAllMocks();
    });

    it('should return a 500 status and treat an exception', async () => {
        jest.spyOn(require('../../src/repository/Impressora.repository'), 'listImpressoras')
            .mockImplementationOnce(() => {
                throw new Error('Database error');
            });

        const response = await request(server)
            .get('/');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Erro: Ocorreu um erro ao listar as impressoras.');

        jest.restoreAllMocks();
    });

    it('should update an existing printer and return a 200 status', async () => {
        const updatedPrinter = {
            ...defaultPrinter,
            contadorAtualPB: 1300,
            contadorAtualCor: 700,
        };

        const response = await request(server)
            .patch(`/${impressoraId}`)
            .send(updatedPrinter);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sucesso: Impressora atualizada com sucesso!');
        expect(response.body.data).toHaveProperty('contadorAtualPB', 1300);
        expect(response.body.data).toHaveProperty('contadorAtualCor', 700);
    });

    it('should return a 400 status if the printer ID is invalid', async () => {
        const response = await request(server)
            .patch(`/invalid-id`)
            .send(defaultPrinter);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Erro: ID inválido.');
    });

    it('should return a 404 status if the printer is not found', async () => {
        const response = await request(server)
            .patch(`/99999`)
            .send(defaultPrinter);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Erro: Impressora não encontrada.');
    });

    it('should delete an existing printer and return a 200 status', async () => {
        const response = await request(server)
            .delete(`/${impressoraId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sucesso: Impressora desativada com sucesso!');
    });

    it('should return a 404 status if the printer to delete is not found', async () => {
        const response = await request(server)
            .delete(`/99999`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Erro: Impressora não encontrada.');
    });

    it('should return a 400 status if the printer ID to delete is invalid', async () => {
        const response = await request(server)
            .delete(`/invalid-id`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Erro: ID inválido.');
    });

    it('should return the impressora when a valid id is provided', async () => {
        const response = await request(server).get(`/${impressoraId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', impressoraId);
        expect(response.body).toHaveProperty('numContrato', '12345');
    });

    it('should return 404 when the impressora is not found', async () => {
        const nonExistentId = 9999;
        const response = await request(server).get(`/${nonExistentId}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Erro: Impressora não encontrada.');
    });

    it('should return 400 for an invalid id', async () => {
        const response = await request(server).get('/invalidId');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Erro: ID inválido.');
    });

    it('should list impressoras reports and return a 200 status', async () => {
        const response = await request(server).get('/reports');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sucesso: Impressoras listadas com sucesso!');
        expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return 500 status and an error message', async () => {
        jest.spyOn(require('../../src/repository/Impressora.repository'), 'listImpressorasRelatorio')
            .mockImplementationOnce(() => {
                false
            });

        const response = await request(server)
            .get('/reports');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro: Não foi possível listar impressoras.');

        jest.restoreAllMocks();
    });
});

