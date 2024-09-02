import { PrismaClient } from "@prisma/client";
import { Padrao } from '../types/Padrao.type'

const prisma = new PrismaClient();
const padraoClient = new PrismaClient().padrao;

export const listPadroes = async (): Promise<Padrao[] | false> => {
    try {
        const padroes = await padraoClient.findMany({
            select: {
                id: true,                 
                marca: true,                
                modelo: true,
                tipo: true,               
                colorido: true,              
                oidModelo: true,             
                oidNumeroSerie: true,        
                oidFirmware: true,           
                oidTempoAtivo: true,         
                oidDigitalizacoes: true,     
                oidCopiasPB: true,           
                oidCopiasCor: true,          
                oidTotalGeral: true,
                ativo: true        
            }
        });
        return padroes;
    } catch (error) {
        console.error("Erro ao buscar padrões de impressora: ", error);
        return false;
    }
}

export const getById = async (id: number): Promise<Padrao | false> => {
    try {
        const padrao = await padraoClient.findUnique({
            where: { id }
        });

        return padrao || false;
    } catch (error) {
        console.error("Erro ao procurar padrão por ID:", error);
        return false;
    }
};

export const createPadrao  = async (padrao: Padrao): Promise<Padrao | false> => {
    try {
        const newPadrao = await padraoClient.create({ data: padrao });
        return newPadrao;
    } catch (error) {
        console.error("Erro ao criar padrão de impressora", error);
        return false;
    }
}

export const editPadrao = async (id: number, padrao: Padrao): Promise<Padrao | false> => {
    try {
        const updatedPadrao = await padraoClient.update({
            where: { id },
            data: { id, ...padrao }
        });
        return updatedPadrao;
    } catch (error) {
        console.error("Erro ao editar padrão de impressora", error);
        return false;
    }
}

export const desativarPadrao = async (id: number): Promise<Padrao | false> => {
    try {
        return await padraoClient.update({
            where: { id },
            data: { ativo: false }
        });
    } catch (error) {
        console.error("Erro ao desativar padrão:", error);
        return false;
    }
};

export const togglePadrao = async (id: number, status: boolean): Promise<Padrao | false> => {
    try {
        return await padraoClient.update({
            where: { id },
            data: { ativo: !status }
        });
    } catch (error) {
        console.error("Erro ao alternar status do padrão:", error);
        return false;
    }
};

export const getPrinterModelIdsByColor = async (isColorido: boolean): Promise<string[]> => {
    try {
        const modelIds = await padraoClient.findMany({
            where: {
                colorido: isColorido,
            },
            select: {
                id: true,
            },
        });

        console.log(
            `IDs de modelos ${isColorido ? 'coloridos' : 'PB'} retornados:`,
            modelIds.map((padrao) => padrao.id)
        );

        return modelIds.map((padrao) => padrao.id.toString());
    } catch (error) {
        console.error(
            `Erro ao buscar IDs de modelos ${isColorido ? 'coloridos' : 'PB'}:`,
            error
        );
        throw new Error(
            `Erro ao buscar IDs de modelos ${isColorido ? 'coloridos' : 'PB'}.`
        );
    }
};
