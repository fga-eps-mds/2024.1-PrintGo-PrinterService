import { PrismaClient, Prisma } from "@prisma/client";


const prisma = new PrismaClient();

export const getTotalImpressions = async ({ cidade, regional, unidade, periodo }: { cidade?: string; regional?: string; unidade?: string; periodo?: string }): Promise<{ totalImpressions: number }> => {
    try {
        const whereClause: Prisma.ImpressoraWhereInput = {};

        if (cidade) {
            whereClause.localizacao = {
                startsWith: cidade  // Começa com a cidade selecionada
            };
        }

        if (cidade && regional) {
            whereClause.localizacao = {
                startsWith: `${cidade};${regional}`,  // Começa com cidade e regional
            };
        }

        if (cidade && regional && unidade) {
            whereClause.localizacao = {
                startsWith: `${cidade};${regional};${unidade}`,  // Começa com cidade, regional e unidade
            };
        }

        // Filtragem por mês e ano de dataContador
        if (periodo) {
            const [ano, mes] = periodo.split("-");
            whereClause.dataContador = {
                gte: new Date(`${ano}-${mes}-01`),
                lte: new Date(`${ano}-${mes}-31`)  // Considerando até o final do mês
            };
        }

        const totalImpressions = await prisma.impressora.aggregate({
            _sum: {
                contadorAtualPB: true,
                contadorAtualCor: true
            },
            where: whereClause
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



export const getAllPrintersData = async (): Promise<{ 
    localizacao: string; 
    dataContador: Date | null; 
    contadorAtualPB: number; 
    contadorAtualCor: number; 
    totalEquipamentos: number 
}[]> => {
    try {
        // Obter todos os dados das impressoras
        const allPrinters = await prisma.impressora.findMany({
            select: {
                localizacao: true,
                dataContador: true,
                contadorAtualPB: true,
                contadorAtualCor: true
            }
        });

        // Obter contagem de equipamentos por localização
        const equipmentCountByLocation = await prisma.impressora.groupBy({
            by: ['localizacao'],
            _count: {
                id: true
            }
        });

        // Transformar contagem de equipamentos em um objeto para fácil acesso
        const equipmentCountMap = equipmentCountByLocation.reduce((acc, location) => {
            acc[location.localizacao] = location._count.id;
            return acc;
        }, {} as { [key: string]: number });

        // Combinar os dados de todas as impressoras com a contagem de equipamentos
        return allPrinters.map(printer => ({
            localizacao: printer.localizacao,
            dataContador: printer.dataContador,
            contadorAtualPB: printer.contadorAtualPB ?? 0,
            contadorAtualCor: printer.contadorAtualCor ?? 0,
            totalEquipamentos: equipmentCountMap[printer.localizacao] ?? 0 // Usa 0 se não houver contagem
        }));
    } catch (error) {
        console.error("Erro ao buscar os dados das impressoras com contagem de equipamentos:", error);
        throw new Error("Erro ao buscar os dados das impressoras com contagem de equipamentos.");
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

export const countColorPrinters = async ({ colorModelIds, cidade, regional, unidade, periodo }: { colorModelIds: string[], cidade?: string; regional?: string; unidade?: string; periodo?: string }): Promise<number> => {
    try {
        const whereClause: Prisma.ImpressoraWhereInput = {
            modeloId: {
                in: colorModelIds
            }
        };

        if (cidade) {
            whereClause.localizacao = {
                startsWith: cidade
            };
        }

        if (cidade && regional) {
            whereClause.localizacao = {
                startsWith: `${cidade};${regional}`
            };
        }

        if (cidade && regional && unidade) {
            whereClause.localizacao = {
                startsWith: `${cidade};${regional};${unidade}`
            };
        }

        if (periodo) {
            const [ano, mes] = periodo.split("-");
            whereClause.dataContador = {
                gte: new Date(`${ano}-${mes}-01`),
                lte: new Date(`${ano}-${mes}-31`)
            };
        }

        return await prisma.impressora.count({
            where: whereClause
        });
    } catch (error) {
        console.error("Erro ao contar impressoras coloridas:", error);
        throw new Error("Erro ao contar impressoras coloridas.");
    }
};


export const countPbPrinters = async ({ pbModelIds, cidade, regional, unidade, periodo }: { pbModelIds: string[], cidade?: string; regional?: string; unidade?: string; periodo?: string }): Promise<number> => {
    try {
        const whereClause: Prisma.ImpressoraWhereInput = {
            modeloId: {
                in: pbModelIds
            }
        };

        if (cidade) {
            whereClause.localizacao = {
                startsWith: cidade
            };
        }

        if (cidade && regional) {
            whereClause.localizacao = {
                startsWith: `${cidade};${regional}`
            };
        }

        if (cidade && regional && unidade) {
            whereClause.localizacao = {
                startsWith: `${cidade};${regional};${unidade}`
            };
        }

        if (periodo) {
            const [ano, mes] = periodo.split("-");
            whereClause.dataContador = {
                gte: new Date(`${ano}-${mes}-01`),
                lte: new Date(`${ano}-${mes}-31`)
            };
        }

        return await prisma.impressora.count({
            where: whereClause
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
export const getFiltroOpcoes = async (): Promise<{ cidades: string[], regionais: string[], unidades: string[] }> => {
    try {
        const impressoras = await prisma.impressora.findMany({
            select: {
                localizacao: true,
            },
        });

        const cidades = new Set<string>();
        const regionais = new Set<string>();
        const unidades = new Set<string>();

        impressoras.forEach(impressora => {
            const [cidade, regional, unidade] = impressora.localizacao.split(';');
            if (cidade) cidades.add(cidade.trim());
            if (regional) regionais.add(regional.trim());
            if (unidade) unidades.add(unidade.trim());
        });

        return {
            cidades: Array.from(cidades),
            regionais: Array.from(regionais),
            unidades: Array.from(unidades),
        };
    } catch (error) {
        console.error("Erro ao buscar opções de filtro:", error);
        throw new Error("Erro ao buscar opções de filtro.");
    }
};