import { PrismaClient } from "@prisma/client";
import { Padrao } from '../types/Padrao.type'

const padraoClient = new PrismaClient().padrao;

export const listPadroes = async (): Promise<Padrao[] | false> => {
    try{
        const padroes = await padraoClient.findMany();
        return padroes;
    } catch (error) {
        console.error("Erro ao procurar padrões de impressora: ", error);
        return false;
    }
}

export const createPadrao  = async (padrao:Padrao): Promise<Padrao | false> =>{
    try{
        const newPadrao = await padraoClient.create({data:padrao});
        return newPadrao;

    }
    catch(error) {
        console.error("Erro ao criar padrão de impressora", error);
        return false
    }
}



