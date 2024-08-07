import { PrismaClient, Prisma } from "@prisma/client";
import { Impressora } from '../types/Impressora.type'

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

export const updateContadores = async (id: number, contadores: Partial<Impressora> ): Promise<Impressora | false> => {
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
