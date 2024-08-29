import { PrismaClient, Prisma } from "@prisma/client";


const prisma = new PrismaClient();

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

export const getSumOfCountersByImpressionType = async (): Promise<{ totalPB: number; totalCor: number }> => {
    try {
        const countersByPrinterType = await prisma.impressora.aggregate({
            _sum: {
                contadorAtualPB: true,
                contadorAtualCor: true
            }
        });

        return{
            totalPB: countersByPrinterType._sum.contadorAtualPB ?? 0,
            totalCor: countersByPrinterType._sum.contadorAtualCor ?? 0
        };
    } catch (error) {
        console.error("Erro ao calcular a soma dos contadores por tipo de impressora:", error);
        throw new Error("Erro ao calcular a soma dos contadores por tipo de impressora.");
    }
}