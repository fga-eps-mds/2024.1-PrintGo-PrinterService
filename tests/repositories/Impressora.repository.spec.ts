import { listImpressoras, findImpressora, findImpressoraByNumSerie, createImpressora, updateImpressora, deleteImpressora } from '../../src/repository/Impressora.repository';
import request from 'supertest';
import { server } from '../../src/server';

function generateRandomSerialNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return `${randomNumber}`;
}

describe('Impressora Service Integration Tests', () => {
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

    afterAll(() => {
        server.close();
    });

    it('should list all impressoras', async () => {
        const res = await request(server)
            .post('/')
            .send(defaultPrinter);
        createdPrinterId = res.body.data.id;

        const result = await listImpressoras();
        expect(Array.isArray(result)).toBe(true);
    });

    it('should find an impressora by ID', async () => {
        const result = await findImpressora(createdPrinterId);
        expect(result).not.toBe(false);
        expect(result).toHaveProperty('id', createdPrinterId);
    });

    it('should find an impressora by numSerie', async () => {
        const result = await findImpressoraByNumSerie(defaultPrinter.numSerie);
        expect(result).not.toBe(false);
        expect(result).toHaveProperty('numSerie', defaultPrinter.numSerie);
    });

    it('should update an impressora', async () => {
        const updateData = { localizacao: 'Updated Location' };
        const result = await updateImpressora(createdPrinterId, updateData);
        expect(result).not.toBe(false);
        expect(result).toHaveProperty('localizacao', 'Updated Location');
    });

    it('should deactivate (delete) an impressora', async () => {
        const result = await deleteImpressora(createdPrinterId);
        expect(result).not.toBe(false);
        expect(result).toHaveProperty('ativo', false);
    });
});

