import { PrismaClient, Prisma } from "@prisma/client";
import { Impressora } from '../types/Impressora.type';
import { getLocalizacaoQuery } from "../utils/utils";
import { getPrinterModelIdsByColor } from "./Padrao.repository";

const prisma = new PrismaClient();
const impressoraClient = new PrismaClient().impressora;

export const listImpressoras = async (): Promise<Impressora[] | false> => {
    try {
        const impressoras = await impressoraClient.findMany();
        return impressoras;
    } catch (error) {
        console.error("Erro ao procurar impressoras: ", error);
        return false;
    }
};

export const listImpressorasLocalizacao = async (
    localizacao: string | null,
    cidadeTodas: boolean = false,
    regionalTodas: boolean = false,
    unidadeTodas: boolean = false
): Promise<Impressora[] | false> => {

    const localizacaoQuery: string = getLocalizacaoQuery(localizacao, cidadeTodas, regionalTodas, unidadeTodas);

    try {
        const impressoras = await impressoraClient.findMany({
            where: {
                ativo: true,
                localizacao: { startsWith: localizacaoQuery }
            }
        });
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
};

export const listImpressorasContract = async (contractId: string): Promise<Partial<Impressora>[] | false> => {
    try {
        const impressoras = await impressoraClient.findMany({
            where: {
                numContrato: contractId,
            },
            select: {
                id: true,
                numSerie: true,
                contadorAtualPB: true,
                contadorAtualCor: true,
                contadorInstalacaoPB: true,
                contadorInstalacaoCor: true,
                contadorRetiradaPB: true,
                contadorRetiradaCor: true,
                relatorioLocadora: {
                    select: {
                        contadorPB: true,
                        contadorCor: true,
                        contadorTotal: true,
                    },
                },
                relatorio: {
                  select: {
                    id: true,
                    impressoraId: true,
                    contadorPB: true,
                    contadorPBDiff: true,
                    contadorCor: true,
                    contadorCorDiff: true,
                    ultimoResultado: true,
                    resultadoAtual: true,
                    ultimaAtualizacao: true
                  }
                }
            },
        });
        return impressoras;
    } catch (error) {
        console.error("Erro ao procurar impressoras: ", error);
        return false;
    }
};

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
        const impressora = await impressoraClient.findUnique({ where: { id }, include: { relatorio: true } });
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
            const impressora = await impressoraClient.create({
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

export const updateContadores = async (id: number, contadores: Partial<Impressora>): Promise<Impressora | false> => {
    try {
        const updatedImpressora = await impressoraClient.update({
            where: { id },
            data: contadores as Prisma.ImpressoraUpdateInput,
        });
        return updatedImpressora;
    } catch (error) {
        console.error("Erro ao adicionar contadores:", error);
        return false;
    }
};

export const getFiltroOpcoes = async (): Promise<{ cidades: string[], regionais: string[], unidades: string[], periodos: string[] }> => {
    try {
        const impressoras = await impressoraClient.findMany({
            select: {
                localizacao: true,
                dataContador: true,
            },
        });

        const cidades = new Set<string>();
        const regionais = new Set<string>();
        const unidades = new Set<string>();
        const periodos = new Set<string>();

        impressoras.forEach(impressora => {
            const [cidade, regional, unidade] = impressora.localizacao.split(';');
            if (cidade) cidades.add(cidade.trim());
            if (regional) regionais.add(regional.trim());
            if (unidade) unidades.add(unidade.trim());
            if (impressora.dataContador) {
                const periodo = impressora.dataContador.toISOString().slice(0, 7); 
                periodos.add(periodo);
            }
        });

        return {
            cidades: Array.from(cidades),
            regionais: Array.from(regionais),
            unidades: Array.from(unidades),
            periodos: Array.from(periodos).sort((a, b) => b.localeCompare(a)),
        };
    } catch (error) {
        console.error("Erro ao buscar opções de filtro:", error);
        throw new Error("Erro ao buscar opções de filtro.");
    }


};
export const getDashboardData = async (): Promise<{
    impressoras: {
        localizacao: string;
        dataContador: Date | null;
        contadorAtualPB: number;
        contadorAtualCor: number;
        modeloId: string;
    }[];
    totalColorPrinters: number;
    totalPbPrinters: number;
}> => {
    try {
        // Obtém IDs de modelos coloridos e preto e branco
        const colorModelIds = await getPrinterModelIdsByColor(true);
        const pbModelIds = await getPrinterModelIdsByColor(false);

        // Busca todas as impressoras
        const impressoras = await impressoraClient.findMany({
            select: {
                localizacao: true,
                dataContador: true,
                contadorAtualPB: true,
                contadorAtualCor: true,
                modeloId: true,
            }
        });

        // Contagem de impressoras coloridas
        const totalColorPrinters = impressoras.filter(impressora => 
            colorModelIds.includes(impressora.modeloId)
        ).length;

        // Contagem de impressoras PB
        const totalPbPrinters = impressoras.filter(impressora => 
            pbModelIds.includes(impressora.modeloId)
        ).length;

        return {
            impressoras,
            totalColorPrinters,
            totalPbPrinters
        };
    } catch (error) {
        console.error("Erro ao buscar os dados do dashboard:", error);
        throw new Error("Erro ao buscar os dados do dashboard.");
    }
};