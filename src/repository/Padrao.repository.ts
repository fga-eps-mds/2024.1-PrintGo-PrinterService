import { PrismaClient } from "@prisma/client";
import { Padrao } from '../types/Padrao.type'

const padraoClient = new PrismaClient().padrao;

export const listPadroes = async (): Promise<Padrao[] | false> => {
    try {
        const padroes = await padraoClient.findMany({select: {
            id: true,
            ativo: true,
            modelo: true,
            marca: true,
            colorido: true
        }});
        return padroes;
    }
    catch (error) {
        console.error("Erro ao buscar padrões de impressora: ", error);
        return false;
    }
}

export const getById = async (id: number)=> {
    try {
        const padroes = await padraoClient.findUnique({
            where:{
                id:id,
            },
        });
        return padroes;
    }
    catch (error) {
        console.error("Erro ao buscar padrões de impressora: ", error);
        return false;
    }
}

export const createPadrao  = async (padrao:Padrao): Promise<Padrao | false> =>{
    try {
        const newPadrao = await padraoClient.create({data:padrao});
        return newPadrao;
    }
    catch(error) {
        console.error("Erro ao criar padrão de impressora", error);
        return false
    }
}

export const editPadrao = async (id: number, padrao:Padrao)=>{
    try {
        const updatedPadrao = await padraoClient.update({
            where:{id:id},
            data : {id:id,...padrao}
        })
        return updatedPadrao
    } catch (error) {
        console.error("Erro ao editar padrão de impressora", error);
        return false
    }
}

export const desativarPadrao = async (id: number) => {
    try {
        return await padraoClient.update({
            where: { id:id },
            data: { ativo: false }
        });
    } catch (error) {
        console.error("Erro ao desativar padrão:", error);
        return false;
    }
};

export const togglePadrao = async(id: number, status: boolean)=>{
    try {
        return await padraoClient.update({
            where: { id },
            data: { ativo: !status }
        });
    } catch (error) {
        console.error("Erro ao desativar padrão:", error);
        return false;
    }
}