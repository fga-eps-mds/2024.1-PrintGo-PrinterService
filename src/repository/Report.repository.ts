import { PrismaClient } from "@prisma/client";
import { Relatorio } from '../types/Relatorio.type';

const relatorioClient = new PrismaClient().relatorio;

export const findById = async (id: number): Promise<Relatorio | false> =>  {
    try {
        const relatorio = await relatorioClient.findUnique({
            where:{
                impressoraId:id,
            },
        });
        return relatorio;
    }
    catch (error) {
        console.error("Erro ao buscar relatório: ", error);
        return false;
    }
}

// export const updateReport = async (id: number, padrao:Padrao)=>{
//   try {
//       const updatedPadrao = await padraoClient.update({
//           where:{id:id},
//           data : {id:id,...padrao}
//       })
//       return updatedPadrao
//   } catch (error) {
//       console.error("Erro ao editar padrão de impressora", error);
//       return false
//   }
// }

