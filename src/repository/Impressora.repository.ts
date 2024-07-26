import { PrismaClient } from "@prisma/client";
import { Impressora, Status } from '../types/Impressora.type'

const impressoraClient = new PrismaClient().impressora;

export const listImpressoras = async (): Promise<Impressora[] | false> => {
    try{
        const impressoras = await impressoraClient.findMany();
        return impressoras;
    } catch (error) {
        console.error("Erro ao procurar impressoras: ", error);
        return false;
    }
}

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
}

export const updateImpressora = async (numSerie: string, impressoraDTO: Partial<Impressora>): Promise<Impressora | false> => {
    try {
        const impressora = await impressoraClient.update({
            where: { numSerie },
            data: impressoraDTO,
        });

        return impressora;
    } catch (error) {
        console.error("Erro ao atualizar impressora:", error);
        return false;
    }
};

// export const deleteImpressora = async (numSerie: string): Promise<boolean> => {
//     try {
//         await impressoraClient.delete({
//             where: { numSerie },
//         });

//         return true;
//     } catch (error) {
//         console.error("Erro ao deletar impressora:", error);
//         return false;
//     }
// };

export const deleteImpressora = async (numSerie: string): Promise<Impressora | false> => {
    try {
        const impressora = await impressoraClient.update({
            where: { numSerie },
            data: { status: Status.INATIVO },
        });
        return impressora;
    } catch (error) {
        console.error("Erro ao atualizar impressora:", error);
        return false;
    }
};
