import { coletaSnmpRotina, getSnmpData } from "../../src/snmp/snmpUtils";
import snmp from "net-snmp";
import { listImpressorasLocalizacao, updateImpressora } from "../../src/repository/Impressora.repository";
import { getById } from "../../src/repository/Padrao.repository";
import { RotinaSnmp } from "@prisma/client";

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

jest.mock('../../src/repository/Padrao.repository', () => {
    return {
        getById: jest.fn()
    };
});

jest.mock('../../src/repository/Impressora.repository', () => {
    return {
        listImpressorasLocalizacao: jest.fn(),
        updateImpressora: jest.fn()
    };
});

const mockListImpressorasLocalizacao = listImpressorasLocalizacao as jest.Mock;
const mockUpdateImpressora = updateImpressora as jest.Mock;
const mockGetPadrao = getById as jest.Mock;

describe("getSnmpData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return SNMP data", async () => {
        const host = "localhost";
        const oids = ["1.3.6.1.2.1.1.1.0"];

        const mockVarbinds = [
            { oid: "1.3.6.1.2.1.1.1.0", value: "mockValue" },
        ];

        snmp.isVarbindError.mockReturnValue(false);
        snmp.createSession().get.mockImplementation((oids, callback) => {
            callback(null, mockVarbinds);
        });

        const result = await getSnmpData(host, oids);

        expect(snmp.createSession).toHaveBeenCalledWith(host, "public");
        expect(snmp.createSession().get).toHaveBeenCalledWith(oids, expect.any(Function));
        expect(result).toEqual({
            "1.3.6.1.2.1.1.1.0": "mockValue",
        });
    });

    it("should handle errors in SNMP get", async () => {
        const host = "localhost";
        const oids = ["1.3.6.1.2.1.1.1.0"];
        const mockError = new Error("SNMP get error");

        snmp.createSession().get.mockImplementation((oids, callback) => {
            callback(mockError, null);
        });

        await expect(getSnmpData(host, oids)).rejects.toThrow("SNMP get error");

        expect(snmp.createSession).toHaveBeenCalledWith(host, "public");
        expect(snmp.createSession().get).toHaveBeenCalledWith(oids, expect.any(Function));
    });

    it("should handle varbind errors", async () => {
        const host = "localhost";
        const oids = ["1.3.6.1.2.1.1.1.0"];
        const mockVarbinds = [
            { oid: "1.3.6.1.2.1.1.1.0", value: "mockValue" },
        ];

        snmp.isVarbindError.mockReturnValue(true);
        snmp.varbindError.mockReturnValue(new Error("Varbind error"));
        snmp.createSession().get.mockImplementation((oids, callback) => {
            callback(null, mockVarbinds);
        });

        await expect(getSnmpData(host, oids)).rejects.toThrow("Varbind error");

        expect(snmp.createSession).toHaveBeenCalledWith(host, "public");
        expect(snmp.createSession().get).toHaveBeenCalledWith(oids, expect.any(Function));
    });
});

describe('coletaSnmpRotina', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const rotinaData : RotinaSnmp = {
        id: 1,
        localizacao: null,
        dataCriado: new Date("2024-01-01T00:00:00.000Z"),
        dataUltimoUpdate: new Date("2024-02-01T00:00:00.000Z"),
        cronExpression: "0 * * * *",
        ativo: true,
        cidadeTodas: null,
        regionalTodas: null,
        unidadeTodas: null
    };

    it('should call listImpressorasLocalizacao and coletaSnmpAtualizaContadores', async () => {
        const mockImpressoras = [
            { id: '1', modeloId: '1', enderecoIp: '192.168.1.1' },
            { id: '2', modeloId: '2', enderecoIp: '192.168.1.2' },
        ];
        const mockVarbinds = [
            { oid: "1.3.6.1.2.1.1.1.0", value: "mockValue" },
        ];

        snmp.isVarbindError.mockReturnValue(false);
        snmp.createSession().get.mockImplementation((oids, callback) => {
            callback(null, mockVarbinds);
        });

        mockListImpressorasLocalizacao.mockResolvedValue(mockImpressoras);
        mockGetPadrao.mockResolvedValue({ oidModelo: '1.3.6.1.2.1.1.1.0' });
        mockUpdateImpressora.mockResolvedValue(true);


        await coletaSnmpRotina(rotinaData);

        expect(mockListImpressorasLocalizacao).toHaveBeenCalledWith(rotinaData.localizacao);
        expect(mockListImpressorasLocalizacao).toHaveBeenCalledTimes(1);
        expect(mockGetPadrao).toHaveBeenCalledWith(1);
    });

    it('should handle the case where no printers are found', async () => {
        mockListImpressorasLocalizacao.mockResolvedValue(null);

        await coletaSnmpRotina(rotinaData);

        expect(mockListImpressorasLocalizacao).toHaveBeenCalledWith(rotinaData.localizacao);
        expect(mockGetPadrao).not.toHaveBeenCalled();
    });
});
