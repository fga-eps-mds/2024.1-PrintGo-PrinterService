import { PrismaClient, Prisma } from "@prisma/client";
import { getColorPrinterModelIds, getPbPrinterModelIds } from "./Padrao.repository";


const prisma = new PrismaClient();

export const getFiltroOpcoes = async (): Promise<{ cidades: string[], regionais: string[], unidades: string[], periodos: string[] }> => {
    try {
        const impressoras = await prisma.impressora.findMany({
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
        const colorModelIds = await getColorPrinterModelIds();
        const pbModelIds = await getPbPrinterModelIds();

        // Busca todas as impressoras
        const impressoras = await prisma.impressora.findMany({
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

