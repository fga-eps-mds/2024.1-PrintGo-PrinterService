import { 
    listImpressoras,
    findImpressora, 
    findImpressoraByNumSerie, 
    createImpressora, 
    updateImpressora, 
    deleteImpressora, 
    updateContadores, 
    listImpressorasLocalizacao,
    getDashboardData 
} from '../../src/repository/Impressora.repository';
import { server } from '../../src/server';
import { prisma } from '../../src/database';
import { Impressora } from '@prisma/client';
import { getPrinterModelIdsByColor } from '../../src/repository/Padrao.repository';
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

    afterAll(() => {
        server.close();
    });

    afterEach(async () => {
        await prisma.relatorio.deleteMany({});
        await prisma.impressora.deleteMany({});
        await prisma.padrao.deleteMany({});
        jest.clearAllMocks();
    });

    const criaPadrao = async (modelo: string) => {
        const dadosPadrao = padraoExemplo;
        dadosPadrao.modelo = modelo;
        return await prisma.padrao.create({ data: dadosPadrao });
    };

    const criaImpressora = async (data) => {
        return await prisma.impressora.create({ data: data });
    };

    it('should list all impressoras', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const createdPrinterId = printerData.id;


        const result = await listImpressoras();
        expect(Array.isArray(result)).toBe(true);
    });

    it('should find an impressora by ID', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const createdPrinterId = printerData.id;

        const result = await findImpressora(createdPrinterId);
        expect(result).not.toBe(false);
        expect(result).toHaveProperty('id', createdPrinterId);
    });

    it('should find an impressora by numSerie', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const createdPrinterId = printerData.id;

        const result = await findImpressoraByNumSerie(defaultPrinter.numSerie);
        expect(result).not.toBe(false);
        expect(result).toHaveProperty('numSerie', defaultPrinter.numSerie);
    });

    it('should update an impressora', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const createdPrinterId = printerData.id;

        const updateData = { localizacao: 'Updated Location' };
        const result = await updateImpressora(createdPrinterId, updateData);
        expect(result).not.toBe(false);
        expect(result).toHaveProperty('localizacao', 'Updated Location');
    });

    it('should deactivate (delete) an impressora', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const createdPrinterId = printerData.id;

        const result = await deleteImpressora(createdPrinterId);
        expect(result).not.toBe(false);
        expect(result).toHaveProperty('ativo', false);
    });

    it('should update printer counter', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const createdPrinterId = printerData.id;

        const updateData = {
            contadorAtualPB: 1300,
            contadorAtualCor: 700,
        };
        const result = await updateContadores(createdPrinterId, updateData);
        expect(result).not.toBe(false);
    });

    it('should list printers by localization', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const localizacao = defaultPrinter.localizacao;

        const result = await listImpressorasLocalizacao(localizacao);
        expect(Array.isArray(result)).toBeTruthy();

        const resultArray = result as Impressora[];
        expect(resultArray.length).toBe(1);
    });

    it('should list printers by city', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const localizacao = defaultPrinter.localizacao;

        const result = await listImpressorasLocalizacao(localizacao, true, false, false);
        expect(Array.isArray(result)).toBeTruthy();

        const resultArray = result as Impressora[];
        expect(resultArray.length).toBe(1);
    });

    it('should list printers by regional', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const localizacao = defaultPrinter.localizacao;

        const result = await listImpressorasLocalizacao(localizacao, true, true, false);
        expect(Array.isArray(result)).toBeTruthy();

        const resultArray = result as Impressora[];
        expect(resultArray.length).toBe(1);
    });

    it('should list printers by unit', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const localizacao = defaultPrinter.localizacao;

        const result = await listImpressorasLocalizacao(localizacao, true, true, true);
        expect(Array.isArray(result)).toBeTruthy();

        const resultArray = result as Impressora[];
        expect(resultArray.length).toBe(1);
    });

    it('should list no printers by localization', async () => {
        const printerData = await criaImpressora(defaultPrinter);
        const localizacao = "A;B;C";

        const result = await listImpressorasLocalizacao(localizacao);
        expect(Array.isArray(result)).toBeTruthy();

        const resultArray = result as Impressora[];
        expect(resultArray.length).toBe(0);
    });

    it('should return the correct dashboard data in getDashboardData', async () => {
        const padrao = await criaPadrao("modelo1");
        const impressoraData = {...defaultPrinter, modeloId: padrao.id.toString()};
        const impressora = await criaImpressora(impressoraData);

        const result = await getDashboardData();

        expect(result.impressoras).toHaveLength(1);
        expect(result.totalColorPrinters).toBe(0);
        expect(result.totalPbPrinters).toBe(1);
    });
});
