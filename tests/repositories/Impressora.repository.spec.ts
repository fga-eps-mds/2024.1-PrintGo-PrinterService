import { listImpressoras, findImpressora, findImpressoraByNumSerie, createImpressora, updateImpressora, deleteImpressora, updatePrinterCounts } from '../../src/repository/Impressora.repository';
import request from 'supertest';
import { server } from '../../src/server';
import { prisma } from '../../src/database';
import { resolveSoa } from 'dns';
const snmp = require("net-snmp");

function generateRandomSerialNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return `${randomNumber}`;
}

jest.mock('net-snmp', () => {
    return {
        createSession: jest.fn().mockReturnValue({
            get: jest.fn(),
            close: jest.fn(),
        }),
        isVarbindError: jest.fn(),
        varbindError: jest.fn()
    };
});

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

    const padraoExemplo = {
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
    };

    let createdPrinterId = 0;

    afterAll(() => {
        server.close();
    });

    afterEach(async () => {
        await prisma.relatorio.deleteMany({});
        await prisma.impressora.deleteMany({});
        await prisma.padrao.deleteMany({});
    });

    const criaPadrao = async (modelo: string) => {
        const dadosPadrao = padraoExemplo;
        dadosPadrao.modelo = modelo;
        await prisma.padrao.create({data: dadosPadrao});
    };

    const criaImpressora = async (data) => {
        await prisma.impressora.create({data: data});
    };

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

    it("should update printer counters", async () => {
        await criaPadrao("modelo1");
        const padrao = await prisma.padrao.findFirst({where: {modelo:"modelo1"}});
        const modeloId = padrao.id;

        let impressoraData = defaultPrinter;
        impressoraData.modeloId = modeloId.toString();
        await criaImpressora(impressoraData);
        const impressora = await prisma.impressora.findFirst({where: {modeloId: modeloId.toString()}});
        console.log(impressora)
        const impressoraId = impressora.id;
            
        const mockVarbinds = [
            { oid: "1.3.6.1.2.1.1.1.0", value: "modelo" },
            { oid: "1.3.6.1.2.1.43.5.1.1.17.1", value: "123456" },
            { oid: "1.3.6.1.2.1.43.5.1.1.16.1", value: "1.1.0" },
            { oid: "1.3.6.1.2.1.1.3.0", value: 10 },
            { oid: "1.3.6.1.2.1.43.10.2.1.4.1.1", value: 0 },
            { oid: "1.3.6.1.2.1.43.10.2.1.4.1.2", value: 10_001 },
            { oid: "1.3.6.1.2.1.43.10.2.1.4.1.4", value: 10_001 }
        ];
    
        snmp.isVarbindError.mockReturnValue(false);
        snmp.createSession().get.mockImplementation((oids, callback) => {
          callback(null, mockVarbinds);
        });
    
        await updatePrinterCounts();

        const impressoraAtualizada = await prisma.impressora.findUnique({where: {id: impressoraId}});

        expect(impressoraAtualizada.contadorAtualPB).toBe(10_001);
    });
});
