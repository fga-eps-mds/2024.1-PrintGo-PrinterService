import { PrismaClient, Prisma } from "@prisma/client";
import { Impressora } from '../types/Impressora.type';
import { getLocalizacaoQuery } from "../utils/utils";

const prisma = new PrismaClient();

export const listImpressoras = async (): Promise<Impressora[] | false> => {
    try {
        const impressoras = await prisma.impressora.findMany();
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
        const impressoras = await prisma.impressora.findMany({
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
        const impressoras = await prisma.impressora.findMany({
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
        const impressoras = await prisma.impressora.findMany({
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
        const impressora = await prisma.impressora.findUnique({ where: { id } });
        return impressora;
    } catch (error) {
        console.error("Erro ao procurar impressora única:", error);
        return false;
    }
};

export const findImpressoraWithReport = async (id: number): Promise<Impressora | false> => {
    try {
        const impressora = await prisma.impressora.findUnique({ where: { id }, include: { relatorio: true } });
        return impressora;
    } catch (error) {
        console.error("Erro ao procurar impressora única:", error);
        return false;
    }
};

export const findImpressoraByNumSerie = async (numSerie: string): Promise<Impressora | false> => {
    try {
        const impressora = await prisma.impressora.findUnique({ where: { numSerie } });
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
        const updatedImpressora = await prisma.impressora.update({
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
        const impressora = await prisma.impressora.update({
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
        const updatedImpressora = await prisma.impressora.update({
            where: { id },
            data: contadores as Prisma.ImpressoraUpdateInput,
        });
        return updatedImpressora;
    } catch (error) {
        console.error("Erro ao adicionar contadores:", error);
        return false;
    }
};

export const getTotalImpressions = async (): Promise<{ totalImpressions: number }> => {
    try {
        const totalImpressions = await prisma.impressora.aggregate({
            _sum: {
                contadorAtualPB: true,
                contadorAtualCor: true
            }
        });

        const totalPB = totalImpressions._sum?.contadorAtualPB ?? 0;
        const totalCor = totalImpressions._sum?.contadorAtualCor ?? 0;

        return {
            totalImpressions: totalPB + totalCor
        };
    } catch (error) {
        console.error("Erro ao calcular impressões totais:", error);
        throw new Error("Erro ao calcular impressões totais.");
    }
};

export const getSumOfCountersByLocation = async (): Promise<{ localizacao: string; totalPB: number; totalCor: number }[]> => {
    try {
        const countersByLocation = await prisma.impressora.groupBy({
            by: ['localizacao'],
            _sum: {
                contadorAtualPB: true,
                contadorAtualCor: true
            }
        });

        return countersByLocation.map(location => ({
            localizacao: location.localizacao,
            totalPB: location._sum.contadorAtualPB ?? 0,
            totalCor: location._sum.contadorAtualCor ?? 0
        }));
    } catch (error) {
        console.error("Erro ao calcular a soma dos contadores por localização:", error);
        throw new Error("Erro ao calcular a soma dos contadores por localização.");
    }
};

export const getEquipmentCountByLocation = async (): Promise<{ localizacao: string; totalEquipamentos: number }[]> => {
    try {
        const equipmentCountByLocation = await prisma.impressora.groupBy({
            by: ['localizacao'],
            _count: {
                id: true
            }
        });

        return equipmentCountByLocation.map(location => ({
            localizacao: location.localizacao,
            totalEquipamentos: location._count.id
        }));
    } catch (error) {
        console.error("Erro ao contar o número de equipamentos por localização:", error);
        throw new Error("Erro ao contar o número de equipamentos por localização.");
    }
};

export const countColorPrinters = async (colorModelIds: string[]): Promise<number> => {
    try {
        return await prisma.impressora.count({
            where: {
                modeloId: {
                    in: colorModelIds
                }
            }
        });
    } catch (error) {
        console.error("Erro ao contar impressoras coloridas:", error);
        throw new Error("Erro ao contar impressoras coloridas.");
    }
};





export const countPbPrinters = async (pbModelIds: string[]): Promise<number> => {
    try {

        return await prisma.impressora.count({
            where: {
                modeloId: {
                    in: pbModelIds
                }
            }
        });
    } catch (error) {
        console.error("Erro ao contar impressoras preto e branco:", error);
        throw new Error("Erro ao contar impressoras preto e branco.");
    }
};