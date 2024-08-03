import { PrismaClient, Prisma } from "@prisma/client";
import { Impressora } from '../types/Impressora.type'
import { getById } from "./Padrao.repository";
import { getSnmpData} from "../snmp/snmpUtils"

const impressoraClient = new PrismaClient().impressora;
const prisma = new PrismaClient();

export const listImpressoras = async (): Promise<Impressora[] | false> => {
    try {
        const impressoras = await impressoraClient.findMany();
        return impressoras;
    } catch (error) {
        console.error("Erro ao procurar impressoras: ", error);
        return false;
    }
};

export const listImpressorasRelatorio = async (): Promise<Impressora[] | false> => {
    try {
        const impressoras = await impressoraClient.findMany({
            where: {
                ativo: true,
            },
            include: {
                relatorio: true,
            },
        });
        return impressoras;
    } catch (error) {
        console.error("Erro ao procurar impressoras: ", error);
        return false;
    }
}

export const findImpressora = async (id: number): Promise<Impressora | false> => {
    try {
        const impressora = await impressoraClient.findUnique({ where: { id } });
        return impressora;
    } catch (error) {
        console.error("Erro ao procurar impressora única:", error);
        return false;
    }
};

export const findImpressoraWithReport = async (id: number): Promise<Impressora | false> => {
    try {
        const impressora = await impressoraClient.findUnique({ where: { id }, include: {relatorio: true}});
        return impressora;
    } catch (error) {
        console.error("Erro ao procurar impressora única:", error);
        return false;
    }
};

export const findImpressoraByNumSerie = async (numSerie: string): Promise<Impressora | false> => {
    try {
        const impressora = await impressoraClient.findUnique({ where: { numSerie } });
        return impressora;
    } catch (error) {
        console.error("Erro ao procurar impressora única:", error);
        return false;
    }
};

export const createImpressora = async (impressoraDTO: Impressora): Promise<Impressora | false> => {
    const {
        numContrato,
        numSerie,
        enderecoIp,
        estaNaRede,
        dataInstalacao,
        dataRetirada,
        ativo,
        contadorInstalacaoPB,
        contadorInstalacaoCor,
        contadorAtualPB,
        contadorAtualCor,
        contadorRetiradaPB,
        contadorRetiradaCor,
        localizacao,
        modeloId,
    } = impressoraDTO;

    try {
        return await prisma.$transaction(async (prisma) => {
            const impressora = await prisma.impressora.create({
                data: {
                    numContrato,
                    numSerie,
                    enderecoIp,
                    estaNaRede,
                    dataInstalacao,
                    dataRetirada,
                    ativo,
                    contadorInstalacaoPB,
                    contadorInstalacaoCor,
                    contadorAtualPB,
                    contadorAtualCor,
                    contadorRetiradaPB,
                    contadorRetiradaCor,
                    localizacao,
                    modeloId,
                },
            });

            await prisma.relatorio.create({
                data: {
                    impressoraId: impressora.id,
                    contadorPB: impressora.contadorAtualPB,
                    contadorCor: impressora.contadorAtualCor,
                    contadorPBDiff: 0,
                    contadorCorDiff: 0,
                    ultimoResultado: 0,
                    resultadoAtual: 0,
                    ultimaAtualizacao: new Date(),
                },
            });

            return impressora;
        });
    } catch (error) {
        console.error("Erro ao criar impressora:", error);
        return false;
    }
};

export const updateImpressora = async (id: number, data: Partial<Impressora>): Promise<Impressora | false> => {
    try {
        const updatedImpressora = await impressoraClient.update({
            where: { id: id },
            data: data as Prisma.ImpressoraUpdateInput,
        });
        return updatedImpressora;
    } catch (error) {
        console.error("Erro ao atualizar impressora:", error);
        return false;
    }
};

export const deleteImpressora = async (id: number): Promise<Impressora | false> => {
    try {
        const impressora = await impressoraClient.update({
            where: { id },
            data: { ativo: false },
        });
        return impressora;
    } catch (error) {
        console.error("Erro ao desativar impressora:", error);
        return false;
    }
};

export const updatePrinterCounts = async (): Promise<boolean> => {
    try {
        const impressoras = await impressoraClient.findMany();

        for (const impressora of impressoras) {
            const modeloId = parseInt(impressora.modeloId, 10);
            if (isNaN(modeloId)) {
                console.error(`ID de modelo inválido: ${impressora.modeloId}`);
                continue;
            }

            const padrao = await getById(modeloId);
            if (!padrao) {
                console.error(`Padrão não encontrado para o modelo: ${modeloId}`);
                continue;
            }

            const oids = {
                oidModelo: padrao.oidModelo,
                oidNumeroSerie: padrao.oidNumeroSerie,
                oidFirmware: padrao.oidFirmware,
                oidTempoAtivo: padrao.oidTempoAtivo,
                oidDigitalizacoes: padrao.oidDigitalizacoes,
                oidCopiasPB: padrao.oidCopiasPB,
                oidCopiasCor: padrao.oidCopiasCor,
                oidTotalGeral: padrao.oidTotalGeral
            };

            const host = impressora.enderecoIp;
            const oidsArray = Object.values(oids).filter(oid => oid !== null);
            const snmpData = await getSnmpData(host, 161,oidsArray);    //era bom ter o port no banco caso n seja 161 padrao

            const counts = {
                contadorAtualPB: parseInt(snmpData[oids.oidCopiasPB] || '0', 10),
                contadorAtualCor: parseInt(snmpData[oids.oidCopiasCor] || '0', 10)
            };

            await impressoraClient.update({
                where: { id: impressora.id },
                data: counts,
            });
        }

        return true;
    } catch (error) {
        console.error('Erro ao atualizar contagens de impressão via SNMP:', error);
        return false;
    }
};
