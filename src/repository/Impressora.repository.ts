import { PrismaClient } from "@prisma/client";
import { Impressora } from '../types/Impressora.type'

const impressoraClient = new PrismaClient().impressora;


export const findImpressora = async (numSerie: string): Promise<Impressora | false> => {
    try {
        const impressora = await impressoraClient.findUnique({ where: { numSerie: numSerie } });
        return impressora;
    } catch (error) {
        console.error("Erro ao procurar impressora única:", error);
        return false;
    }
};

export const createImpressora = async (impressoraDTO: Impressora): Promise<Impressora | false> => {
    const {
        contrato,
        numSerie,
        enderecoIp,
        dentroRede,
        dataInstalacao,
        dataRetirada,
        status,
        marca,
        modelo,
        contadorInstalacao,
        contadorRetirada,
        cidade,
        regional,
        subestacao,
    } = impressoraDTO;

    try {
        const impressora = await impressoraClient.create({
            data: {
                contrato,
                numSerie,
                enderecoIp,
                dentroRede,
                dataInstalacao,
                dataRetirada,
                status,
                marca,
                modelo,
                contadorInstalacao,
                contadorRetirada,
                cidade,
                regional,
                subestacao,
            }
        });

        return impressora;
    } catch (error) {
        console.error("Erro ao criar impressora:", error);
        return false
    }
};


